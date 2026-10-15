import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';
import { DEMO_USERS } from '../lib/mockData';
import { getFirebaseAuth, getIsFirebaseConfigured } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, pass: string, requestedRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  isFirebaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('info_cms_auth_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.student; // Default pre-loaded in demo mode for instant testing or set to null
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('info_cms_is_demo') !== 'false';
  });

  const isFirebaseActive = getIsFirebaseConfigured();

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('info_cms_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('info_cms_auth_user');
    }
  }, [currentUser]);

  // If real firebase is configured, listen to onAuthStateChanged
  useEffect(() => {
    const fbAuth = getFirebaseAuth();
    if (fbAuth && !isDemoMode) {
      const unsub = onAuthStateChanged(fbAuth, (user) => {
        if (!user) {
          setCurrentUser(null);
        }
      });
      return () => unsub();
    }
  }, [isDemoMode]);

  const login = async (
    email: string,
    pass: string,
    requestedRole?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Check if Real Firebase mode is requested
    const fbAuth = getFirebaseAuth();
    if (fbAuth && !isDemoMode && cleanEmail) {
      try {
        const userCred = await signInWithEmailAndPassword(fbAuth, cleanEmail, pass);
        // Map user to profile
        const userProfile: UserProfile = {
          uid: userCred.user.uid,
          email: userCred.user.email || cleanEmail,
          displayName: userCred.user.displayName || 'Authorized User',
          role: requestedRole || 'student',
          department: 'Computer Science and Engineering',
        };
        setCurrentUser(userProfile);
        setIsDemoMode(false);
        localStorage.setItem('info_cms_is_demo', 'false');
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Firebase Authentication failed.' };
      }
    }

    // Demo Mode Authentication
    if (cleanEmail === 'hod.cse@infoengg.edu.in' || cleanEmail === 'hod@infoengg.edu.in' || requestedRole === 'hod') {
      setCurrentUser(DEMO_USERS.hod);
      setIsDemoMode(true);
      localStorage.setItem('info_cms_is_demo', 'true');
      return { success: true };
    }

    if (
      cleanEmail === 'meenakshi.cse@infoengg.edu.in' ||
      cleanEmail === 'adviser@infoengg.edu.in' ||
      requestedRole === 'adviser'
    ) {
      setCurrentUser(DEMO_USERS.adviser);
      setIsDemoMode(true);
      localStorage.setItem('info_cms_is_demo', 'true');
      return { success: true };
    }

    if (
      cleanEmail === 'harish.22cs042@infoengg.edu.in' ||
      cleanEmail === 'student@infoengg.edu.in' ||
      cleanEmail.includes('22cs') ||
      requestedRole === 'student'
    ) {
      setCurrentUser(DEMO_USERS.student);
      setIsDemoMode(true);
      localStorage.setItem('info_cms_is_demo', 'true');
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. For Demo Mode, please use the provided demo role buttons or institution test emails.',
    };
  };

  const logout = async () => {
    const fbAuth = getFirebaseAuth();
    if (fbAuth && !isDemoMode) {
      try {
        await fbSignOut(fbAuth);
      } catch (e) {
        console.error('Firebase signout error', e);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('info_cms_auth_user');
  };

  const switchDemoRole = (newRole: UserRole) => {
    setIsDemoMode(true);
    localStorage.setItem('info_cms_is_demo', 'true');
    setCurrentUser(DEMO_USERS[newRole]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        isDemoMode,
        login,
        logout,
        switchDemoRole,
        isFirebaseActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
