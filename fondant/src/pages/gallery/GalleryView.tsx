import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageGrid } from '../../components/gallery/ImageGrid';
import { Button } from '../../components/ui/Button';
import { GalleryImage } from '../../types/Gallery';
import { ArrowLeft, Upload, Calendar, User, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getGalleryById, uploadGalleryImage } from '../../features/gallerySlice';

export const GalleryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);

  const { currentGallery, loading, error, uploadLoading, hasMore } = useAppSelector((state) => state.gallery);
  const { user } = useAppSelector((state) => state.auth);

  const isAdmin = !!user;

  useEffect(() => {
    if (id) {
      dispatch(getGalleryById({ id, page }));
    }
  }, [id, page, dispatch]);

  useEffect(() => {
    if (error) {
      navigate('/404');
    }
  }, [error, navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !currentGallery) return;

    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        await dispatch(
          uploadGalleryImage({
            galleryId: currentGallery._id,
            file,
          })
        ).unwrap();
        dispatch(getGalleryById({ id: currentGallery._id, page: 1 }));
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Image upload failed. Please try again.');
      }
    }
  };

  const downloadFile = async (image: GalleryImage) => {
    try {
      const downloadUrl = `${import.meta.env.VITE_API_URL}/gallery-image/download?imageUrl=${encodeURIComponent(image.url)}`;
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const extension = blob.type.split('/')[1] || 'jpg';
      const filename = image.filename?.includes('.') ? image.filename : `${image.filename || image._id}.${extension}`;
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      await new Promise((res) => setTimeout(res, 300));
    } catch (err) {
      console.error('Download failed for image:', image._id, err);
    }
  };

  const handleAddImages = () => {
    fileInputRef.current?.click();
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!currentGallery) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(isAdmin ? '/admin/galleries' : '/')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isAdmin ? 'Back to Galleries' : 'Back to Home'}
            </button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentGallery.eventName}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {currentGallery.clientName}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(currentGallery.eventDate)}
                </div>
                <div className="text-sm">
                  {currentGallery.images?.length || 0} image{(currentGallery.images?.length || 0) !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            {isAdmin && (
              <Button variant="outline" onClick={handleAddImages} disabled={uploadLoading}>
                {uploadLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {uploadLoading ? 'Uploading...' : 'Add Images'}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentGallery.images && currentGallery.images.length > 0 ? (
          <ImageGrid
            images={currentGallery.images}
            onDownload={downloadFile}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            isLoading={loading}
          />
        ) : (
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
            <p className="text-gray-600 mb-6">
              {isAdmin ? 'Upload some photos to get started.' : 'Your photographer will add photos here soon.'}
            </p>
            {isAdmin && (
              <Button onClick={handleAddImages} disabled={uploadLoading}>
                {uploadLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {uploadLoading ? 'Uploading...' : 'Upload Photos'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};