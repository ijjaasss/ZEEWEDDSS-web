import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryCard } from '../../components/gallery/GalleryCard';
import { Button } from '../../components/ui/Button';
import { Gallery } from '../../types/Gallery';
import { Plus, Search } from 'lucide-react';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteGallery, getGalleries } from '../../features/gallerySlice';
import { toast } from 'react-toastify';

export const ManageGalleries: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { galleries, loading, error } = useAppSelector((state) => state.gallery);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null);

  useEffect(() => {
    dispatch(getGalleries());
  }, [dispatch]);

  const filteredGalleries = galleries.filter(gallery =>
    gallery.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gallery.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (gallery: Gallery) => {
    navigate(`/gallery/${gallery._id}`);
  };

  const handleEdit = (gallery: Gallery) => {
    navigate(`/admin/gallery/create?edit=${gallery._id}`);
  };

  const handleDeleteClick = (gallery: Gallery) => {
    setGalleryToDelete(gallery);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (galleryToDelete) {
      try {
        await dispatch(deleteGallery(galleryToDelete._id)).unwrap();
        toast.success('Gallery Delete success')
      } catch (err) {
         toast.warn('Gallery Delete Failed')
        console.error('Failed to delete gallery:', err);
      } finally {
        setShowDeleteModal(false);
        setGalleryToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setGalleryToDelete(null);
  };

  const handleCopyUrl = (gallery: Gallery) => {
    const url = `${window.location.origin}/gallery/${gallery._id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Gallery URL copied to clipboard!');
    }).catch(() => {
      alert(`Gallery URL: ${url}`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Galleries</h1>
              <p className="text-gray-600">View, edit, and manage your client photo galleries</p>
            </div>
            
            <Button
              onClick={() => navigate('/admin/gallery/create')}
              className="shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Gallery
            </Button>
          </div>

          {/* Search */}
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search galleries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading galleries...</p>
          </div>
        ) : (
          <>
            {/* Galleries Grid */}
            {filteredGalleries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGalleries.map((gallery) => (
                  <GalleryCard
                    key={gallery._id}
                    gallery={gallery}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onCopyUrl={handleCopyUrl}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                {searchTerm ? (
                  <div>
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No galleries found matching "{searchTerm}"</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div>
                    <Plus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No galleries created yet</p>
                    <Button onClick={() => navigate('/admin/gallery/create')}>
                      Create Your First Gallery
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            {galleries.length > 0 && (
              <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-rose-600">{galleries.length}</div>
                    <div className="text-sm text-gray-600">Total Galleries</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-rose-600">
                      {galleries.reduce((sum, g) => sum + (g.images?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Images</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-rose-600">
                      {galleries.length > 0 
                        ? Math.round(galleries.reduce((sum, g) => sum + (g.images?.length || 0), 0) / galleries.length)
                        : 0}
                    </div>
                    <div className="text-sm text-gray-600">Avg Images per Gallery</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Delete Gallery"
          message={`Are you sure you want to delete "${galleryToDelete?.eventName}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          confirmText="Delete"
          cancelText="Cancel"
        
        />
      </div>
    </div>
  );
};