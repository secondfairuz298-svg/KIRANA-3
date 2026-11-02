import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile, UserRole } from '../types';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmailDemo: (email: string, role: UserRole, displayName: string, studentId?: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  signOut: () => Promise<void>;
  isNewUserRegistration: boolean;
  completeRegistration: (profileData: {
    role: UserRole;
    displayName: string;
    studentId?: string;
    schoolName?: string;
    counselorBio?: string;
    redCardRate?: string;
    avatarUrl?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Built-in soothing avatar presets
export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
];

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUserRegistration, setIsNewUserRegistration] = useState(false);

  // Sync profile from Firestore or local storage fallback for simulated accounts
  const loadProfile = async (uid: string, email?: string | null) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userDocRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        setUserProfile(data);
        setIsNewUserRegistration(false);
      } else if (email) {
        // Check if there is an existing profile with this email (multi-device restoration)
        const q = query(collection(db, 'users'), where('email', '==', email));
        const emailDocs = await getDocs(q);
        if (!emailDocs.empty) {
          const existingData = emailDocs.docs[0].data() as UserProfile;
          // Re-link to current uid
          await setDoc(doc(db, 'users', uid), { ...existingData, uid, updatedAt: new Date().toISOString() });
          setUserProfile({ ...existingData, uid });
          setIsNewUserRegistration(false);
        } else {
          // Check local cache
          const localSaved = localStorage.getItem(`kirana_user_${email}`);
          if (localSaved) {
            const parsed = JSON.parse(localSaved) as UserProfile;
            await setDoc(doc(db, 'users', uid), { ...parsed, uid });
            setUserProfile({ ...parsed, uid });
            setIsNewUserRegistration(false);
          } else {
            setIsNewUserRegistration(true);
            setUserProfile(null);
          }
        }
      } else {
        setIsNewUserRegistration(true);
        setUserProfile(null);
      }
    } catch (err) {
      console.warn('Could not load user profile from Firestore, checking local storage:', err);
      if (email) {
        const localSaved = localStorage.getItem(`kirana_user_${email}`);
        if (localSaved) {
          setUserProfile(JSON.parse(localSaved));
          setIsNewUserRegistration(false);
        } else {
          setIsNewUserRegistration(true);
        }
      } else {
        setIsNewUserRegistration(true);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadProfile(user.uid, user.email);
      } else {
        // Check if there is an active local demo session
        const demoEmail = localStorage.getItem('kirana_active_demo_email');
        if (demoEmail) {
          const cached = localStorage.getItem(`kirana_user_${demoEmail}`);
          if (cached) {
            setUserProfile(JSON.parse(cached));
          }
        } else {
          setUserProfile(null);
        }
        setIsNewUserRegistration(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await loadProfile(result.user.uid, result.user.email);
    } catch (error: unknown) {
      console.error('Google sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmailDemo = async (
    email: string,
    role: UserRole,
    displayName: string,
    studentId?: string
  ) => {
    setLoading(true);
    try {
      const sanitizedEmail = email.trim().toLowerCase();
      const fakeUid = `usr_${sanitizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

      // Check if profile exists in Firestore
      let existingProfile: UserProfile | null = null;
      try {
        const userRef = doc(db, 'users', fakeUid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          existingProfile = snap.data() as UserProfile;
        }
      } catch (err) {
        console.warn('Firestore read error in demo login, using local persistence:', err);
      }

      if (!existingProfile) {
        const local = localStorage.getItem(`kirana_user_${sanitizedEmail}`);
        if (local) {
          existingProfile = JSON.parse(local);
        }
      }

      const profile: UserProfile = existingProfile || {
        uid: fakeUid,
        email: sanitizedEmail,
        displayName: displayName || 'Pengguna KIRANA',
        role,
        avatarUrl: DEFAULT_AVATAR,
        ...(role === 'siswa' && studentId ? { studentId } : {}),
        ...(role === 'siswa' ? { points: 100 } : {}),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        // Strip undefined fields for Firestore
        const cleanForFirestore = Object.fromEntries(
          Object.entries(profile).filter(([_, v]) => v !== undefined)
        );
        await setDoc(doc(db, 'users', fakeUid), cleanForFirestore);
      } catch (err) {
        console.warn('Could not save to Firestore during email login, saving locally:', err);
      }

      localStorage.setItem(`kirana_user_${sanitizedEmail}`, JSON.stringify(profile));
      localStorage.setItem('kirana_active_demo_email', sanitizedEmail);
      setUserProfile(profile);
      setIsNewUserRegistration(false);
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async (profileData: {
    role: UserRole;
    displayName: string;
    studentId?: string;
    schoolName?: string;
    counselorBio?: string;
    redCardRate?: string;
    avatarUrl?: string;
  }) => {
    if (!currentUser && !localStorage.getItem('kirana_active_demo_email')) {
      throw new Error('Tidak ada akun aktif.');
    }

    const uid = currentUser ? currentUser.uid : `usr_${Date.now()}`;
    const email = currentUser?.email || localStorage.getItem('kirana_active_demo_email') || 'user@kirana.id';

    const newProfile: UserProfile = {
      uid,
      email,
      displayName: profileData.displayName,
      role: profileData.role,
      avatarUrl: profileData.avatarUrl || currentUser?.photoURL || DEFAULT_AVATAR,
      ...(profileData.studentId ? { studentId: profileData.studentId } : {}),
      schoolName: profileData.schoolName || 'SMA Negeri 1 Edukasi',
      ...(profileData.counselorBio ? { counselorBio: profileData.counselorBio } : {}),
      ...(profileData.redCardRate ? { redCardRate: profileData.redCardRate } : {}),
      ...(profileData.role === 'siswa' ? { points: 100 } : {}),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const cleanDoc = Object.fromEntries(
        Object.entries(newProfile).filter(([_, v]) => v !== undefined)
      );
      await setDoc(doc(db, 'users', uid), cleanDoc);
    } catch (error) {
      console.warn('Firestore write warning during registration:', error);
    }

    localStorage.setItem(`kirana_user_${email}`, JSON.stringify(newProfile));
    setUserProfile(newProfile);
    setIsNewUserRegistration(false);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = {
      ...userProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      const cleanDoc = Object.fromEntries(
        Object.entries(updated).filter(([_, v]) => v !== undefined)
      );
      await setDoc(doc(db, 'users', userProfile.uid), cleanDoc, { merge: true });
    } catch (err) {
      console.warn('Could not sync profile update to Firestore:', err);
    }

    localStorage.setItem(`kirana_user_${userProfile.email}`, JSON.stringify(updated));
    setUserProfile(updated);
  };

  const deleteUserAccount = async () => {
    if (!userProfile) return;
    const email = userProfile.email;
    const uid = userProfile.uid;

    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (err) {
      console.warn('Could not delete from Firestore:', err);
    }

    localStorage.removeItem(`kirana_user_${email}`);
    localStorage.removeItem('kirana_active_demo_email');
    setUserProfile(null);
    setIsNewUserRegistration(false);

    try {
      if (currentUser) {
        await fbSignOut(auth);
      }
    } catch (err) {
      console.warn('Sign out on delete error:', err);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('kirana_active_demo_email');
    setUserProfile(null);
    setIsNewUserRegistration(false);
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Firebase sign out error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signInWithGoogle,
        signInWithEmailDemo,
        updateUserProfile,
        deleteUserAccount,
        signOut,
        isNewUserRegistration,
        completeRegistration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
