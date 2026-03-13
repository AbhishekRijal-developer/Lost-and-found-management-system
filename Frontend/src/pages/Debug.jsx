import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function DebugPage() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Debug Info</h1>
        
        <div className="space-y-6">
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="font-bold text-gray-800">Loading Status:</p>
            <p className="text-lg text-blue-600">{loading ? 'Loading...' : 'Loaded'}</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="font-bold text-gray-800">Auth Token Exists:</p>
            <p className="text-lg text-blue-600">{token ? 'Yes' : 'No'}</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="font-bold text-gray-800">User Logged In:</p>
            <p className="text-lg text-blue-600">{user ? 'Yes' : 'No'}</p>
          </div>

          {user && (
            <>
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="font-bold text-gray-800">User Name:</p>
                <p className="text-lg text-blue-600">{user.name}</p>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="font-bold text-gray-800">User Role:</p>
                <p className="text-lg font-bold text-red-600">{user.role}</p>
              </div>

              <div className="p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
                <p className="font-bold text-gray-800 mb-2">Status:</p>
                {user.role === 'Admin' ? (
                  <div>
                    <p className="text-lg text-green-600 font-bold"> You are an ADMIN!</p>
                    <button
                      onClick={() => navigate('/admin-panel')}
                      className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Go to Admin Panel
                    </button>
                  </div>
                ) : (
                  <p className="text-lg text-red-600 font-bold"> You are a regular USER (not admin)</p>
                )}
              </div>

              <div className="p-4 bg-gray-200 rounded-lg">
                <p className="font-bold text-gray-800 mb-2">Full User Object:</p>
                <pre className="bg-black text-green-400 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </>
          )}

          {!user && (
            <div className="p-4 bg-red-100 border-2 border-red-400 rounded-lg">
              <p className="text-lg text-red-600 font-bold">You are not logged in!</p>
              <button
                onClick={() => navigate('/login')}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Go to Login
              </button>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/home')}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear Storage & Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
