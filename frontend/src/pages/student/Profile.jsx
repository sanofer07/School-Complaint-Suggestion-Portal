import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiHash, FiBookOpen, FiPhone, FiLock } from 'react-icons/fi';
import StudentLayout from '../../components/student/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '', phone: user?.phone || '', class: user?.class || '', studentId: user?.studentId || ''
  });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePwChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile(formData);
      updateUser(data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setPwLoading(true);
    try {
      await authAPI.changePassword(passwordData);
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <StudentLayout title="Profile">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={user?.email} disabled className="input-field pl-10 bg-gray-100 cursor-not-allowed" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <div className="relative">
                  <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <div className="relative">
                  <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="class" value={formData.class} onChange={handleChange} className="input-field pl-10" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field pl-10" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" name="currentPassword" required value={passwordData.currentPassword} onChange={handlePwChange} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" name="newPassword" required minLength={6} value={passwordData.newPassword} onChange={handlePwChange} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" name="confirmPassword" required value={passwordData.confirmPassword} onChange={handlePwChange} className="input-field pl-10" />
              </div>
            </div>
            <button type="submit" disabled={pwLoading} className="btn-primary">
              {pwLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
};

export default Profile;
