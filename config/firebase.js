import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBUvEDoK1THx96EdWFSIPLSmEPMqfi3I_Q",
  authDomain: "linkselect-32540.firebaseapp.com",
  projectId: "linkselect-32540",
  storageBucket: "linkselect-32540.firebasestorage.app",
  messagingSenderId: "886995667886",
  appId: "1:886995667886:web:32430b464dfec078b4563f"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);