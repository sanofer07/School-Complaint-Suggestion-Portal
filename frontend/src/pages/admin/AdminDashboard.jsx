import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiClipboard, FiThumbsUp, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/common/StatCard';
import { Spinner, EmptyState, Badge } from '../../components/common/Common';
import { userAPI } from '../../utils/api';
import { STATUS_COLORS, formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await userAPI.getDashboardStats();
      setStats(data.stats);
      setRecentComplaints(data.recentComplaints);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<FiUsers />} label="Total Students" value={stats.totalStudents} color="blue" />
        <StatCard icon={<FiClipboard />} label="Total Complaints" value={stats.totalComplaints} color="purple" />
        <StatCard icon={<FiThumbsUp />} label="Total Suggestions" value={stats.totalSuggestions} color="green" />
        <StatCard icon={<FiClock />} label="Pending Complaints" value={stats.pendingComplaints} color="yellow" />
        <StatCard icon={<FiCheckCircle />} label="Resolved Complaints" value={stats.resolvedComplaints} color="green" />
        <StatCard icon={<FiAlertTriangle />} label="High Priority (Open)" value={stats.highPriority} color="red" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Complaints</h3>
          <Link to="/admin/complaints" className="text-sm text-primary-600 font-medium">View all</Link>
        </div>
        {recentComplaints.length === 0 ? (
          <EmptyState icon={<FiClipboard />} title="No complaints yet" message="New complaints from students will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-2 pr-4">Ticket ID</th>
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Submitted By</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((c) => (
                  <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-700">{c.ticketId}</td>
                    <td className="py-3 pr-4 text-gray-700">{c.title}</td>
                    <td className="py-3 pr-4 text-gray-500">{c.submitterName}</td>
                    <td className="py-3 pr-4"><Badge className={STATUS_COLORS[c.status]}>{c.status}</Badge></td>
                    <td className="py-3 pr-4 text-gray-500">{formatDate(c.createdAt)}</td>
                    <td className="py-3 pr-4">
                      <Link to={`/admin/complaint/${c._id}`} className="text-primary-600 font-medium">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
