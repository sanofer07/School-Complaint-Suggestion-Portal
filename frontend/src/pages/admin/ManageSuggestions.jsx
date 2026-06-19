import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiThumbsUp, FiX } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { Spinner, EmptyState, Badge } from '../../components/common/Common';
import { suggestionAPI } from '../../utils/api';
import { STATUS_COLORS, CATEGORIES, SUGGESTION_STATUSES, formatDate } from '../../utils/helpers';

const ManageSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', category: '' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [respStatus, setRespStatus] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const { data } = await suggestionAPI.getAll({ ...filters, page, limit: 10 });
      setSuggestions(data.suggestions);
      setPages(data.pages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setPage(1);
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const openModal = (s) => {
    setSelected(s);
    setRespStatus(s.status);
    setAdminResponse(s.adminResponse || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await suggestionAPI.update(selected._id, { status: respStatus, adminResponse });
      toast.success('Suggestion updated successfully');
      setSelected(null);
      fetchSuggestions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Manage Suggestions">
      <div className="card mb-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" name="search" value={filters.search} onChange={handleFilterChange}
              placeholder="Search by title or name" className="input-field pl-10"
            />
          </div>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="input-field">
            <option value="">All Statuses</option>
            {SUGGESTION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="input-field">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : suggestions.length === 0 ? (
          <EmptyState icon={<FiThumbsUp />} title="No suggestions found" message="Student suggestions will appear here." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-2 pr-4">Title</th>
                    <th className="py-2 pr-4">Submitted By</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.map((s) => (
                    <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 pr-4 text-gray-700 max-w-xs truncate">{s.title}</td>
                      <td className="py-3 pr-4 text-gray-500">{s.submitterName}</td>
                      <td className="py-3 pr-4 text-gray-500">{s.category}</td>
                      <td className="py-3 pr-4"><Badge className={STATUS_COLORS[s.status]}>{s.status}</Badge></td>
                      <td className="py-3 pr-4 text-gray-500">{formatDate(s.createdAt)}</td>
                      <td className="py-3 pr-4">
                        <button onClick={() => openModal(s)} className="text-primary-600 font-medium">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium ${page === p ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-800 text-lg">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
            </div>
            <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">{selected.description}</p>
            <div className="text-sm text-gray-500 mb-4 flex gap-4">
              <span>By: <strong className="text-gray-700">{selected.submitterName}</strong></span>
              <span>Category: <strong className="text-gray-700">{selected.category}</strong></span>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={respStatus} onChange={(e) => setRespStatus(e.target.value)} className="input-field">
                  {SUGGESTION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Response</label>
                <textarea
                  value={adminResponse} onChange={(e) => setAdminResponse(e.target.value)} rows={3}
                  className="input-field resize-none" placeholder="Optional response visible to the student"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setSelected(null)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageSuggestions;
