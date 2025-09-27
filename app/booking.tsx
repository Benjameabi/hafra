import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, CreditCard } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import ServiceCard from '@/components/ServiceCard';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Service } from '@/types';
import { services } from '@/mocks/services';
import { useAuthStore } from '@/store/auth-store';
import { useAppointmentsStore } from '@/store/appointments-store';
import { formatPrice } from '@/constants/currencies';
import { useLanguageStore } from '@/store/language-store';

// Generate available time slots based on business hours
const generateTimeSlots = () => {
  const slots = [];
  const today = new Date();
  
  // Generate slots for the next 14 days
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // Generate time slots for this day (business hours: 9:00 - 18:00)
    const daySlots = [];
    
    // 9 AM to 6 PM (business hours)
    for (let hour = 9; hour < 18; hour++) {
      // Generate slots for each hour
      for (let minute of [0, 30]) { // 30-minute slots
        const time = new Date(date);
        time.setHours(hour, minute, 0, 0);
        
        daySlots.push({
          id: `slot-${date.toDateString()}-${hour}-${minute}`,
          date: time,
          available: Math.random() > 0.3, // Randomly mark some as unavailable
        });
      }
    }
    
    slots.push({
      date,
      slots: daySlots,
    });
  }
  
  return slots;
};

const timeSlots = generateTimeSlots();

