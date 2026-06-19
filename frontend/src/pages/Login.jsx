import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      if (data.user.role === 'admin') {
        toast.error('Please use the Admin Login page');
        return;
      }
      toast.success('Welcome back!');
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Student Login</h1>
          <p className="text-gray-500 mb-6">Sign in to manage your complaints and suggestions.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="input-field pl-10" placeholder="you@school.edu"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password" name="password" required value={formData.password} onChange={handleChange}
                  className="input-field pl-10" placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account? <Link to="/register" className="text-primary-600 font-medium">Register</Link>
          </p>
          <p className="text-center text-sm text-gray-400 mt-2">
            <Link to="/admin/login" className="hover:text-primary-600">Admin / Headmaster Login</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
