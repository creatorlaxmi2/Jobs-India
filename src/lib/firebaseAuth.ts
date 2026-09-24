import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDELWICsmrmBdnQ9GLv1KPHXZNGDfvKb_0",
  authDomain: "jobs-india-65a89.firebaseapp.com",
  projectId: "jobs-india-65a89",
  storageBucket: "jobs-india-65a89.firebasestorage.app",
  messagingSenderId: "23186252601",
  appId: "1:23186252601:web:7513567c94e1636c533ee8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function saveUserToFirestore(userId: string, profileData: any) {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...profileData,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    // Fallback silently if offline or restricted
  }
}

export async function getUserFromFirestore(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    // Fallback
  }
  return null;
}

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
};
export type { User };
