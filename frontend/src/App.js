import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import SubmitSuggestion from './pages/student/SubmitSuggestion';
import MyComplaints from './pages/student/MyComplaints';
import ComplaintDetails from './pages/student/ComplaintDetails';
import Profile from './pages/student/Profile';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageComplaints from './pages/admin/ManageComplaints';
import AdminComplaintDetail from './pages/admin/AdminComplaintDetail';
import ManageSuggestions from './pages/admin/ManageSuggestions';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Student routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/complaint/new" element={<ProtectedRoute role="student"><SubmitComplaint /></ProtectedRoute>} />
          <Route path="/student/suggestion/new" element={<ProtectedRoute role="student"><SubmitSuggestion /></ProtectedRoute>} />
          <Route path="/student/complaints" element={<ProtectedRoute role="student"><MyComplaints /></ProtectedRoute>} />
          <Route path="/student/complaint/:id" element={<ProtectedRoute role="student"><ComplaintDetails /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute role="student"><Profile /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute role="admin"><ManageComplaints /></ProtectedRoute>} />
          <Route path="/admin/complaint/:id" element={<ProtectedRoute role="admin"><AdminComplaintDetail /></ProtectedRoute>} />
          <Route path="/admin/suggestions" element={<ProtectedRoute role="admin"><ManageSuggestions /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
