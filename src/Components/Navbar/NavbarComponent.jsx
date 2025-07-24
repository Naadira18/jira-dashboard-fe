import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHistory, FaSignInAlt, FaUserPlus, FaInfoCircle, FaEnvelope, FaTrash,FaTimes,FaHome } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import { CiLogout } from "react-icons/ci";
import { RiAccountPinCircleFill } from "react-icons/ri";

const NavbarComponent = ({ closeSidebar,isSidebarOpen }) => {
  const { logout, isAuthenticated } = useAuth();
  const handleLogout = () => {
    logout();
    closeSidebar();
  }
  return (
    <nav className="flex flex-col min-h-full w-full text-white z-40">

      <div className="flex justify-end mb-4">
        {isSidebarOpen && <button
          onClick={closeSidebar}
          className="text-white hover:text-red-400 transition duration-200 text-xl"
          title="Close"
        >
          <FaTimes />
        </button>}
      </div>
      {/* Navigation Links */}
      <div className="mt-auto">
        <h2 className="text-md md:text-sm sm:text-xs font-semibold mb-2 border-b border-gray-700 pb-2">Navigation</h2>
        <ul className="space-y-2">
          {!isAuthenticated ? (<><li>
            <Link
              to="/login"
              className="flex items-center gap-2 p-2 rounded-md transition hover:bg-gray-700 text-sm md:text-sm sm:text-xs"
              onClick={closeSidebar}
            >
              <FaSignInAlt /> Login
            </Link>
          </li>
           
          </>) :
            (
              <>
              <li>
                  <Link to="/home"
                    className="flex items-center gap-2 p-2 rounded-md transition hover:bg-gray-700 text-base md:text-sm sm:text-xs"
                    
                  >
                    <FaHome /> Home
                  </Link>
                </li>
                <li>
                  <Link to="/login"
                    className="flex items-center gap-2 p-2 rounded-md transition hover:bg-gray-700 text-base md:text-sm sm:text-xs"
                    onClick={handleLogout}
                  >
                    <CiLogout /> Logout
                  </Link>
                </li>

                <li>
                  <Link to="/cred"
                    className="flex items-center gap-2 p-2 rounded-md transition hover:bg-gray-700 text-base md:text-sm sm:text-xs"
                    onClick={closeSidebar}
                  >
                    <RiAccountPinCircleFill /> Jira Account
                  </Link>
                </li>
              </>
            )
          }


        </ul>
      </div>
    </nav>

  );
}

export default NavbarComponent