import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';
import StudentLayout from '../../components/student/StudentLayout';
import { suggestionAPI } from '../../utils/api';
import { CATEGORIES } from '../../utils/helpers';

const SubmitSuggestion = () => {
  const [formData, setFormData] = useState({ title: '', description: '', category: '', isAnonymous: false });
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
      await suggestionAPI.submit(formData);
      toast.success('Suggestion submitted successfully!');
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit suggestion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout title="Submit Suggestion">
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text" name="title" required maxLength={200} value={formData.title} onChange={handleChange}
              className="input-field" placeholder="Brief summary of your idea"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description" required maxLength={2000} rows={5} value={formData.description} onChange={handleChange}
              className="input-field resize-none" placeholder="Describe your suggestion in detail..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" required value={formData.category} onChange={handleChange} className="input-field">
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <label className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer">
            <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} className="w-4 h-4 accent-primary-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Submit anonymously</p>
              <p className="text-xs text-gray-500">Your name will be shown as "Anonymous Student" to the admin.</p>
            </div>
          </label>

          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <FiSend /> {loading ? 'Submitting...' : 'Submit Suggestion'}
          </button>
        </form>
      </div>
    </StudentLayout>
  );
};

export default SubmitSuggestion;
