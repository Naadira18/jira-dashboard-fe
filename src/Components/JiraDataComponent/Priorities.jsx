import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';
import LoadingFull from '../Loading/LoadingFull';

const Priorities = () => {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('prioritiesCache');
    if (cached) {
      setPriorities(JSON.parse(cached));
      setLoading(false);
    }

    fetchPriorities(); // always fetch latest in background
  }, []);

  const fetchPriorities = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${prod_be_url}/priorities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        const data = res.data.data || [];
        setPriorities(data);
        localStorage.setItem('prioritiesCache', JSON.stringify(data));
      } else {
        showErrorToast(res.data.message || 'Failed to fetch priorities');
      }
    } catch (error) {
      showErrorToast('An error occurred while fetching priorities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingFull />;

  return (
    <div className="p-8 text-black bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-6 border-b pb-2 border-gray-300 bg-gradient-to-r from-red-600 to-orange-500 text-white inline-block px-4 py-2 rounded">
        Priorities
      </h2>
      <p className="text-lg text-gray-700 mb-4">
        Total Priorities: <span className="font-semibold text-red-700">{priorities.length }</span>
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold border">S. No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border">Description</th>
            </tr>
          </thead>
          <tbody className="text-sm text-black divide-y divide-gray-200">
            {priorities.map((item, index) => (
              <tr key={item.ID} className="hover:bg-gray-100 bg-red-50">
                <td className="px-4 py-4 border">{index + 1}</td>
                <td className="px-6 py-4 border">{item.Name}</td>
                <td className="px-6 py-4 border">
                  {item.Description || <span className="text-gray-400 italic">No description</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Priorities;
