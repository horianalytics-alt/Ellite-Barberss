import React, { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
import { AuthProvider } from "../../context/AuthContext";

export const Route = createFileRoute("/admin/")({
  component: AdminIndexPage,
});

function AdminIndexPage() {
  return (
    <AuthProvider>
      <AdminIndex />
    </AuthProvider>
  );
}

function AdminIndex() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      navigate({ to: "/admin/dashboard" });
    } else {
      navigate({ to: "/admin/login" });
    }
  }, [isAuthenticated, loading, navigate]);

  return null;
}
