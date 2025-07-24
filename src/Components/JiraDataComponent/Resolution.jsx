import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import LoadingFull from '../Loading/LoadingFull';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';

const Resolution = () => {
  const [resolutions, setResolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('resolutionsCache');
    if (cached) {
      setResolutions(JSON.parse(cached));
      setLoading(false);
    }

    fetchResolutions();
  }, []);

  const fetchResolutions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${prod_be_url}/resolutions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        const data = res.data.data || [];
        setResolutions(data);
        localStorage.setItem('resolutionsCache', JSON.stringify(data));
      } else {
        showErrorToast(res.data.message || 'Failed to fetch resolutions');
      }
    } catch (error) {
      showErrorToast('An error occurred while fetching resolutions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <LoadingFull />}
      <div className={`p-8 text-black bg-gray-50 min-h-screen ${loading ? 'opacity-30 pointer-events-none' : ''}`}>
        <h2 className="text-3xl font-extrabold mb-6 border-b pb-2 border-gray-300 bg-gradient-to-r from-indigo-600 to-purple-500 text-white inline-block px-4 py-2 rounded">
          Resolutions
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Total Resolutions: <span className="font-semibold text-indigo-700">{resolutions.length - 1}</span>
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold border">S. No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Description</th>
              </tr>
            </thead>
            <tbody className="text-sm text-black divide-y divide-gray-200">
              {resolutions.slice(0, -1).map((item, index) => (
                <tr key={item.ID} className="hover:bg-gray-100 bg-indigo-50">
                  <td className="px-4 py-4 border">{index + 1}</td>
                  <td className="px-6 py-4 border">{item.Name}</td>
                  <td className="px-6 py-4 border">{item.Description || <span className="text-gray-400 italic">No description</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Resolution;
