import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import LoadingFull from '../Loading/LoadingFull';
import {prod_be_url} from "../../utils/config";
import axios from 'axios';
import { useAuth } from "../../Context/AuthContext";
import {showErrorToast,showInfoToast} from "../ToastMessage/ToastMessageComponent"

const Login = () => {
  const {login} = useAuth();
  const [email, setEmail] = useState('');

  const[isLoading,setIsLoading] = useState(false);

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const loginHandler = async(event) => {
    event.preventDefault();
    setIsLoading(true)
    // showErrorToast("Login failed.")

    try{
      const response = await axios.post(`${prod_be_url}/auth/login`,{
        email,
      })
      const responseData = response.data;
      console.log(responseData)
      if(responseData?.success){
        showInfoToast("Please Complete the TFA.");
        localStorage.setItem("userEmail",email);
        // localStorage.setItem("user",JSON.stringify(responseData?.data));
        login();
      }
      setIsLoading(false);
    }catch(error){
      console.log("Error :",error)
      if(error?.response?.data){
        showErrorToast(error?.response?.data?.message);
      }
      else{
        showErrorToast(error.message);
      }
      setIsLoading(false);
    }
  };

  return (
   //  <div className="flex items-center justify-center h-screen bg-gray-900">
   //    {isLoading && <LoadingFull/>}
   //    <div className="bg-gray-800 bg-opacity-60 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96 text-white">
   //      <h2 className="text-2xl font-bold text-center mb-6">Login/Register</h2>
   //      <form onSubmit={loginHandler} className="space-y-4">
   //        <div>
   //          <label className="block mb-2">Email</label>
   //          <input 
   //            type="text" 
   //            value={email} 
   //            onChange={handleEmail} 
   //            className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
   //            placeholder="Enter your email or username"
   //            required
   //          />
   //        </div>
          

   //        <button 
   //          type="submit" 
   //          className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-2 rounded font-semibold"
   //        >
   //          Submit
   //        </button>
   //      </form>
   //    </div>
   //  </div>
    <div className="flex items-center justify-center h-screen bg-white">
      {isLoading && <LoadingFull />}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-gray-900 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6">Login/Register</h2>
        <form onSubmit={loginHandler} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="text"
              value={email}
              onChange={handleEmail}
              className="w-full p-2 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800"
              placeholder="Enter your email or username"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition-all p-2 rounded font-semibold text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
    
  );
}

export default Login