import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiClipboard } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { Spinner, EmptyState, Badge } from '../../components/common/Common';
import { complaintAPI } from '../../utils/api';
import { STATUS_COLORS, PRIORITY_COLORS, CATEGORIES, STATUSES, PRIORITIES, formatDate } from '../../utils/helpers';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', category: '', priority: '' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await complaintAPI.getAll({ ...filters, page, limit: 10 });
      setComplaints(data.complaints);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
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

  return (
    <AdminLayout title="Manage Complaints">
      <div className="card mb-4">
        <div className="grid sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" name="search" value={filters.search} onChange={handleFilterChange}
              placeholder="Search title, ticket, name" className="input-field pl-10"
            />
          </div>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="input-field">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="input-field">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="priority" value={filters.priority} onChange={handleFilterChange} className="input-field">
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">{total} Complaint{total !== 1 ? 's' : ''}</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : complaints.length === 0 ? (
          <EmptyState icon={<FiClipboard />} title="No complaints found" message="Try adjusting your filters." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-2 pr-4">Ticket ID</th>
                    <th className="py-2 pr-4">Title</th>
                    <th className="py-2 pr-4">Submitted By</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Priority</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-700">{c.ticketId}</td>
                      <td className="py-3 pr-4 text-gray-700 max-w-xs truncate">{c.title}</td>
                      <td className="py-3 pr-4 text-gray-500">{c.submitterName}</td>
                      <td className="py-3 pr-4 text-gray-500">{c.category}</td>
                      <td className="py-3 pr-4"><Badge className={PRIORITY_COLORS[c.priority]}>{c.priority}</Badge></td>
                      <td className="py-3 pr-4"><Badge className={STATUS_COLORS[c.status]}>{c.status}</Badge></td>
                      <td className="py-3 pr-4 text-gray-500">{formatDate(c.createdAt)}</td>
                      <td className="py-3 pr-4">
                        <Link to={`/admin/complaint/${c._id}`} className="text-primary-600 font-medium">Manage</Link>
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
    </AdminLayout>
  );
};

export default ManageComplaints;
