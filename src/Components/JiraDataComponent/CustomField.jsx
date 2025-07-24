import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';

const CustomField = () => {
   const [fields, setFields] = useState([]);
   const [error, setError] = useState(null);

   useEffect(() => {
      const cachedData = localStorage.getItem('customFieldsCache');
      if (cachedData) {
         setFields(JSON.parse(cachedData));
      }

      fetchCustomFields(); // always call API
   }, []);

   const fetchCustomFields = async () => {
      try {
         const token = localStorage.getItem("token");
         const res = await axios.get(`${prod_be_url}/custom-field`, {
            headers: {
               Authorization: `Bearer ${token}`
            }
         });

         if (res.data?.success) {
            setFields(res.data.data);
            localStorage.setItem('customFieldsCache', JSON.stringify(res.data.data));
         } else {
            setError(res.data.message || 'Failed to fetch data');
         }
      } catch (err) {
         setError('An error occurred while fetching custom fields');
      }
   };

   return (
      <div className="p-8 text-black bg-gray-50 min-h-screen">
         <h2 className="text-3xl font-extrabold mb-6 pb-2 border-b border-gray-300 text-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">
            Custom Fields
         </h2>
         <p className="text-lg text-gray-700 mb-4">
            Total Custom Fields: <span className="font-semibold text-indigo-700">{fields.length}</span>
         </p>

         {error && <div className="text-red-600 mb-4">{error}</div>}

         <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
               <thead className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 text-black">
                  <tr>
                     <th className="px-6 py-3 text-left text-sm font-semibold border border-gray-300">S.No</th>
                     <th className="px-6 py-3 text-left text-sm font-semibold border border-gray-300">ID</th>
                     <th className="px-6 py-3 text-left text-sm font-semibold border border-gray-300">Name</th>
                     <th className="px-6 py-3 text-left text-sm font-semibold border border-gray-300">Type</th>
                     {/* <th className="px-6 py-3 text-left text-sm font-semibold border border-gray-300">Custom Type</th> */}
                  </tr>
               </thead>
               <tbody className="text-sm text-black divide-y divide-gray-200">
                  {fields.map((field, index) => (
                     <tr key={field.id} className="hover:bg-gray-100">
                        <td className="px-6 py-4 border border-gray-300">{index + 1}</td>
                        <td className="px-6 py-4 border border-gray-300">{field.id}</td>
                        <td className="px-6 py-4 border border-gray-300">{field.name}</td>
                        <td className="px-6 py-4 border border-gray-300">{field.schema?.type}</td>
                        {/* <td className="px-6 py-4 border border-gray-300">
                  {field.schema?.custom?.split(':')[1] || 'N/A'}
                </td> */}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default CustomField;
