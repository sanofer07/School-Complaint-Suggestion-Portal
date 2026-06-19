import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiUsers, FiTrash2, FiSlash, FiCheckCircle } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { Spinner, EmptyState, Badge } from '../../components/common/Common';
import { userAPI } from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getAll({ search, page, limit: 10 });
      setUsers(data.users);
      setPages(data.pages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await userAPI.toggleStatus(id);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await userAPI.delete(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <AdminLayout title="Manage Users">
      <div className="card mb-4">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Search by name, email, or student ID" className="input-field pl-10"
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={<FiUsers />} title="No students found" message="Registered students will appear here." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Student ID</th>
                    <th className="py-2 pr-4">Class</th>
                    <th className="py-2 pr-4">Joined</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-700">{u.name}</td>
                      <td className="py-3 pr-4 text-gray-500">{u.email}</td>
                      <td className="py-3 pr-4 text-gray-500">{u.studentId || '-'}</td>
                      <td className="py-3 pr-4 text-gray-500">{u.class || '-'}</td>
                      <td className="py-3 pr-4 text-gray-500">{formatDate(u.createdAt)}</td>
                      <td className="py-3 pr-4">
                        <Badge className={u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-3">
                          <button onClick={() => handleToggleStatus(u._id)} title={u.isActive ? 'Deactivate' : 'Activate'} className="text-gray-500 hover:text-primary-600">
                            {u.isActive ? <FiSlash /> : <FiCheckCircle />}
                          </button>
                          <button onClick={() => handleDelete(u._id)} title="Delete" className="text-gray-500 hover:text-red-600">
                            <FiTrash2 />
                          </button>
                        </div>
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

export default ManageUsers;
