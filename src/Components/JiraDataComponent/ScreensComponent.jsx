import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';
import LoadingFull from '../Loading/LoadingFull';

const SCREENS_CACHE_KEY = 'jira_screens_cache';

const ScreensComponent = () => {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScreens = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${prod_be_url}/screens`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data?.data || [];
      setScreens(data);
      localStorage.setItem(SCREENS_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching screens:', error);
      showErrorToast('Failed to fetch screens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem(SCREENS_CACHE_KEY);
    if (cached) {
      setScreens(JSON.parse(cached));
      setLoading(false); // show instantly
    }
    fetchScreens(); // refresh in background
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🧾 Jira Screens</h2>

      <p className="text-lg text-gray-700 mb-4">
        Total Screens: <span className="font-semibold text-indigo-700">{screens.length}</span>
      </p>

      {loading ? (
        <LoadingFull />
      ) : (
        <div className="overflow-x-auto">
         <table className="min-w-full text-sm text-left text-gray-800 bg-white shadow-lg rounded border border-gray-400">
          {/* <table className="min-w-full text-sm text-left text-gray-800 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300"> */}
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-center border-b border-gray-300">#</th>
                <th className="px-6 py-4 border-b border-gray-300">Name</th>
                <th className="px-6 py-4 border-b border-gray-300">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-400">
              {screens.map((screen, index) => (
                <tr key={screen.id} className="hover:bg-blue-50 transition-colors duration-200">
                  <td className="px-6 py-3 text-center border-r border-gray-400 font-medium">{index + 1}</td>
                  <td className="px-6 py-3 border-r border-gray-400">{screen.name}</td>
                  <td className="px-6 py-3 border-r border-gray-400 text-gray-700 whitespace-pre-wrap">
                    {screen.description || '--------'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {screens.length === 0 && (
            <p className="mt-4 text-red-600 text-center">No screens found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScreensComponent;
