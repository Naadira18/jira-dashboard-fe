import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';
import LoadingFull from '../Loading/LoadingFull';

const FieldConfiguration = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('fieldConfigsCache');
    if (cached) {
      setConfigs(JSON.parse(cached));
      setLoading(false);
    }else{
      setLoading(true);
    }

    fetchConfigs(); // fetch latest in background
  }, []);

  const fetchConfigs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${prod_be_url}/field-configuration`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        const data = res.data.data || [];
        setConfigs(data);
        localStorage.setItem('fieldConfigsCache', JSON.stringify(data));
      } else {
        showErrorToast(res.data.message || 'Failed to fetch field configurations');
      }
    } catch (err) {
      showErrorToast('An error occurred while fetching field configurations');
    } finally {
      setLoading(false);
    }
  };

//   if (loading) return <LoadingFull />;

  return (
    <div className="p-8 text-black bg-gray-50 min-h-screen">
       {loading && <LoadingFull />} {/* Always show loader if fetching */}
      <h2 className="text-3xl font-extrabold mb-6 border-b pb-2 border-gray-300 bg-gradient-to-r from-orange-600 to-pink-600 text-white inline-block px-4 py-2 rounded">
        Field Configurations
      </h2>
      <p className="text-lg text-gray-700 mb-4">
        Total Field Configurations: <span className="font-semibold text-orange-700">{configs.length - 1}</span>
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold border">S. No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border">Description</th>
            </tr>
          </thead>
          <tbody className="text-sm text-black divide-y divide-gray-200">
            {configs.slice(0,-1).map((item, index) => (
              <tr key={index} className={`hover:bg-gray-100 ${item.Description ? 'bg-orange-50' : ''}`}>
                <td className="px-4 py-4 border">{index + 1}</td>
                <td className="px-6 py-4 border">{item.ID}</td>
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

export default FieldConfiguration;
