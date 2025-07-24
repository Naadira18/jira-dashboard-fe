import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import LoadingFull from '../Loading/LoadingFull';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('groupsCache');
    if (cached) {
    setLoading(false);
      setGroups(JSON.parse(cached));
    }

    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${prod_be_url}/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        const data = res.data.data || [];
        setGroups(data);
        localStorage.setItem('groupsCache', JSON.stringify(data));
      } else {
        showErrorToast(res.data.message || 'Failed to fetch groups');
      }
    } catch (error) {
      showErrorToast('An error occurred while fetching groups');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <LoadingFull />}
      <div className={`p-8 bg-gray-50 min-h-screen text-black ${loading ? 'opacity-30 pointer-events-none' : ''}`}>
        <h2 className="text-3xl font-extrabold mb-6 border-b pb-2 border-gray-300 bg-gradient-to-r from-teal-600 to-blue-600 text-white inline-block px-4 py-2 rounded">
          Groups
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Total Groups: <span className="font-semibold text-teal-700">{groups.length}</span>
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold border">S. No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Group Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Group ID</th>
              </tr>
            </thead>
            <tbody className="text-sm text-black divide-y divide-gray-200">
              {groups.map((group, index) => (
                <tr key={group.GroupID} className="hover:bg-gray-100 bg-blue-50">
                  <td className="px-4 py-4 border">{index + 1}</td>
                  <td className="px-6 py-4 border">{group.Name}</td>
                  <td className="px-6 py-4 border">{group.GroupID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Groups;
