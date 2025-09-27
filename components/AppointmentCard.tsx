import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { Appointment } from '@/types';
import { services } from '@/mocks/services';
import Colors from '@/constants/colors';
import Button from './Button';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onReschedule?: (appointment: Appointment) => void;
}

export default function AppointmentCard({ 
  appointment, 
  onCancel, 
  onReschedule 
}: AppointmentCardProps) {
  const { id, serviceId, date, startTime, status, notes } = appointment;
  
  // Find service details
  const service = services.find(s => s.id === serviceId);
  
  if (!service) return null;
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return Colors.success;
      case 'pending':
        return Colors.secondary;
      case 'cancelled':
        return Colors.error;
      case 'completed':
        return Colors.accent;
      default:
        return Colors.text.light;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{service.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <Calendar size={16} color={Colors.text.secondary} />
        <Text style={styles.infoText}>{date ? formatDate(date) : formatDate(startTime)}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Clock size={16} color={Colors.text.secondary} />
        <Text style={styles.infoText}>{date ? formatTime(date) : formatTime(startTime)} • {service.duration} min</Text>
      </View>
      
      {notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{notes}</Text>
        </View>
      )}
      
      {(status === 'confirmed' || status === 'pending') && (
        <View style={styles.actions}>
          {onReschedule && (
            <Button
              title="Reschedule"
              variant="outline"
              onPress={() => onReschedule(appointment)}
              style={styles.actionButton}
            />
          )}
          {onCancel && (
            <Button
              title="Cancel"
              variant="text"
              onPress={() => onCancel(id)}
              style={styles.actionButton}
              textStyle={{ color: Colors.error }}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  notesContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  actionButton: {
    marginLeft: 8,
  },
});