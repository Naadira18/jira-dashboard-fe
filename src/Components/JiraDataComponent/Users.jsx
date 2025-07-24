import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import LoadingFull from '../Loading/LoadingFull';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('usersChache');
    if (cached) {
    setLoading(false);
      setUsers(JSON.parse(cached));
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${prod_be_url}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        const data = res.data.data || [];
        setUsers(data);
        localStorage.setItem('usersChache', JSON.stringify(data));
      } else {
        showErrorToast(res.data.message || 'Failed to fetch users');
      }
    } catch (error) {
      showErrorToast('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <LoadingFull />}
      <div className={`p-8 bg-gray-50 min-h-screen text-black ${loading ? 'opacity-30 pointer-events-none' : ''}`}>
        <h2 className="text-3xl font-extrabold mb-6 border-b pb-2 border-gray-300 bg-gradient-to-r from-purple-600 to-indigo-600 text-white inline-block px-4 py-2 rounded">
          Users
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Total Users: <span className="font-semibold text-indigo-700">{users.length}</span>
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold border">S. No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Display Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Account Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Active</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Account ID</th>
              </tr>
            </thead>
            <tbody className="text-sm text-black divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user['Account ID']} className="hover:bg-gray-100 bg-indigo-50">
                  <td className="px-4 py-4 border">{index + 1}</td>
                  <td className="px-6 py-4 border">{user['Display Name']}</td>
                  <td className="px-6 py-4 border">{user['Email']}</td>
                  <td className="px-6 py-4 border capitalize">{user['Account Type']}</td>
                  <td className="px-6 py-4 border">
                    {user['Active'] ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-600 font-medium">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 border">{user['Account ID']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
