import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiMessageCircle, FiSend } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { Spinner, Badge } from '../../components/common/Common';
import { complaintAPI } from '../../utils/api';
import { STATUS_COLORS, PRIORITY_COLORS, STATUSES, formatDateTime } from '../../utils/helpers';

const AdminComplaintDetail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [replyMsg, setReplyMsg] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const { data } = await complaintAPI.getById(id);
      setComplaint(data.complaint);
      setStatus(data.complaint.status);
      setAdminNotes(data.complaint.adminNotes || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setSavingStatus(true);
    try {
      const { data } = await complaintAPI.updateStatus(id, { status, adminNotes });
      setComplaint(data.complaint);
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMsg.trim()) return;
    setSendingReply(true);
    try {
      const { data } = await complaintAPI.reply(id, { message: replyMsg });
      setComplaint(data.complaint);
      setReplyMsg('');
      toast.success('Reply sent successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Complaint Details">
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </AdminLayout>
    );
  }

  if (!complaint) {
    return (
      <AdminLayout title="Complaint Details">
        <p className="text-gray-500">Complaint not found.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Complaint Details">
      <Link to="/admin/complaints" className="inline-flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-primary-600">
        <FiArrowLeft /> Back to Manage Complaints
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-mono text-gray-400">{complaint.ticketId}</span>
                <h2 className="text-xl font-bold text-gray-800 mt-1">{complaint.title}</h2>
              </div>
              <div className="flex gap-2">
                <Badge className={PRIORITY_COLORS[complaint.priority]}>{complaint.priority} Priority</Badge>
                <Badge className={STATUS_COLORS[complaint.status]}>{complaint.status}</Badge>
              </div>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap mb-4">{complaint.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
              <span>Category: <strong className="text-gray-700">{complaint.category}</strong></span>
              <span>Submitted by: <strong className="text-gray-700">{complaint.submitterName}</strong></span>
              {complaint.submittedBy?.email && <span>Email: <strong className="text-gray-700">{complaint.submittedBy.email}</strong></span>}
              <span>Date: <strong className="text-gray-700">{formatDateTime(complaint.createdAt)}</strong></span>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FiMessageCircle /> Replies</h3>
            {complaint.replies?.length > 0 && (
              <div className="space-y-3 mb-4">
                {complaint.replies.map((r, i) => (
                  <div key={i} className="bg-primary-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-primary-700">{r.repliedByName}</span>
                      <span className="text-xs text-gray-400">{formatDateTime(r.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{r.message}</p>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleReply} className="flex gap-2">
              <input
                type="text" value={replyMsg} onChange={(e) => setReplyMsg(e.target.value)}
                placeholder="Type a reply to the student..." className="input-field flex-1"
              />
              <button type="submit" disabled={sendingReply} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                <FiSend /> Send
              </button>
            </form>
          </div>
        </div>

        <div className="card h-fit">
          <h3 className="font-semibold text-gray-800 mb-4">Update Status</h3>
          <form onSubmit={handleStatusUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (internal)</label>
              <textarea
                value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={4}
                className="input-field resize-none" placeholder="Internal notes about this complaint..."
              />
            </div>
            <button type="submit" disabled={savingStatus} className="btn-primary w-full">
              {savingStatus ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminComplaintDetail;
