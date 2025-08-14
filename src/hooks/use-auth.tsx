
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
  getRedirectResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processRedirect = async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result) {
                // User is available in result.user
                // This will be handled by onAuthStateChanged, but we can stop loading here.
            }
        } catch (error) {
            console.error("Error getting redirect result", error);
        } finally {
            // This part is tricky because onAuthStateChanged will also fire.
            // We rely on onAuthStateChanged to set the final loading state.
        }
    };
    
    processRedirect();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithRedirect(auth, provider);
      // After redirect, the page will reload, and the useEffect above will handle the result.
    } catch (error) {
      console.error('Error signing in with Google', error);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
