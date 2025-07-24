import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { prod_be_url } from '../../utils/config';
import LoadingFull from '../Loading/LoadingFull';
import { showErrorToast, showSuccessToast } from '../ToastMessage/ToastMessageComponent';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { FaRegCopy, FaSave } from 'react-icons/fa';
import { MdEdit, MdCancel, MdDelete } from "react-icons/md";
import { deleteJiraCache } from '../../utils/pageRouteData';

const JiraCredComponent = () => {
   const userData = JSON.parse(localStorage.getItem("user")) || {}
   const [currentUseCred,setCurrentUseCred] = useState(userData?.jiraTokenId || "");
   const [jiraData, setJiraData] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [visibleTokens, setVisibleTokens] = useState({});
   const [editTokenId, setEditTokenId] = useState(null);
   const [editedToken, setEditedToken] = useState('');

   const [newCred, setNewCred] = useState({
      email: '',
      baseUrl: '',
      token: ''
   });

   const [showAddForm, setShowAddForm] = useState(false);
   const fetchJiraData = async () => {
         setIsLoading(true);
         try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${prod_be_url}/jira/getJiraData`, {
               headers: {
                  Authorization: `Bearer ${token}`
               }
            });
            setJiraData(response.data.data);
         } catch (error) {
            console.log(error);
            showErrorToast("Failed to fetch Jira credentials.");
         }
         setIsLoading(false);
      };
   useEffect(() => {
      fetchJiraData();
   }, []);

   const handleCopy = (text) => {
      navigator.clipboard.writeText(text)
         .then(() => showSuccessToast("Token copied to clipboard!"))
         .catch(() => showErrorToast("Failed to copy token."));
   };

   const toggleTokenVisibility = (id) => {
      setVisibleTokens(prev => ({ ...prev, [id]: !prev[id] }));
   };

   const handleEditClick = (cred) => {
      setEditTokenId(cred._id);
      setEditedToken(cred.token);
   };

   const handleTokenSave = async (cred) => {
      try {
         const userEmail = localStorage.getItem('userEmail');
         const userToken = localStorage.getItem("token");
         const responseData = await axios.post(`${prod_be_url}/jira/operation`, {
            token: editedToken || cred.token,
            userEmail,
            jiraEmail: cred.email,
            baseUrl: cred.baseUrl
         }, {
            headers: {
               Authorization: `Bearer ${userToken}`
            }
         });
         showSuccessToast("Token updated successfully");
         setJiraData(prev =>
            prev.map(item =>
               item._id === cred._id ? { ...item, token: editedToken } : item
            )
         );
         fetchJiraData();
         const jiraId = responseData?.data?.jiraId
         setCurrentUseCred(jiraId)
         const user = JSON.parse(localStorage.getItem("user")|| "")||{};
         user.jiraTokenId = jiraId
         localStorage.setItem('user',JSON.stringify(user));
         setEditTokenId(null);
         deleteJiraCache();
      } catch (error) {
         console.log(error);
         showErrorToast("Failed to update token");
         deleteJiraCache();
      }
   };

   const handleDelete = async (id) => {
      const confirm = window.confirm("Are you sure you want to delete this Jira credential?");
      if (!confirm) return;

      try {
         const token = localStorage.getItem("token");
         await axios.delete(`${prod_be_url}/jira/${id}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         setJiraData(prev => prev.filter(item => item._id !== id));
         showSuccessToast("Jira credential deleted successfully.");
      } catch (error) {
         console.error(error);
         showErrorToast("Failed to delete Jira credential.");
      }
   };

   const handleAddCredential = async () => {
      const userEmail = localStorage.getItem("userEmail");
      const authToken = localStorage.getItem("token");
      console.log(newCred);
      if (!newCred.email || !newCred.baseUrl || !newCred.token) {
         showErrorToast("Please fill all fields.");
         return;
      }

      try {


         const responseData = await axios.post(`${prod_be_url}/jira/operation`, {
            userEmail,
            token: newCred.token,
            jiraEmail: newCred.email,
            baseUrl: newCred.baseUrl
         }, {
            headers: {
               Authorization: `Bearer ${authToken}`
            }
         });
         const jiraId = responseData?.data?.jiraId
         setCurrentUseCred(jiraId)
         const user = JSON.parse(localStorage.getItem("user") || "")||{};
         user.jiraTokenId = jiraId
         localStorage.setItem('user',JSON.stringify(user));

         showSuccessToast("Jira credential added successfully.");
         // setJiraData(prev => [...prev, response.data.data]); // assuming new credential returned in response.data.data
         setNewCred({ email: '', baseUrl: '', token: '' });
         setShowAddForm(false);
         const response = await axios.get(`${prod_be_url}/jira/getJiraData`, {
            headers: {
               Authorization: `Bearer ${authToken}`
            }
         });
         setJiraData(response.data.data);
      } catch (error) {
         console.log(error);
         showErrorToast("Failed to add Jira credential.");
      }
   };

   if (isLoading) return <LoadingFull />;

   return (
      <div className="p-6 min-h-screen sm:text-sm">
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-red-600 truncate sm:text-sm">Your Jira Credentials</h1>
            <button
               onClick={() => setShowAddForm(prev => !prev)}
               className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
               {showAddForm ? "Cancel" : "+"}
            </button>
         </div>

         {showAddForm && (
            <div className="bg-white border border-gray-300 p-4 mb-6 rounded-lg shadow space-y-3 text-black sm:text-sm">
               <h2 className="text-lg font-semibold text-gray-700 truncate">Add New Jira Credential</h2>
               <input
                  type="email"
                  placeholder="Jira Email"
                  value={newCred.email}
                  onChange={(e) => setNewCred({ ...newCred, email: e.target.value })}
                  className="w-full p-2 border rounded text-black"
               />
               <input
                  type="text"
                  placeholder="Base URL"
                  value={newCred.baseUrl}
                  onChange={(e) => setNewCred({ ...newCred, baseUrl: e.target.value })}
                  className="w-full p-2 border rounded"
               />
               <input
                  type="text"
                  placeholder="Token"
                  value={newCred.token}
                  onChange={(e) => setNewCred({ ...newCred, token: e.target.value })}
                  className="w-full p-2 border rounded"
               />
               <button
                  onClick={handleAddCredential}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
               >
                  Save Credential
               </button>
            </div>
         )}

         {/* <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {jiraData.length > 0 && jiraData.map((cred) => (
               <div
                  key={cred._id}
                  className="bg-white rounded-xl shadow border border-red-300 p-5 flex flex-col justify-between"
               >
                  <div className="flex justify-between items-start mb-2">
                     <h2 className="text-lg font-semibold text-red-500">Jira Credential</h2>
                     <button onClick={() => handleDelete(cred._id)} className="text-red-700 hover:text-red-900">
                        <MdDelete size={18} />
                     </button>
                  </div>

                  <div className="text-sm space-y-2 break-words text-gray-800  sm:text-sm">
                     <div><strong >Email:</strong> {cred.email}</div>
                     <div><strong>Base URL:</strong> {cred.baseUrl}</div>

                     <div>
                        <strong>Token:</strong>
                        <div className="flex items-center justify-between mt-1 bg-gray-100 p-2 rounded-md">
                           {editTokenId === cred._id ? (
                              <>
                                 <input
                                    type="text"
                                    value={editedToken}
                                    onChange={(e) => setEditedToken(e.target.value)}
                                    className="w-[70%] p-1 text-sm text-black rounded-md focus:outline-none"
                                 />
                                 <button onClick={() => handleTokenSave(cred)} className="text-green-600 hover:text-green-800 ml-2">
                                    <FaSave size={16} />
                                 </button>
                                 <button onClick={() => setEditTokenId(null)} className="text-red-500 hover:text-gray-800">
                                    <MdCancel size={18} />
                                 </button>
                              </>
                           ) : (
                              <>
                                 <span className="truncate w-[70%]">
                                    {visibleTokens[cred._id] ? cred.token : '••••••••••••••••••••••••••'}
                                 </span>
                                 <div className="flex items-center gap-2">
                                    <button onClick={() => toggleTokenVisibility(cred._id)} className="text-red-600 hover:text-red-800">
                                       {visibleTokens[cred._id] ? <IoIosEyeOff size={18} /> : <IoIosEye size={18} />}
                                    </button>
                                    <button onClick={() => handleCopy(cred.token)} className="text-red-600 hover:text-red-800">
                                       <FaRegCopy size={16} />
                                    </button>
                                    <button onClick={() => handleEditClick(cred)} className="text-blue-600 hover:text-blue-800">
                                       <MdEdit size={18} />
                                    </button>
                                 </div>
                              </>
                           )}
                        </div>
                     </div>

                     <div><strong>Created:</strong> {new Date(cred.createdAt).toLocaleString()}</div>
                  </div>
               </div>
            ))}
         </div> */}

         {/* <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
   {jiraData.length > 0 && jiraData.map((cred) => {
      const isCurrent = cred._id === currentUseCred;

      return (
         <div
            key={cred._id}
            className={`bg-white rounded-xl shadow p-5 flex flex-col justify-between border-2 ${
               isCurrent ? 'border-green-500' : 'border-red-300'
            }`}
         >
            <div className="flex justify-between items-start mb-2">
               <h2 className="text-lg font-semibold text-red-500 flex items-center gap-2">
                  Jira Credential
                  {isCurrent && (
                     <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        Using
                     </span>
                  )}
               </h2>
               <button onClick={() => handleDelete(cred._id)} className="text-red-700 hover:text-red-900">
                  <MdDelete size={18} />
               </button>
            </div>

            <div className="text-sm space-y-2 break-words text-gray-800 sm:text-sm">
               <div><strong>Email:</strong> {cred.email}</div>
               <div><strong>Base URL:</strong> {cred.baseUrl}</div>

               <div>
                  <strong>Token:</strong>
                  <div className="flex items-center justify-between mt-1 bg-gray-100 p-2 rounded-md">
                     {editTokenId === cred._id ? (
                        <>
                           <input
                              type="text"
                              value={editedToken}
                              onChange={(e) => setEditedToken(e.target.value)}
                              className="w-[70%] p-1 text-sm text-black rounded-md focus:outline-none"
                           />
                           <button onClick={() => handleTokenSave(cred)} className="text-green-600 hover:text-green-800 ml-2">
                              <FaSave size={16} />
                           </button>
                           <button onClick={() => setEditTokenId(null)} className="text-red-500 hover:text-gray-800">
                              <MdCancel size={18} />
                           </button>
                        </>
                     ) : (
                        <>
                           <span className="truncate w-[70%]">
                              {visibleTokens[cred._id] ? cred.token : '••••••••••••••••••••••••••'}
                           </span>
                           <div className="flex items-center gap-2">
                              <button onClick={() => toggleTokenVisibility(cred._id)} className="text-red-600 hover:text-red-800">
                                 {visibleTokens[cred._id] ? <IoIosEyeOff size={18} /> : <IoIosEye size={18} />}
                              </button>
                              <button onClick={() => handleCopy(cred.token)} className="text-red-600 hover:text-red-800">
                                 <FaRegCopy size={16} />
                              </button>
                              <button onClick={() => handleEditClick(cred)} className="text-blue-600 hover:text-blue-800">
                                 <MdEdit size={18} />
                              </button>
                           </div>
                        </>
                     )}
                  </div>
               </div>

               <div><strong>Created:</strong> {new Date(cred.createdAt).toLocaleString()}</div>
            </div>
         </div>
      );
   })}
</div> */}


<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
   {jiraData.length > 0 &&
      jiraData.map((cred) => {
         const isCurrent = cred._id === currentUseCred;

         return (
            <div
               key={cred._id}
               className={`bg-white rounded-xl shadow p-5 flex flex-col justify-between border-2 ${
                  isCurrent ? 'border-green-500' : 'border-red-300'
               }`}
            >
               <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-red-500 flex items-center gap-2">
                     Jira Credential
                     {isCurrent && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                           Using
                        </span>
                     )}
                  </h2>
                  <button onClick={() => handleDelete(cred._id)} className="text-red-700 hover:text-red-900">
                     <MdDelete size={18} />
                  </button>
               </div>

               <div className="text-sm space-y-2 break-words text-gray-800 sm:text-sm">
                  <div><strong>Email:</strong> {cred.email}</div>
                  <div><strong>Base URL:</strong> {cred.baseUrl}</div>

                  <div>
                     <strong>Token:</strong>
                     <div className="flex items-center justify-between mt-1 bg-gray-100 p-2 rounded-md">
                        {editTokenId === cred._id ? (
                           <>
                              <input
                                 type="text"
                                 value={editedToken}
                                 onChange={(e) => setEditedToken(e.target.value)}
                                 className="w-[70%] p-1 text-sm text-black rounded-md focus:outline-none"
                              />
                              <button onClick={() => handleTokenSave(cred)} className="text-green-600 hover:text-green-800 ml-2">
                                 <FaSave size={16} />
                              </button>
                              <button onClick={() => setEditTokenId(null)} className="text-red-500 hover:text-gray-800">
                                 <MdCancel size={18} />
                              </button>
                           </>
                        ) : (
                           <>
                              <span className="truncate w-[70%]">
                                 {visibleTokens[cred._id] ? cred.token : '••••••••••••••••••••••••••'}
                              </span>
                              <div className="flex items-center gap-2">
                                 <button onClick={() => toggleTokenVisibility(cred._id)} className="text-red-600 hover:text-red-800">
                                    {visibleTokens[cred._id] ? <IoIosEyeOff size={18} /> : <IoIosEye size={18} />}
                                 </button>
                                 <button onClick={() => handleCopy(cred.token)} className="text-red-600 hover:text-red-800">
                                    <FaRegCopy size={16} />
                                 </button>
                                 <button onClick={() => handleEditClick(cred)} className="text-blue-600 hover:text-blue-800">
                                    <MdEdit size={18} />
                                 </button>
                              </div>
                           </>
                        )}
                     </div>
                  </div>

                  <div><strong>Created:</strong> {new Date(cred.createdAt).toLocaleString()}</div>
               </div>

               {/* ✅ Use Me Button */}
               {!isCurrent && (
                  <button
                     className="mt-4 bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition duration-150"
                     onClick={() => handleTokenSave(cred)}
                  >
                     Use Me
                  </button>
               )}
            </div>
         );
      })}
</div>

      </div>
   );
};

export default JiraCredComponent;
