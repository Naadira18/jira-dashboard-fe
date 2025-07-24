import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import LoadingFull from '../Loading/LoadingFull';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';

const Statuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('statusesCache');
    if (cached) {
      setStatuses(JSON.parse(cached));
    setLoading(false);
    }

    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${prod_be_url}/statuses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        const data = res.data.data || [];
        setStatuses(data);
        localStorage.setItem('statusesCache', JSON.stringify(data));
      } else {
        showErrorToast(res.data.message || 'Failed to fetch statuses');
      }
    } catch (error) {
      showErrorToast('An error occurred while fetching statuses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <LoadingFull />}
      <div className={`p-8 text-black bg-gray-50 min-h-screen ${loading ? 'opacity-30 pointer-events-none' : ''}`}>
        <h2 className="text-3xl font-extrabold mb-6 border-b pb-2 border-gray-300 bg-gradient-to-r from-indigo-600 to-purple-500 text-white inline-block px-4 py-2 rounded">
          Statuses
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Total Statuses: <span className="font-semibold text-indigo-700">{statuses.length - 1}</span>
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold border">S. No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold border">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Category</th>
              </tr>
            </thead>
            <tbody className="text-sm text-black divide-y divide-gray-200">
              {statuses.slice(0, -1).map((item, index) => (
                <tr key={item.ID} className="hover:bg-gray-100 bg-indigo-50">
                  <td className="px-4 py-4 border">{index + 1}</td>
                  <td className="px-4 py-4 border">{item.ID}</td>
                  <td className="px-6 py-4 border">{item.Name}</td>
                  <td className="px-6 py-4 border">
                    {item.Description || <span className="text-gray-400 italic">No description</span>}
                  </td>
                  <td className="px-6 py-4 border">{item.Category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statuses;
