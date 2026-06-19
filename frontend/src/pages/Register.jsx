import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiHash, FiBookOpen, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', studentId: '', class: '', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      await register(payload);
      toast.success('Account created successfully!');
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card w-full max-w-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Student Account</h1>
          <p className="text-gray-500 mb-6">Register to start submitting complaints and suggestions.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field pl-10" placeholder="Jane Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field pl-10" placeholder="you@school.edu" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <div className="relative">
                  <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} className="input-field pl-10" placeholder="STU2026001" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <div className="relative">
                  <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="class" value={formData.class} onChange={handleChange} className="input-field pl-10" placeholder="10-A" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field pl-10" placeholder="9876543210" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} className="input-field pl-10" placeholder="••••••••" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="input-field pl-10" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 font-medium">Login</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
