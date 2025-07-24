import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';
import LoadingFull from '../Loading/LoadingFull';

const SCREEN_SCHEMES_CACHE_KEY = 'jira_screen_schemes_cache';

const ScreenSchemes = () => {
  const [screenSchemes, setScreenSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScreenSchemes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${prod_be_url}/screens-schemes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data?.data || [];
      setScreenSchemes(data);
      localStorage.setItem(SCREEN_SCHEMES_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching screen schemes:', error);
      showErrorToast('Failed to fetch screen schemes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem(SCREEN_SCHEMES_CACHE_KEY);
    if (cached) {
      setScreenSchemes(JSON.parse(cached));
      setLoading(false);
    }
    fetchScreenSchemes();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🗂️ Jira Screen Schemes</h2>

      <p className="text-lg text-gray-700 mb-4">
        Total Screen Schemes: <span className="font-semibold text-indigo-700">{screenSchemes.length}</span>
      </p>

      {loading ? (
        <LoadingFull />
      ) : (
        <div className="overflow-x-auto border-gray-400">
<table className="min-w-full text-sm text-left text-black bg-white shadow-lg rounded-lg border border-gray-400">
            <thead className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <tr>
                <th className="px-6 py-4 text-center border-b border-gray-300">#</th>
                <th className="px-6 py-4 border-b border-gray-300">Name</th>
                <th className="px-6 py-4 border-b border-gray-300">Description</th>
                <th className="px-6 py-4 border-b border-gray-300">Screens Mapping</th>
              </tr>
            </thead>
  <tbody className="divide-y divide-gray-200 text-black">
    {screenSchemes.map((scheme, index) => (
      <tr key={scheme.id} className="hover:bg-green-50 transition-colors duration-200">
        <td className="px-6 py-3 text-center font-medium border border-gray-400">{index + 1}</td>
        <td className="px-6 py-3 border border-gray-400">{scheme.name}</td>
        <td className="px-6 py-3 border border-gray-400">{scheme.description || '--------'}</td>
        <td className="px-6 py-3 border border-gray-400">
          {Object.entries(scheme.screens).map(
            ([action, screenId]) => `${action}: ${screenId}`
          ).join(', ')}
        </td>
      </tr>
    ))}
  </tbody>
</table>

          {screenSchemes.length === 0 && (
            <p className="mt-4 text-red-600 text-center">No screen schemes found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScreenSchemes;
