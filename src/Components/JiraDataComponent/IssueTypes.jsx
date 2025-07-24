import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';
import LoadingFull from '../Loading/LoadingFull';

const IssueTypes = () => {
  const [issueTypes, setIssueTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('issueTypesCache');
    if (cached) {
      setIssueTypes(JSON.parse(cached));
      setLoading(false);
    }

    fetchIssueTypes(); // Always fetch latest in background
  }, []);

  const fetchIssueTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${prod_be_url}/issue-types`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        setIssueTypes(res.data.data || []);
        localStorage.setItem('issueTypesCache', JSON.stringify(res.data.data || []));
      } else {
        showErrorToast(res.data.message || 'Failed to fetch issue types');
      }
    } catch (error) {
      showErrorToast('An error occurred while fetching issue types');
    } finally {
       setLoading(false);
    }
  };

  

  return (
    <div className="p-8 text-black bg-gray-50 min-h-screen">
       {loading && <LoadingFull />} {/* Always show loader if fetching */}
      <h2 className="text-3xl font-extrabold mb-6 border-b pb-2 border-gray-300 bg-gradient-to-r from-yellow-500 to-orange-500 text-white inline-block px-4 py-2 rounded">
        Issue Types
      </h2>

      <p className="text-lg text-gray-700 mb-4">
        Total Issue Types: <span className="font-semibold text-indigo-700">{issueTypes.length-1}</span>
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
            <tr>
               <th className="px-6 py-3 text-left text-sm font-semibold border">S.No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border">Issue Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border">Issue Count</th>
            </tr>
          </thead>
          <tbody className="text-sm text-black divide-y divide-gray-200">
            {issueTypes.slice(0, -1).map((item, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-100 ${item['Issue Count'] > 0 ? 'bg-yellow-50' : ''}`}
              >
               <td className="px-6 py-4 border">{index+1}</td>
                <td className="px-6 py-4 border">{item.ID}</td>
                <td className="px-6 py-4 border">{item['Issue type']}</td>
                <td className="px-6 py-4 border">
                  {item['Issue Count'] > 0 ? item['Issue Count'] : <span className="text-gray-400 italic">0</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueTypes;
