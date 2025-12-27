"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { signIn, signOut, getCurrentUser } from "@/services/auth";
import { UserRole } from "@/types";
import { getAuthToken, removeAuthToken } from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isCustomer: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!user;
  const isAdmin = user?.role === UserRole.ADMIN;
  const isStaff = user?.role === UserRole.STAFF || isAdmin;
  const isCustomer = user?.role === UserRole.CUSTOMER;

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          role: currentUser.role as UserRole,
          name: currentUser.profile?.fullName,
          phone: currentUser.profile?.phone,
          avatar: currentUser.profile?.avatarUrl,
        });
      } catch {
        // Token invalid or expired - clear it
        removeAuthToken();
        if (typeof window !== "undefined") {
          localStorage.removeItem("refreshToken");
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await signIn({ email, password });
    setUser({
      id: response.user.id,
      email: response.user.email,
      role: response.user.role as UserRole,
      name: response.user.profile?.fullName,
      phone: response.user.profile?.phone,
      avatar: response.user.profile?.avatarUrl,
    });
    // Store refresh token
    if (typeof window !== "undefined" && response.refreshToken) {
      localStorage.setItem("refreshToken", response.refreshToken);
    }
  };

  const logout = () => {
    removeAuthToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("refreshToken");
    }
    setUser(null);
    signOut();
  };

  const refreshUser = async () => {
    const currentUser = await getCurrentUser();
    setUser({
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role as UserRole,
      name: currentUser.profile?.fullName,
      phone: currentUser.profile?.phone,
      avatar: currentUser.profile?.avatarUrl,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isStaff,
        isCustomer,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
