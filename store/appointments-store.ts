import { create } from 'zustand';
import { Appointment } from '@/types';
import { appointments as mockAppointments } from '@/mocks/appointments';
import { createAppointment } from '@/services/firebase/appointments';

interface AppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  fetchAppointments: (userId?: string) => Promise<void>;
  bookAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
}

export const useAppointmentsStore = create<AppointmentsState>((set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,
  
  fetchAppointments: async (userId?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter appointments by userId if provided
      const filteredAppointments = userId 
        ? mockAppointments.filter(a => a.userId === userId)
        : mockAppointments;
      
      set({ appointments: filteredAppointments, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch appointments", 
        isLoading: false 
      });
    }
  },
  
  bookAppointment: async (appointmentData) => {
    set({ isLoading: true, error: null });
    
    try {
      // First try to save to Firebase
      try {
        await createAppointment({
          userId: appointmentData.userId,
          serviceId: appointmentData.serviceId,
          title: appointmentData.title,
          description: appointmentData.description || '',
          startTime: appointmentData.startTime,
          endTime: appointmentData.endTime,
          date: appointmentData.date,
          status: appointmentData.status,
          notes: appointmentData.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log('✅ Appointment saved to Firebase!');
      } catch (firebaseError) {
        console.error('❌ Firebase save failed:', firebaseError);
      }
      
      // Also save to local store for immediate UI update
      const newAppointment: Appointment = {
        id: `appointment-${Date.now()}`,
        ...appointmentData
      };
      
      set(state => ({ 
        appointments: [...state.appointments, newAppointment],
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to book appointment", 
        isLoading: false 
      });
    }
  },
  
  updateAppointmentStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        appointments: state.appointments.map(appointment => 
          appointment.id === id ? { ...appointment, status } : appointment
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to update appointment", 
        isLoading: false 
      });
    }
  },
  
  cancelAppointment: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        appointments: state.appointments.map(appointment => 
          appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to cancel appointment", 
        isLoading: false 
      });
    }
  }
}));