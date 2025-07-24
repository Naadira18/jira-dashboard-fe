import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';
import LoadingFull from '../Loading/LoadingFull';

const NotificationSchemes = () => {
   const [schemes, setSchemes] = useState([]);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false); // 👈 loading state

   useEffect(() => {
      const cached = localStorage.getItem('notificationSchemescache');
    if (cached) {
      setSchemes(JSON.parse(cached));
      setLoading(false);
    }
      fetchNotificationSchemes();
   }, []);

   const fetchNotificationSchemes = async () => {
      setLoading(true); // 👈 Start loading
      try {
         const token = localStorage.getItem('token');
         const res = await axios.get(`${prod_be_url}/notification-schemes`, {
            headers: {
               Authorization: `Bearer ${token}`
            }
         });

         if (res.data?.success) {
            setSchemes(res.data.data.data);
            localStorage.setItem('notificationSchemescache', JSON.stringify(res.data.data.data));
         } else {
            setError(res.data.message || 'Failed to fetch data');
            showErrorToast(res.data.message || 'Failed to fetch data');
         }
      } catch (err) {
         const msg = 'An error occurred while fetching notification schemes';
         setError(msg);
         showErrorToast(msg);
      } finally {
         setLoading(false); // 👈 Stop loading
      }
   };

   return (
      <div className="p-8 text-black bg-gray-50 min-h-screen">
         <h2 className="text-3xl font-extrabold mb-6 pb-2 border-b border-gray-300 text-black bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 inline-block text-transparent bg-clip-text">
            Notification Schemes
         </h2>
         <p className="text-lg text-gray-700 mb-4">
            Total Notification Schemes: <span className="font-semibold text-indigo-700">{schemes.length}</span>
         </p>


         {error && <div className="text-red-600 mb-4">{error}</div>}

         {loading ? (
            <LoadingFull />
         ) : (
            <div className="overflow-x-auto">
               <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
                  <thead className="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 text-black">
                     <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold border border-gray-300">S.No</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold border border-gray-300">Notification Scheme</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold border border-gray-300">Project Assigned</th>
                     </tr>
                  </thead>

                  <tbody className="text-sm text-black divide-y divide-gray-200">
                     {schemes.map((scheme, index) => {
                        const isUnassigned = scheme['Project Assigned'] === 'Not assigned to any project';
                        return (
                           <tr
                              key={index}
                              className={`hover:bg-gray-100 ${isUnassigned ? 'bg-red-100 font-semibold text-red-700' : ''
                                 }`}
                           >
                              <td className="px-6 py-4 border border-gray-300">{index + 1}</td>
                              <td className="px-6 py-4 border border-gray-300">{scheme['Notification Scheme']}</td>
                              <td className="px-6 py-4 border border-gray-300">{scheme['Project Assigned']}</td>
                           </tr>
                        );
                     })}
                  </tbody>

               </table>
            </div>
         )}
      </div>
   );
};

export default NotificationSchemes;
