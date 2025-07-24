import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { prod_be_url } from '../../utils/config';
import { showErrorToast, showSuccessToast, } from '../ToastMessage/ToastMessageComponent';
import {useAuth} from "../../Context/AuthContext";
import LoadingFull from '../Loading/LoadingFull';

const OTP = () => {
  const {verifyOtp} = useAuth();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const[isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleResend = async() => {
    setOtp('');
    setTimer(120);
    setIsResendDisabled(true);
    try{
      // const user = JSON.parse(localStorage.getItem("user")||"null");
      const userEmail = localStorage.getItem("userEmail");
      // console.log(user);
      const response = await axios.post(`${prod_be_url}/auth/login`,{
        email: userEmail,
      })
      console.log(response.data);

    }catch(error){
      if (error?.response?.data) {
        showErrorToast(error?.response?.data?.message);
      }else{
       showErrorToast(error.message);
      }
    }
  };
  const handleOtpSubmit = async () => {
   setIsLoading(true);
   try {
     const email = localStorage.getItem("userEmail") ;
     if (email) {
       const response = await axios.post(`${prod_be_url}/auth/verify-otp/`, {
         otp,
         email
       });
 
       
       console.log("OTP Verified", response.data);
 
       localStorage.setItem("token", response.data?.token);
       const user = response.data?.user || [];
       console.log(user);
       localStorage.setItem("user",JSON.stringify(user));
 
       verifyOtp();
       console.log("Authentication updated");
 
       setTimeout(() => {
         showSuccessToast("Login Successful...");
         // navigate("/chat/new", { replace: true });
       }, 500);
 
     } else {
       console.log("User data not found in localStorage");
     }
     setIsLoading(false);
   } catch (error) {
     console.log("Error:", error);
     if (error?.response?.data) {
       showErrorToast(error?.response?.data?.message);
     }else{
      showErrorToast(error.message);
     }
     
     setIsLoading(false);
   }
 };
 
  return (
   //  <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">

   //    {
   //       isLoading && <LoadingFull/>
   //    }
   //    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center">
   //      <h2 className="text-xl font-semibold mb-4">OTP Verification</h2>
   //      <input
   //        type="text"
   //        value={otp}
   //        onChange={handleChange}
   //        maxLength="6"
   //        className="w-full p-2 text-center text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
   //        placeholder="Enter OTP"
   //      />
   //      <button
   //        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md mt-4 disabled:bg-gray-500"
   //        disabled={otp.length < 6}
   //        onClick={handleOtpSubmit}
   //      >
   //        Submit
   //      </button>
   //      <div className="mt-4 text-sm">
   //        {isResendDisabled ? (
   //          <span className="text-gray-400">Resend OTP in {timer}s</span>
   //        ) : (
   //          <button onClick={handleResend} className="text-blue-400 hover:underline">
   //            Resend OTP
   //          </button>
   //        )}
   //      </div>
   //    </div>
   //  </div>
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-900">
      {isLoading && <LoadingFull />}
      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg w-80 text-center">
        <h2 className="text-xl font-semibold mb-4">OTP Verification</h2>
        <input
          type="text"
          value={otp}
          onChange={handleChange}
          maxLength="6"
          className="w-full p-2 text-center text-gray-800 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter OTP"
        />
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-md mt-4 disabled:bg-gray-400"
          disabled={otp.length < 6}
          onClick={handleOtpSubmit}
        >
          Submit
        </button>
        <div className="mt-4 text-sm">
          {isResendDisabled ? (
            <span className="text-gray-500">Resend OTP in {timer}s</span>
          ) : (
            <button onClick={handleResend} className="text-red-500 hover:underline font-medium">
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OTP