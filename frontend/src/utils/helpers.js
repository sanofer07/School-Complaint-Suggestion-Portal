export const STATUS_COLORS = {
  'Submitted': 'bg-blue-100 text-blue-800',
  'Under Review': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-orange-100 text-orange-800',
  'Resolved': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Pending': 'bg-gray-100 text-gray-800',
  'Acknowledged': 'bg-blue-100 text-blue-800',
  'Implemented': 'bg-green-100 text-green-800',
  'Dismissed': 'bg-red-100 text-red-800',
};

export const PRIORITY_COLORS = {
  'Low': 'bg-green-100 text-green-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'High': 'bg-red-100 text-red-800',
};

export const CATEGORIES = ['Infrastructure', 'Academics', 'Transport', 'Safety', 'Discipline', 'Hostel', 'Others'];
export const PRIORITIES = ['Low', 'Medium', 'High'];
export const STATUSES = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'];
export const SUGGESTION_STATUSES = ['Pending', 'Acknowledged', 'Implemented', 'Dismissed'];

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const truncate = (str, n = 80) => str?.length > n ? str.substr(0, n - 1) + '...' : str;
