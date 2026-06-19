import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMessageCircle } from 'react-icons/fi';
import StudentLayout from '../../components/student/StudentLayout';
import { Spinner, Badge } from '../../components/common/Common';
import { complaintAPI } from '../../utils/api';
import { STATUS_COLORS, PRIORITY_COLORS, formatDateTime, STATUSES } from '../../utils/helpers';

const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const { data } = await complaintAPI.getById(id);
      setComplaint(data.complaint);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout title="Complaint Details">
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </StudentLayout>
    );
  }

  if (!complaint) {
    return (
      <StudentLayout title="Complaint Details">
        <p className="text-gray-500">Complaint not found.</p>
      </StudentLayout>
    );
  }

  const currentStep = STATUSES.indexOf(complaint.status);

  return (
    <StudentLayout title="Complaint Details">
      <Link to="/student/complaints" className="inline-flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-primary-600">
        <FiArrowLeft /> Back to My Complaints
      </Link>

      <div className="card mb-6">
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
          <span>Submitted: <strong className="text-gray-700">{formatDateTime(complaint.createdAt)}</strong></span>
          {complaint.isAnonymous && <span className="text-orange-600">Submitted anonymously</span>}
        </div>

        {/* Status timeline */}
        {complaint.status !== 'Rejected' && (
          <div className="mt-6">
            <div className="flex items-center">
              {['Submitted', 'Under Review', 'In Progress', 'Resolved'].map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {i + 1}
                    </div>
                    <span className={`text-xs mt-1 text-center ${i <= currentStep ? 'text-primary-700 font-medium' : 'text-gray-400'}`}>{s}</span>
                  </div>
                  {i < 3 && <div className={`h-0.5 flex-1 -mt-4 ${i < currentStep ? 'bg-primary-600' : 'bg-gray-200'}`}></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {complaint.adminNotes && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <strong>Admin Note:</strong> {complaint.adminNotes}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FiMessageCircle /> Responses</h3>
        {complaint.replies?.length === 0 ? (
          <p className="text-sm text-gray-500">No responses yet. The school management will reply here once they review your complaint.</p>
        ) : (
          <div className="space-y-3">
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
      </div>
    </StudentLayout>
  );
};

export default ComplaintDetails;
