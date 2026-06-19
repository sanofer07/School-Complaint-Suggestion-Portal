import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClipboard, FiClock, FiCheckCircle, FiAlertTriangle, FiPlusCircle, FiThumbsUp } from 'react-icons/fi';
import StudentLayout from '../../components/student/StudentLayout';
import StatCard from '../../components/common/StatCard';
import { Spinner, EmptyState, Badge } from '../../components/common/Common';
import { complaintAPI } from '../../utils/api';
import { STATUS_COLORS, PRIORITY_COLORS, formatDate } from '../../utils/helpers';

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await complaintAPI.getMy({ limit: 5 });

console.log(data);

setComplaints(data.complaints || []);
    
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => ['Submitted', 'Under Review', 'In Progress'].includes(c.status)).length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    highPriority: complaints.filter(c => c.priority === 'High').length,
  };

  return (
    <StudentLayout title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<FiClipboard />} label="Total Complaints" value={stats.total} color="blue" />
        <StatCard icon={<FiClock />} label="Pending" value={stats.pending} color="yellow" />
        <StatCard icon={<FiCheckCircle />} label="Resolved" value={stats.resolved} color="green" />
        <StatCard icon={<FiAlertTriangle />} label="High Priority" value={stats.highPriority} color="red" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Link to="/student/complaint/new" className="card hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl"><FiPlusCircle /></div>
          <div>
            <h3 className="font-semibold text-gray-800">Submit a Complaint</h3>
            <p className="text-sm text-gray-500">Raise a new issue for review</p>
          </div>
        </Link>
        <Link to="/student/suggestion/new" className="card hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary-50 text-secondary-600 flex items-center justify-center text-2xl"><FiThumbsUp /></div>
          <div>
            <h3 className="font-semibold text-gray-800">Submit a Suggestion</h3>
            <p className="text-sm text-gray-500">Share an idea to improve school life</p>
          </div>
        </Link>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Complaints</h3>
          <Link to="/student/complaints" className="text-sm text-primary-600 font-medium">View all</Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : complaints.length === 0 ? (
          <EmptyState
            icon={<FiClipboard />}
            title="No complaints yet"
            message="When you submit a complaint, it'll show up here so you can track its progress."
            action={<Link to="/student/complaint/new" className="btn-primary">Submit Complaint</Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-2 pr-4">Ticket ID</th>
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Priority</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <Link to={`/student/complaint/${c._id}`} className="text-primary-600 font-medium">{c.ticketId}</Link>
                    </td>
                    <td className="py-3 pr-4 text-gray-700">{c.title}</td>
                    <td className="py-3 pr-4 text-gray-500">{c.category}</td>
                    <td className="py-3 pr-4"><Badge className={PRIORITY_COLORS[c.priority]}>{c.priority}</Badge></td>
                    <td className="py-3 pr-4"><Badge className={STATUS_COLORS[c.status]}>{c.status}</Badge></td>
                    <td className="py-3 pr-4 text-gray-500">{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
