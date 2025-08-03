// pages/admin/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Image, Eye, Calendar, TrendingUp, LogOut, Monitor } from 'lucide-react';
import { Gallery } from '../../types/Gallery';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getDashboardStats } from '../../features/dashboardSlice';
import { logoutUser } from '../../features/authSlice';
import { toast } from 'react-toastify';


interface DashboardStats {
  totalGalleries: number;
  totalImages: number;
  thisMonth: number;
  avgImagesPerGallery: number;
  recentGalleries: Gallery[];
}

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [stats, setStats] = useState<DashboardStats>({
    totalGalleries: 0,
    totalImages: 0,
    thisMonth: 0,
    avgImagesPerGallery: 0,
    recentGalleries: []
  });
  const { loading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await dispatch(getDashboardStats());
      if (getDashboardStats.fulfilled.match(result)) {
        setStats(result.payload.data);
      }
    };
    fetchStats();
  }, [dispatch]);
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
       toast.success('logout success')
    } catch (err) {
       toast.error('Failed to logout')
     
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error loading dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your wedding photo galleries</p>
        </div>
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-600 hover:text-rose-600"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        {/* Quick Actions */}
       {/* Quick Actions */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
  <Link to="/admin/gallery/create">
    <Card hover className="h-full">
      <div className="flex items-center p-2">
        <div className="bg-rose-100 p-3 rounded-lg mr-4">
          <Plus className="w-6 h-6 text-rose-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Create New Gallery</h3>
          <p className="text-sm text-gray-600">Set up a new client gallery</p>
        </div>
      </div>
    </Card>
  </Link>

  <Link to="/admin/galleries">
    <Card hover className="h-full">
      <div className="flex items-center p-2">
        <div className="bg-blue-100 p-3 rounded-lg mr-4">
          <Image className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Manage Galleries</h3>
          <p className="text-sm text-gray-600">View and edit existing galleries</p>
        </div>
      </div>
    </Card>
  </Link>

  <Link to="/admin/control-panel">
    <Card hover className="h-full">
      <div className="flex items-center p-2">
        <div className="bg-amber-100 p-3 rounded-lg mr-4">
          <Monitor className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Control Panel</h3>
          <p className="text-sm text-gray-600">Central area to manage and update all website content and settings.</p>
        </div>
      </div>
    </Card>
  </Link>
</div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="bg-rose-100 p-3 rounded-lg mr-4">
                <Image className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Galleries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalGalleries}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgImagesPerGallery}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Galleries */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Galleries</h2>
            <Link to="/admin/galleries">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {stats.recentGalleries.map((gallery) => (
              <div key={gallery._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{gallery.eventName}</h3>
                  <p className="text-sm text-gray-600">{gallery.clientName}</p>
                  <p className="text-xs text-gray-500">
                    {gallery.images?.length || 0} images • Created {new Date(gallery.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/gallery/${gallery._id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {stats.recentGalleries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No galleries created yet</p>
              <Link to="/admin/gallery/create">
                <Button className="mt-4">Create Your First Gallery</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};