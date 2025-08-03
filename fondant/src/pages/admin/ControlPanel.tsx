import React from 'react';
import RecentImageManager from '../../components/admin/RecentImageManager';
import HomeImageManager from '../../components/admin/HomeImageManager';


const ControlPanel: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Control Panel</h1>
        <div className="space-y-8">
          <RecentImageManager />
        <HomeImageManager />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;