export default function BookingScreen() {
  const { serviceId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { bookAppointment, isLoading } = useAppointmentsStore();
  const { currentLanguage } = useLanguageStore();
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    if (serviceId) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        setStep(2);
      }
    }
  }, [serviceId]);
  
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleTimeSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };
  
  const handleContinue = () => {
    if (step === 2 && !selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }
    
    if (step === 2 && !selectedTimeSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleBooking();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };
  
  const handleBooking = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please log in or create an account to book a session',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log In', onPress: () => router.push('/(auth)/login') },
          { text: 'Sign Up', onPress: () => router.push('/(auth)/signup') }
        ]
      );
      return;
    }
    
    if (!selectedService || !selectedDate || !selectedTimeSlot) {
      Alert.alert('Error', 'Please complete all booking details');
      return;
    }
    
    // Find the selected time slot
    const slotId = selectedTimeSlot;
    let selectedTime: Date | null = null;
    
    for (const day of timeSlots) {
      const slot = day.slots.find(s => s.id === slotId);
      if (slot) {
        selectedTime = slot.date;
        break;
      }
    }
    
    if (!selectedTime) {
      Alert.alert('Error', 'Invalid time slot selected');
      return;
    }
    
    try {
      await bookAppointment({
        userId: user.id,
        serviceId: selectedService.id,
        title: selectedService.title,
        description: notes.trim() || '',
        startTime: selectedTime.toISOString(),
        endTime: new Date(selectedTime.getTime() + selectedService.duration * 60000).toISOString(),
        date: selectedTime.toISOString(),
        status: 'pending',
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      Alert.alert(
        'Booking Successful',
        `Your ${selectedService.title} has been booked successfully!`,
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/') 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select a Service</Text>
            <Text style={styles.stepDescription}>
              Choose the type of coaching session you'd like to book.
            </Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={handleServiceSelect}
                  selected={selectedService?.id === service.id}
                />
              ))}
            </ScrollView>
          </View>
        );
        
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Date & Time</Text>
            <Text style={styles.stepDescription}>
              Choose a date and time that works for your schedule.
            </Text>
            
            <View style={styles.businessHoursInfo}>
              <Text style={styles.businessHoursTitle}>Business Hours</Text>
              <Text style={styles.businessHoursText}>Monday - Friday: 9:00 - 18:00</Text>
              <Text style={styles.businessHoursText}>Saturday - Sunday: Closed</Text>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {timeSlots.map(day => (
                <View key={day.date.toDateString()} style={styles.dayContainer}>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      selectedDate?.toDateString() === day.date.toDateString() && styles.selectedDateButton
                    ]}
                    onPress={() => handleDateSelect(day.date)}
                  >
                    <Text style={[
                      styles.dateText,
                      selectedDate?.toDateString() === day.date.toDateString() && styles.selectedDateText
                    ]}>
                      {formatDate(day.date)}
                    </Text>
                  </TouchableOpacity>
                  
                  {selectedDate?.toDateString() === day.date.toDateString() && (
                    <View style={styles.timeSlotsContainer}>
                      {day.slots.map(slot => (
                        <TouchableOpacity
                          key={slot.id}
                          style={[
                            styles.timeSlot,
                            !slot.available && styles.unavailableTimeSlot,
                            selectedTimeSlot === slot.id && styles.selectedTimeSlot
                          ]}
                          onPress={() => slot.available && handleTimeSelect(slot.id)}
                          disabled={!slot.available}
                        >
                          <Text style={[
                            styles.timeSlotText,
                            !slot.available && styles.unavailableTimeSlotText,
                            selectedTimeSlot === slot.id && styles.selectedTimeSlotText
                          ]}>
                            {formatTime(slot.date)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        );
        
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Confirm & Pay</Text>
            <Text style={styles.stepDescription}>
              Review your booking details and complete payment.
            </Text>
            
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Calendar size={20} color={Colors.primary} />
                </View>
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryLabel}>Service</Text>
                  <Text style={styles.summaryValue}>{selectedService?.title}</Text>
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Clock size={20} color={Colors.primary} />
                </View>
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryLabel}>Date & Time</Text>
                  <Text style={styles.summaryValue}>
                    {selectedDate && formatDate(selectedDate)}, {' '}
                    {selectedTimeSlot && formatTime(
                      timeSlots
                        .flatMap(day => day.slots)
                        .find(slot => slot.id === selectedTimeSlot)?.date || new Date()
                    )}
                  </Text>
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <CreditCard size={20} color={Colors.primary} />
                </View>
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryLabel}>Price</Text>
                  <Text style={styles.summaryValue}>
                    {selectedService ? formatPrice(selectedService.price, currentLanguage.code) : '$0'}
                    {selectedService?.type === 'subscription' ? '/month' : ''}
                  </Text>
                </View>
              </View>
            </View>
            
            <Input
              label="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Any specific topics or questions you'd like to discuss?"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              inputStyle={styles.notesInput}
            />
            
            <View style={styles.paymentMethodContainer}>
              <Text style={styles.paymentMethodTitle}>Payment Method</Text>
              
              <TouchableOpacity style={styles.paymentMethodButton}>
                <Text style={styles.paymentMethodText}>Credit Card</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.paymentMethodButton}>
                <Text style={styles.paymentMethodText}>PayPal</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Book a Session" 
        showBackButton={true}
        rightComponent={
          <View style={styles.stepIndicator}>
            <Text style={styles.stepIndicatorText}>{step}/3</Text>
          </View>
        }
      />
      
      {renderStepContent()}
      
      <View style={styles.footer}>
        {step > 1 && (
          <Button
            title="Back"
            variant="outline"
            onPress={handleBack}
            style={styles.backButton}
          />
        )}
        
        <Button
          title={step === 3 ? (selectedService?.price === 0 ? "Confirm Booking" : "Pay & Confirm") : "Continue"}
          onPress={handleContinue}
          loading={isLoading}
          style={styles.continueButton}
          fullWidth={step === 1}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stepIndicator: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  stepContent: {
    flex: 1,
    padding: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  businessHoursInfo: {
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  businessHoursTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  businessHoursText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  dayContainer: {
    marginBottom: 16,
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedDateButton: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  selectedDateText: {
    color: Colors.primary,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    margin: 4,
  },
  unavailableTimeSlot: {
    backgroundColor: Colors.card + '80',
    borderColor: Colors.border + '80',
  },
  selectedTimeSlot: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  unavailableTimeSlotText: {
    color: Colors.text.light,
  },
  selectedTimeSlotText: {
    color: Colors.text.white,
    fontWeight: '500',
  },
  summaryContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  summaryTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  notesInput: {
    height: 120,
    paddingTop: 12,
    marginBottom: 24,
  },
  paymentMethodContainer: {
    marginBottom: 24,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  paymentMethodButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  paymentMethodText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  continueButton: {
    flex: 2,
  },
});