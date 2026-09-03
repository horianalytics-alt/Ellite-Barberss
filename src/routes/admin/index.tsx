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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/admin/dashboard" });
    } else {
      navigate({ to: "/admin/login" });
    }
  }, [isAuthenticated, navigate]);

  return null;
}
