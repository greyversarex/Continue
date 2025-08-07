import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TourForm from './TourForm';
import BookingsTable from './BookingsTable';
import ReviewsTable from './ReviewsTable';

type TabType = 'tours' | 'bookings' | 'reviews';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tours');
  const [showTourForm, setShowTourForm] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (localStorage.getItem('adminAuthenticated') !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  const handleEditTour = (tour: any) => {
    setEditingTour(tour);
    setShowTourForm(true);
  };

  const handleCloseTourForm = () => {
    setShowTourForm(false);
    setEditingTour(null);
  };

  const tabs = [
    { id: 'tours' as TabType, label: 'Manage Tours', icon: '🏔️' },
    { id: 'bookings' as TabType, label: 'Booking Requests', icon: '📅' },
    { id: 'reviews' as TabType, label: 'Reviews', icon: '⭐' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'tours' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Tour Management</h2>
              <button
                onClick={() => setShowTourForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Tour
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">Manage your tour listings here.</p>
              {/* Tour management content will be added here */}
              <div className="text-center py-8 text-gray-500">
                Tour management interface coming soon. Use the "Add New Tour" button to create tours.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && <BookingsTable />}
        {activeTab === 'reviews' && <ReviewsTable />}
      </div>

      {/* Tour Form Modal */}
      {showTourForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingTour ? 'Edit Tour' : 'Add New Tour'}
                </h3>
                <button
                  onClick={handleCloseTourForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TourForm
                tour={editingTour}
                onSuccess={handleCloseTourForm}
                onCancel={handleCloseTourForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;