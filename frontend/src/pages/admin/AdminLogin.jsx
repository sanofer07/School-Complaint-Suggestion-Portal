import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
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
      if (data.user.role !== 'admin') {
        toast.error('This login is for administrators only');
        return;
      }
      toast.success('Welcome, Headmaster!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="card w-full max-w-md bg-gray-800 border-gray-700">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center text-white text-2xl mb-3">
            <FiShield />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">Headmaster &amp; School Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email" name="email" required value={formData.email} onChange={handleChange}
                className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="admin@school.edu"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password" name="password" required value={formData.password} onChange={handleChange}
                className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link to="/" className="hover:text-primary-400">Back to Home</Link>
          {' · '}
          <Link to="/login" className="hover:text-primary-400">Student Login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
