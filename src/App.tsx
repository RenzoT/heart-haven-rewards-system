
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { StoreProvider } from "./contexts/StoreContext";
import { HistoryProvider } from "./contexts/HistoryContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminStore from "./pages/admin/Store";
import AdminHistory from "./pages/admin/History";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentStore from "./pages/student/Store";
import StudentHistory from "./pages/student/History";
import StudentProfile from "./pages/student/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StoreProvider>
          <HistoryProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />
                
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/students"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminStudents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/store"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminStore />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/history"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminHistory />
                    </ProtectedRoute>
                  }
                />
                
                {/* Student Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/store"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <StudentStore />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/history"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <StudentHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/profile"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <StudentProfile />
                    </ProtectedRoute>
                  }
                />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </HistoryProvider>
        </StoreProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
