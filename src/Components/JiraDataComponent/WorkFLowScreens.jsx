import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';
import LoadingFull from '../Loading/LoadingFull';

const WorkFLowScreens = () => {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  const SCREENS_CACHE_KEY = 'cached_workflow_screens';

  const fetchWorkflowScreens = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${prod_be_url}/workflow-schemes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response)
      const screenData = response.data?.data || [];

      // Save to localStorage
      localStorage.setItem(SCREENS_CACHE_KEY, JSON.stringify(screenData));
      setScreens(screenData);
    } catch (error) {
      console.error('Error fetching workflow screens:', error);
      showErrorToast('Failed to fetch workflow screens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedScreens = localStorage.getItem(SCREENS_CACHE_KEY);

    if (cachedScreens) {
      setScreens(JSON.parse(cachedScreens));
      setLoading(false);
    } else {
      fetchWorkflowScreens();
    }
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🎛️ Workflow Screens</h2>
      <p className="text-lg text-gray-700 mb-4">
        Total Workflows: <span className="font-semibold text-indigo-700">{screens.length}</span>
      </p>

      {loading ? (
        <LoadingFull />
      ) : (
        <div className="overflow-x-auto border rounded-lg border-gray-300">
          <table className="min-w-full text-sm text-left text-gray-800 bg-white shadow-lg rounded border border-gray-400">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 border-b">#</th>
                <th className="px-6 py-4 border-b">ID</th>
                <th className="px-6 py-4 border-b">Name</th>
                <th className="px-6 py-4 border-b">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-400">
              {screens.map((screen, index) => (
                <tr key={screen.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-6 py-3 border-r border-gray-400">{index + 1}</td>
                  <td className="px-6 py-3 border-r border-gray-400">{screen.id}</td>
                  <td className="px-6 py-3 border-r border-gray-400">{screen.name}</td>
                  <td className="px-6 py-3 border-gray-400">{screen.description || '--------'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkFLowScreens;
