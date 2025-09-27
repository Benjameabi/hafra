import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface FirebaseAppointment {
  id: string;
  userId: string;
  serviceId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Create a new appointment
export const createAppointment = async (
  appointmentData: Omit<FirebaseAppointment, 'id'>
): Promise<FirebaseAppointment> => {
  try {
    const appointmentRef = doc(collection(db, 'appointments'));
    const appointment: FirebaseAppointment = {
      id: appointmentRef.id,
      ...appointmentData
    };

    await setDoc(appointmentRef, appointment);
    return appointment;
  } catch (error: any) {
    throw new Error(`Failed to create appointment: ${error.message}`);
  }
};

// Get all appointments for a user
export const getUserAppointments = async (userId: string): Promise<FirebaseAppointment[]> => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('userId', '==', userId),
      orderBy('startTime', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FirebaseAppointment);
  } catch (error: any) {
    throw new Error(`Failed to get user appointments: ${error.message}`);
  }
};

// Get all appointments (for admin)
export const getAllAppointments = async (): Promise<FirebaseAppointment[]> => {
  try {
    const q = query(
      collection(db, 'appointments'),
      orderBy('startTime', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FirebaseAppointment);
  } catch (error: any) {
    throw new Error(`Failed to get all appointments: ${error.message}`);
  }
};

// Update appointment status
export const updateAppointmentStatus = async (
  appointmentId: string, 
  status: FirebaseAppointment['status']
): Promise<void> => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    throw new Error(`Failed to update appointment status: ${error.message}`);
  }
};

// Delete appointment
export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
  } catch (error: any) {
    throw new Error(`Failed to delete appointment: ${error.message}`);
  }
};

// Get upcoming appointments
export const getUpcomingAppointments = async (userId?: string): Promise<FirebaseAppointment[]> => {
  try {
    const now = new Date().toISOString();
    let q;
    
    if (userId) {
      q = query(
        collection(db, 'appointments'),
        where('userId', '==', userId),
        where('startTime', '>=', now),
        where('status', 'in', ['pending', 'confirmed']),
        orderBy('startTime', 'asc')
      );
    } else {
      q = query(
        collection(db, 'appointments'),
        where('startTime', '>=', now),
        where('status', 'in', ['pending', 'confirmed']),
        orderBy('startTime', 'asc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FirebaseAppointment);
  } catch (error: any) {
    throw new Error(`Failed to get upcoming appointments: ${error.message}`);
  }
}; 