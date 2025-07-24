import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import LoadingFull from '../Loading/LoadingFull';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';

const Filter = () => {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('filtersCache');
    if (cached) {
    setLoading(false);
      setFilters(JSON.parse(cached));
    }

    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${prod_be_url}/filters`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        const data = res.data.data || [];
        setFilters(data);
        localStorage.setItem('filtersCache', JSON.stringify(data));
      } else {
        showErrorToast(res.data.message || 'Failed to fetch filters');
      }
    } catch (error) {
      showErrorToast('An error occurred while fetching filters');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <LoadingFull />}
      <div className={`p-8 bg-gray-50 min-h-screen text-black ${loading ? 'opacity-30 pointer-events-none' : ''}`}>
        <h2 className="text-3xl font-extrabold mb-6 border-b pb-2 border-gray-300 bg-gradient-to-r from-indigo-600 to-purple-500 text-white inline-block px-4 py-2 rounded">
          Filters
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Total Filters: <span className="font-semibold text-indigo-700">{filters.length}</span>
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold border">S. No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold border">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Filter Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold border">Filter URL</th>
              </tr>
            </thead>
            <tbody className="text-sm text-black divide-y divide-gray-200">
              {filters.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-100 bg-indigo-50">
                  <td className="px-4 py-4 border">{index + 1}</td>
                  <td className="px-4 py-4 border">{item.id}</td>
                  <td className="px-6 py-4 border">{item.name}</td>
                  <td className="px-6 py-4 border">
                    <a
                      href={item.self}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Filter
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Filter;
