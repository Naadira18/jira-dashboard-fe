import React from 'react';
import JiraCredComponent from '../JiraCredComponent/JiraCredComponent';
import { pageRouteData } from '../../utils/pageRouteData';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📋 Dashboard</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
        <ul className="divide-y divide-gray-200">
          {pageRouteData.map((data, index) => (
            <li key={index} className="hover:bg-green-50 transition-colors">
              <Link
                to={`/home${data.path}`}
                className="block px-6 py-4 text-gray-800 hover:text-green-700 font-medium"
              >
                {data.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
