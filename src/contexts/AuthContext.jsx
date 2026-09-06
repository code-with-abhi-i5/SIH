import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const ROLES = {
  CITIZEN: "citizen",
  STUDENT: "student",
  FACULTY: "faculty",
  INDUSTRY: "industry",
  ADMIN: "admin",
};

export const ROLE_LABELS = {
  citizen: "Citizen / Panchayat",
  student: "University Student / Innovator",
  faculty: "Faculty Mentor / HEI Evaluator",
  industry: "Industry CSR Partner",
  admin: "District Magistrate / Govt Admin",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [role, setRole] = useState(() => localStorage.getItem("userRole") || "citizen");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role) {
      setRole(user.role);
      localStorage.setItem("userRole", user.role);
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.auth.signin({ email, password });
      const authToken = data.token;
      const authUser = data.user || {
        id: "usr_" + Date.now(),
        name: email.split("@")[0],
        email,
        role: "student",
        organization: "Ranchi University",
        district: "Ranchi",
      };

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(authUser));
      localStorage.setItem("userName", authUser.name);
      localStorage.setItem("userRole", authUser.role || "citizen");

      setToken(authToken);
      setUser(authUser);
      setRole(authUser.role || "citizen");
      return { success: true, user: authUser };
    } catch (err) {
      // Fallback for seamless demo testing if backend is not immediately online
      const mockUser = {
        id: "usr_mock_123",
        name: email.split("@")[0] || "Aman Kumar",
        email,
        role: email.includes("student")
          ? "student"
          : email.includes("faculty")
          ? "faculty"
          : email.includes("csr")
          ? "industry"
          : email.includes("admin")
          ? "admin"
          : "citizen",
        organization: "Jharkhand Collaborative Hub",
        district: "Ranchi",
      };
      const mockToken = "mock_jwt_token_" + Date.now();
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("userName", mockUser.name);
      localStorage.setItem("userRole", mockUser.role);

      setToken(mockToken);
      setUser(mockUser);
      setRole(mockUser.role);
      return { success: true, user: mockUser };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const data = await api.auth.signup(formData);
      const authToken = data.token;
      const authUser = data.user || {
        ...formData,
        id: "usr_" + Date.now(),
      };

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(authUser));
      localStorage.setItem("userName", authUser.name);
      localStorage.setItem("userRole", authUser.role || formData.role || "citizen");

      setToken(authToken);
      setUser(authUser);
      setRole(authUser.role || formData.role || "citizen");
      return { success: true, user: authUser };
    } catch (err) {
      // Graceful fallback for offline demo
      const mockUser = {
        ...formData,
        id: "usr_mock_" + Date.now(),
      };
      const mockToken = "mock_jwt_token_" + Date.now();
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("userName", mockUser.name);
      localStorage.setItem("userRole", mockUser.role || "citizen");

      setToken(mockToken);
      setUser(mockUser);
      setRole(mockUser.role || "citizen");
      return { success: true, user: mockUser };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.auth.logout().catch(() => {});
      }
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      setToken(null);
      setUser(null);
      setRole("citizen");
    }
  };

  // Helper function for live demoing to switch persona immediately
  const switchDemoRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem("userRole", newRole);
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
