'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  signIn,
  signUp,
  signOut,
  getSession,
  getCurrentUserWithProfile,
  isAdmin,
  resetPassword,
  updatePassword,
  onAuthStateChange,
  signInWithMagicLink,
  signInWithOAuth,
  type AuthUser,
} from '../services/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (session) {
        const userWithProfile = await getCurrentUserWithProfile();
        setUser(userWithProfile);
        const adminStatus = await isAdmin();
        setIsAdminUser(adminStatus);
      } else {
        setUser(null);
        setIsAdminUser(false);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get user'));
      setUser(null);
      setIsAdminUser(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    const {
      data: { subscription },
    } = onAuthStateChange(() => {
      refreshUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshUser]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signIn(email, password);
      await refreshUser();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign in failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signUp(email, password);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign up failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign out failed');
      setError(error);
      console.error('Error during sign out:', error);
    } finally {
      // Always clear user state even if server request fails
      setUser(null);
      setIsAdminUser(false);
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await resetPassword(email);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Password reset failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      await updatePassword(newPassword);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Password update failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithMagicLink(email);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Magic link failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'azure') => {
    try {
      setLoading(true);
      setError(null);
      await signInWithOAuth(provider);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('OAuth failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isAdmin: isAdminUser,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    signInWithMagicLink: handleMagicLink,
    signInWithOAuth: handleOAuth,
    refreshUser,
  };
}
