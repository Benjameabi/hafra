import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Calendar, MessageSquare, Users, DollarSign, LogOut, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useAppointmentsStore } from '@/store/appointments-store';
import { users } from '@/mocks/users';
import AppointmentCard from '@/components/AppointmentCard';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { appointments, fetchAppointments, isLoading } = useAppointmentsStore();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      Alert.alert('Unauthorized', 'You do not have permission to access this page');
      router.replace('/');
      return;
    }
    
    fetchAppointments();
  }, [user, router]);
  
  // Count clients (excluding admin)
  const clientCount = users.filter(u => u.role === 'user').length;
  
  // Count upcoming appointments
  const upcomingAppointments = appointments.filter(a => 
    a.status === 'confirmed' || a.status === 'pending'
  ).length;
  
  // Calculate revenue (mock data)
  const revenue = 2450;
  
  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => 
    a.date?.startsWith(today) && 
    (a.status === 'confirmed' || a.status === 'pending')
  );
  
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View>
            <View style={styles.businessHoursContainer}>
              <View style={styles.businessHoursHeader}>
                <Clock size={20} color={Colors.primary} />
                <Text style={styles.businessHoursTitle}>{t('booking.businessHours')}</Text>
              </View>
              <View style={styles.businessHoursContent}>
                <Text style={styles.businessHoursText}>{t('booking.mondayFriday')}</Text>
                <Text style={styles.businessHoursText}>{t('booking.saturdaySunday')}</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>{t('admin.todaysSchedule')}</Text>
            
            {todaysAppointments.length > 0 ? (
              todaysAppointments.map(appointment => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>{t('admin.noAppointmentsToday')}</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => setActiveTab('appointments')}
            >
              <Text style={styles.viewAllText}>{t('admin.viewAllAppointments')}</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'appointments':
        return (
          <View>
            <Text style={styles.sectionTitle}>{t('admin.appointments')}</Text>
            
            {appointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </View>
        );
        
      case 'clients':
        return (
          <View>
            <Text style={styles.sectionTitle}>{t('admin.clientsList')}</Text>
            
            {users.filter(u => u.role === 'user').map(client => (
              <TouchableOpacity 
                key={client.id}
                style={styles.clientCard}
                onPress={() => router.push(`/chat/${client.id}`)}
              >
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientEmail}>{client.email}</Text>
                <Text style={styles.clientStatus}>
                  {t('admin.status')}: {client.subscriptionStatus === 'none' ? t('admin.noSubscription') : client.subscriptionStatus}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
        
      case 'messages':
        return (
          <View>
            <Text style={styles.sectionTitle}>{t('admin.recentMessages')}</Text>
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/chat')}
            >
              <Text style={styles.viewAllText}>{t('admin.goToMessages')}</Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('admin.adminDashboard')}</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <LogOut size={20} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Stats Cards */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Users size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{clientCount}</Text>
            <Text style={styles.statLabel}>{t('admin.clients')}</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Calendar size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{upcomingAppointments}</Text>
            <Text style={styles.statLabel}>{t('admin.upcoming')}</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <DollarSign size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>${revenue}</Text>
            <Text style={styles.statLabel}>{t('admin.revenue')}</Text>
          </View>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab,
              activeTab === 'overview' && styles.activeTab
            ]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'overview' && styles.activeTabText
            ]}>
              {t('admin.overview')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab,
              activeTab === 'appointments' && styles.activeTab
            ]}
            onPress={() => setActiveTab('appointments')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'appointments' && styles.activeTabText
            ]}>
              {t('admin.appointments')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab,
              activeTab === 'clients' && styles.activeTab
            ]}
            onPress={() => setActiveTab('clients')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'clients' && styles.activeTabText
            ]}>
              {t('admin.clients')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab,
              activeTab === 'messages' && styles.activeTab
            ]}
            onPress={() => setActiveTab('messages')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'messages' && styles.activeTabText
            ]}>
              {t('admin.messages')}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        <View style={styles.contentContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            renderContent()
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  logoutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary,
  },
  contentContainer: {
    padding: 16,
  },
  businessHoursContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  businessHoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  businessHoursTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  businessHoursContent: {
    paddingLeft: 4,
  },
  businessHoursText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  viewAllButton: {
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  clientCard: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  clientStatus: {
    fontSize: 14,
    color: Colors.text.light,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});