import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';
import LoadingFull from '../Loading/LoadingFull';

const PermissionSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
   const cached = localStorage.getItem('permissionSchemescache');
    if (cached) {
      setSchemes(JSON.parse(cached)||[]);
      setLoading(false);
    }
    fetchPermissionSchemes();
  }, []);

  const fetchPermissionSchemes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${prod_be_url}/permission-schemes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        setSchemes(res.data.data?.data || []);
        localStorage.setItem('permissionSchemescache', JSON.stringify(res.data.data?.data || []));
      } else {
        showErrorToast(res.data.message || "Failed to fetch permission schemes");
      }
    } catch (err) {
      showErrorToast("An error occurred while fetching permission schemes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingFull />;

  return (
    <div className="p-8 text-black bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-6 border-b pb-2 border-gray-300 bg-gradient-to-r from-purple-600 to-indigo-600 text-white inline-block px-4 py-2 rounded">
        Permission Schemes
      </h2>
      <p className="text-lg text-gray-700 mb-4">
        Total Permission Schemes: <span className="font-semibold text-indigo-700">{schemes.length}</span>
      </p>


      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold border">S.No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border">Permission Scheme</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border">Description</th>
            </tr>
          </thead>
          <tbody className="text-sm text-black divide-y divide-gray-200">
            {schemes.map((scheme, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-100 ${
                  scheme.Description ? 'bg-blue-50' : ''
                }`}
              >
               <td className="px-6 py-4 border">{index+1}</td>
                <td className="px-6 py-4 border">{scheme['Permission Scheme']}</td>
                <td className="px-6 py-4 border">
                  {scheme.Description || <span className="text-gray-400 italic">No description</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionSchemes;
