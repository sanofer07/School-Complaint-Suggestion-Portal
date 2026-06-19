import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';
import StudentLayout from '../../components/student/StudentLayout';
import { complaintAPI } from '../../utils/api';
import { CATEGORIES, PRIORITIES } from '../../utils/helpers';

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', priority: 'Medium', isAnonymous: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    setLoading(true);
    try {
      const { data } = await complaintAPI.submit(formData);
      toast.success(`Complaint submitted! Ticket ID: ${data.complaint.ticketId}`);
      navigate('/student/complaints');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout title="Submit Complaint">
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text" name="title" required maxLength={200} value={formData.title} onChange={handleChange}
              className="input-field" placeholder="Brief summary of the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description" required maxLength={2000} rows={5} value={formData.description} onChange={handleChange}
              className="input-field resize-none" placeholder="Describe the issue in detail..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" required value={formData.category} onChange={handleChange} className="input-field">
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="input-field">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer">
            <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} className="w-4 h-4 accent-primary-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Submit anonymously</p>
              <p className="text-xs text-gray-500">Your name will be shown as "Anonymous Student" to the admin.</p>
            </div>
          </label>

          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <FiSend /> {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </StudentLayout>
  );
};

export default SubmitComplaint;
