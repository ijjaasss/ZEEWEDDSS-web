import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, Search, Camera } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Camera className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist. It may have been moved, deleted, 
            or you might have entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/" className="block">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </Link>
          
          <Link to="/admin/galleries" className="block">
            <Button variant="outline" className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Browse Galleries
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Looking for a specific gallery?</strong><br />
            Gallery URLs follow this format: <code className="bg-blue-100 px-1 rounded">/gallery/[id]</code>
          </p>
        </div>
      </div>
    </div>
  );
};