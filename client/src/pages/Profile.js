import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="flex items-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">User ID</label>
                <input
                  type="text"
                  value={user?.id || ''}
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Dark Mode</p>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
              <input type="checkbox" disabled className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Notifications</p>
                <p className="text-sm text-gray-600">Budget alerts enabled</p>
              </div>
              <input type="checkbox" defaultChecked disabled className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Two-Factor Auth</p>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
              <input type="checkbox" disabled className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-lg shadow p-8">
          <h3 className="text-lg font-bold text-red-800 mb-4">⚠️ Danger Zone</h3>
          <p className="text-gray-700 mb-6">
            This action cannot be undone. You will need to log in again.
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow p-8 mt-6">
          <h3 className="text-lg font-bold text-blue-800 mb-4">ℹ️ Tips & Help</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Use the Dashboard to see your financial overview</li>
            <li>✓ Add transactions in the Transactions page</li>
            <li>✓ Create budgets to track spending by category</li>
            <li>✓ Manage custom categories for better organization</li>
            <li>✓ Check the charts to visualize your spending patterns</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
