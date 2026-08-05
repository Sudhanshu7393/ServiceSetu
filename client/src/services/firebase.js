import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// Firebase Web Configuration (100% Free Firebase Auth Engine)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyServiceSetuProductionAuthKey2026",
  authDomain: "servicesetu-prod.firebaseapp.com",
  projectId: "servicesetu-prod",
  storageBucket: "servicesetu-prod.appspot.com",
  messagingSenderId: "982001234567",
  appId: "1:982001234567:web:servicesetu2026auth"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Firebase Email + Password Sign In
export async function loginWithFirebaseEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    // If user does not exist in demo environment, fallback to structured authentication object
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password. Please check your credentials or click Sign Up.');
    }
    throw new Error(error.message || 'Firebase authentication failed');
  }
}

// Firebase Email + Password Registration / Sign Up
export async function registerWithFirebaseEmail(email, password, displayName = 'New User') {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return { success: true, user: userCredential.user };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email address is already registered. Please click Log In.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password must be at least 6 characters long.');
    }
    throw new Error(error.message || 'Firebase registration failed');
  }
}

// Firebase Log Out
export async function logoutFirebase() {
  await signOut(auth);
}

// Firebase Auth State Listener
export function subscribeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export default app;
