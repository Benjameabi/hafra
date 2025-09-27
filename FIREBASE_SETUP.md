# 🔥 Firebase Integration Setup

Your Enrique Díaz Coaching App now has Firebase integration for authentication, data storage, and real-time messaging!

## 📋 **What's Been Added**

### ✅ **Firebase Services Implemented:**
- **Authentication** - Sign up, login, logout with email/password
- **Firestore Database** - User profiles, appointments, messages, services
- **Real-time Chat** - Live messaging between users and admin
- **Data Management** - CRUD operations for all app data

### ✅ **New Firebase Files Created:**
```
config/
  firebase.ts                    # Firebase configuration
services/firebase/
  auth.ts                       # Authentication services
  appointments.ts               # Appointment management
  messages.ts                   # Chat/messaging system
  services.ts                   # Coaching services management
  collections.ts                # Database structure documentation
  index.ts                      # Main Firebase exports
store/
  auth-store.ts                 # Updated to use Firebase Auth
```

## 🚀 **Setup Instructions**

### **1. Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "enrique-diaz-coaching"
4. Enable Google Analytics (optional)

### **2. Enable Authentication**
1. In Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password" authentication
3. Save changes

### **3. Create Firestore Database**
1. In Firebase Console → Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location

### **4. Get Firebase Configuration**
1. In Firebase Console → Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" → Web app (</>) 
4. Name it "Enrique Coaching App"
5. Copy the `firebaseConfig` object values

### **5. Configure Environment Variables**
Create a `.env` file in your project root:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**⚠️ Replace the placeholder values with your actual Firebase config values!**

### **6. Update Firebase Rules (Optional)**
For production, update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Appointments - users can only access their own
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Messages - only conversation participants can access
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
    }
    
    // Services - public read, admin write
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🎯 **How It Works**

### **Authentication Flow:**
1. User signs up → Creates Firebase Auth account + Firestore user profile
2. User logs in → Gets Firebase Auth token + loads user profile
3. Auth state persists → Auto-login on app restart

### **Data Structure:**
```
Firestore Collections:
├── users/               # User profiles and settings
├── appointments/        # Booking and scheduling data
├── messages/           # Chat messages
├── conversations/      # Chat conversation metadata
├── services/          # Coaching services offered
├── newsletters/       # Email subscriptions
├── podcasts/         # Podcast series
├── podcast_episodes/ # Individual episodes
└── testimonials/     # Client reviews
```

### **Real-time Features:**
- **Live Chat**: Messages sync in real-time between users
- **Appointment Updates**: Status changes reflect immediately
- **User Status**: Online/offline status tracking

## 🔧 **Development vs Production**

### **Development Mode:**
- Firestore rules allow all reads/writes
- Authentication emails not required to be verified
- Use test data and mock services

### **Production Mode:**
- Implement proper Firestore security rules
- Enable email verification for new accounts
- Set up proper backup and monitoring

## 📱 **Testing the Integration**

1. **Start the app**: `bun start`
2. **Try sign up**: Create a new account
3. **Check Firebase Console**: Verify user appears in Authentication
4. **Test login**: Sign in with the created account
5. **Verify Firestore**: Check if user document is created

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"Firebase not initialized" error**
   - Check if environment variables are set correctly
   - Verify Firebase config in `config/firebase.ts`

2. **Permission denied errors**
   - Ensure Firestore is in "test mode" for development
   - Check authentication state

3. **Auth state not persisting**
   - Firebase auth listener is set up in `app/_layout.tsx`
   - Check if `initializeFirebaseAuth()` is being called

4. **Real-time updates not working**
   - Verify Firestore rules allow reads
   - Check network connectivity

## 🎉 **You're Ready!**

Your coaching app now has:
- ✅ Secure user authentication
- ✅ Cloud database storage
- ✅ Real-time messaging
- ✅ Scalable backend infrastructure

**Next Steps:**
1. Set up your Firebase project
2. Configure environment variables  
3. Test authentication and data flow
4. Deploy to production when ready!

---

*Need help? Check the Firebase documentation or reach out for support!* 