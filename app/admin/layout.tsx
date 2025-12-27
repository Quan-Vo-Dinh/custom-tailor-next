"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Allow both ADMIN and STAFF to access admin pages
  return (
    <ProtectedRoute requiredRole={[UserRole.ADMIN, UserRole.STAFF]}>
      {children}
    </ProtectedRoute>
  );
}
