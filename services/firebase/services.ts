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
  orderBy
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface FirebaseService {
  id: string;
  title: string;
  description: string;
  price: number; // Price in USD
  duration: string;
  category: 'single' | 'subscription';
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get all active services
export const getActiveServices = async (): Promise<FirebaseService[]> => {
  try {
    const q = query(
      collection(db, 'services'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FirebaseService);
  } catch (error: any) {
    throw new Error(`Failed to get services: ${error.message}`);
  }
};

// Get all services (admin)
export const getAllServices = async (): Promise<FirebaseService[]> => {
  try {
    const q = query(
      collection(db, 'services'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FirebaseService);
  } catch (error: any) {
    throw new Error(`Failed to get all services: ${error.message}`);
  }
};

// Get service by ID
export const getServiceById = async (serviceId: string): Promise<FirebaseService | null> => {
  try {
    const serviceDoc = await getDoc(doc(db, 'services', serviceId));
    
    if (!serviceDoc.exists()) {
      return null;
    }
    
    return serviceDoc.data() as FirebaseService;
  } catch (error: any) {
    throw new Error(`Failed to get service: ${error.message}`);
  }
};

// Create new service (admin)
export const createService = async (
  serviceData: Omit<FirebaseService, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FirebaseService> => {
  try {
    const serviceRef = doc(collection(db, 'services'));
    const service: FirebaseService = {
      id: serviceRef.id,
      ...serviceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(serviceRef, service);
    return service;
  } catch (error: any) {
    throw new Error(`Failed to create service: ${error.message}`);
  }
};

// Update service (admin)
export const updateService = async (
  serviceId: string,
  updates: Partial<Omit<FirebaseService, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const serviceRef = doc(db, 'services', serviceId);
    await updateDoc(serviceRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    throw new Error(`Failed to update service: ${error.message}`);
  }
};

// Delete service (admin)
export const deleteService = async (serviceId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'services', serviceId));
  } catch (error: any) {
    throw new Error(`Failed to delete service: ${error.message}`);
  }
};

// Get services by category
export const getServicesByCategory = async (category: 'single' | 'subscription'): Promise<FirebaseService[]> => {
  try {
    const q = query(
      collection(db, 'services'),
      where('isActive', '==', true),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FirebaseService);
  } catch (error: any) {
    throw new Error(`Failed to get services by category: ${error.message}`);
  }
}; 