// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { prod_be_url } from '../../utils/config';
// import { showErrorToast } from '../ToastMessage/ToastMessageComponent';
// import LoadingFull from '../Loading/LoadingFull';

// const WrokFlowComponent = () => {
//   const [workflows, setWorkflows] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchWorkflows = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log(token)
//       const response = await axios.get(`${prod_be_url}/workflows`,{
//          headers:{
//             Authorization:`Bearer ${token}`
//          }
//       });
//       console.log(response);
//       setWorkflows(response.data?.data || []);
//     } catch (error) {
//       console.error('Error fetching workflows:', error);
//       showErrorToast('Failed to fetch workflows');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWorkflows();
//   }, []);

//   return (
//        <div className="p-6">
//       <h2 className="text-3xl font-bold mb-6 text-gray-800">🧠 Jira Workflows</h2>

//       <p className="text-lg text-gray-700 mb-4">
//       Total Workflows: <span className="font-semibold text-indigo-700">{workflows.length}</span>
//       </p>

//       {loading ? (
//         <LoadingFull/>
//       ) : (
//         <div className="overflow-x-auto">
          
// <table className="min-w-full text-sm text-left text-gray-800 bg-white shadow-lg rounded border border-gray-400">
//   <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//     <tr>
//       <th className="px-6 py-4 text-center border-b border-gray-300">#</th>
//       <th className="px-6 py-4 border-b border-gray-300">Workflow Name</th>
//       <th className="px-6 py-4 border-b border-gray-300">Description</th>
//       <th className="px-6 py-4 text-center border-b border-gray-300">Created At</th>
//       <th className="px-6 py-4 text-center border-b border-gray-300">Updated At</th>
//     </tr>
//   </thead>
//   <tbody className="divide-y divide-gray-200">
//     {workflows.map((wf, index) => (
//       <tr
//         key={wf.id.entityId}
//         className="hover:bg-blue-50 transition-colors duration-200"
//       >
//         <td className="px-6 py-3 text-center border-r border-gray-200 font-medium">
//           {index + 1}
//         </td>
//         <td className="px-6 py-3 border-r border-gray-200">{wf.id.name}</td>
//         <td className="px-6 py-3 border-r border-gray-200 text-gray-700 whitespace-pre-wrap">
//          {wf.description || '--------'}
//         </td>
//         <td className="px-6 py-3 text-center text-sm text-gray-600 border-r border-gray-200">
//           {new Date(wf.created).toLocaleString()}
//         </td>
//         <td className="px-6 py-3 text-center text-sm text-gray-600">
//           {new Date(wf.updated).toLocaleString()}
//         </td>
//       </tr>
//     ))}
//   </tbody>
// </table>
//           {workflows.length === 0 && (
//             <p className="mt-4 text-red-600 text-center">No workflows found.</p>
//           )}
//         </div>
//       )}
//     </div>
   

//   );
// };

// export default WrokFlowComponent;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import { showErrorToast } from '../ToastMessage/ToastMessageComponent';
import LoadingFull from '../Loading/LoadingFull';

const WrokFlowComponent = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  const LOCAL_KEY = 'cached_workflows';

  const fetchWorkflows = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${prod_be_url}/workflows`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data?.data || [];

      // Save to localStorage
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
      setWorkflows(data);
      console.log(data)
    } catch (error) {
      console.error('Error fetching workflows:', error);
      showErrorToast('Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_KEY);
    if (cached) {
      setWorkflows(JSON.parse(cached));
      setLoading(false);
    } 
      fetchWorkflows();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🧠 Jira Workflows</h2>

      <p className="text-lg text-gray-700 mb-4">
        Total Workflows: <span className="font-semibold text-indigo-700">{workflows.length}</span>
      </p>

      {loading ? (
        <LoadingFull />
      ) : (
        <div className="overflow-x-auto border rounded-lg border-gray-300">
          <table className="min-w-full text-sm text-left text-gray-800 bg-white shadow-lg rounded border border-gray-400">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-center border-b border-gray-300">#</th>
                <th className="px-6 py-4 border-b border-gray-300">Workflow Name</th>
                <th className="px-6 py-4 border-b border-gray-300">Description</th>
                <th className="px-6 py-4 text-center border-b border-gray-300">Created At</th>
                <th className="px-6 py-4 text-center border-b border-gray-300">Updated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {workflows.map((wf, index) => (
                <tr
                  key={wf.id.entityId}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="px-6 py-3 text-center border-r border-gray-200 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 border-r border-gray-200">{wf.id.name}</td>
                  <td className="px-6 py-3 border-r border-gray-200 text-gray-700 whitespace-pre-wrap">
                    {wf.description || '--------'}
                  </td>
                  <td className="px-6 py-3 text-center text-sm text-gray-600 border-r border-gray-200">
                    {new Date(wf.created).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-center text-sm text-gray-600">
                    {new Date(wf.updated).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {workflows.length === 0 && (
            <p className="mt-4 text-red-600 text-center">No workflows found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WrokFlowComponent;
