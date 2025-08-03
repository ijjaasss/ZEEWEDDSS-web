import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, User,  Check, X, Loader2 } from 'lucide-react';
import ConfirmationModal from '../ui/ConfirmationModal';

interface PageImage {
  _id: string;
  url: string;
  filename: string;
  pageType: string;
  uploadedAt: string;
}

const HomeImageManager: React.FC = () => {
  const [images, setImages] = useState<{
    home: PageImage | null;
    about: PageImage | null;
  }>({ home: null, about: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{
    home: File | null;
    about: File | null;
  }>({ home: null, about: null });
  const [uploading, setUploading] = useState({
    home: false,
    about: false
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentUpload, setCurrentUpload] = useState<{
    pageType: string;
    file: File;
  } | null>(null);
const baseUrl = import.meta.env.VITE_API_URL;
  // Fetch current images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${baseUrl}/home-page`);
        if (response.data.success) {
          setImages(response.data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, pageType: 'home' | 'about') => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(prev => ({
        ...prev,
        [pageType]: e.target.files![0]
      }));
    }
  };

  // Prepare for upload (show confirmation)
  const prepareUpload = (pageType: 'home' | 'about') => {
    if (selectedFiles[pageType]) {
      setCurrentUpload({
        pageType,
        file: selectedFiles[pageType]!
      });
      setShowConfirmModal(true);
    }
  };

  // Execute upload after confirmation
  const handleUpload = async () => {
    if (!currentUpload) return;

    const { pageType, file } = currentUpload;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('pageType', pageType);

    try {
      setUploading(prev => ({ ...prev, [pageType]: true }));
      const response = await axios.post(
        `${baseUrl}/home-page/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        setImages(prev => ({
          ...prev,
          [pageType]: response.data.data
        }));
        setSelectedFiles(prev => ({
          ...prev,
          [pageType]: null
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to upload ${pageType} image`);
    } finally {
      setUploading(prev => ({ ...prev, [pageType]: false }));
      setShowConfirmModal(false);
      setCurrentUpload(null);
    }
  };

  // Cancel selection
  const cancelSelection = (pageType: 'home' | 'about') => {
    setSelectedFiles(prev => ({
      ...prev,
      [pageType]: null
    }));
    // Clear file input
    const fileInput = document.getElementById(`${pageType}-upload`) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Home Page Images Manager</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Home Image Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <div className="flex items-center mb-4">
          <Home className="w-5 h-5 mr-2 text-rose-500" />
          <h3 className="font-semibold text-lg">Home Page Hero Image</h3>
        </div>
        
        {selectedFiles.home ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={URL.createObjectURL(selectedFiles.home)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{selectedFiles.home.name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => prepareUpload('home')}
                disabled={uploading.home}
                className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 flex items-center"
              >
                {uploading.home ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                Confirm
              </button>
              <button
                onClick={() => cancelSelection('home')}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Image
              </label>
              {images.home ? (
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={images.home.url} 
                    alt={images.home.filename} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No image set
                </div>
              )}
              {images.home && (
                <p className="text-sm text-gray-500 mt-2">
                  Uploaded: {formatDate(images.home.uploadedAt)}
                </p>
              )}
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload New Image
              </label>
              <input
                id="home-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'home')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-rose-50 file:text-rose-700
                  hover:file:bg-rose-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* About Image Section */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 mr-2 text-rose-500" />
          <h3 className="font-semibold text-lg">About Page Image</h3>
        </div>
        
        {selectedFiles.about ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={URL.createObjectURL(selectedFiles.about)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{selectedFiles.about.name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => prepareUpload('about')}
                disabled={uploading.about}
                className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 flex items-center"
              >
                {uploading.about ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                Confirm
              </button>
              <button
                onClick={() => cancelSelection('about')}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Image
              </label>
              {images.about ? (
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={images.about.url} 
                    alt={images.about.filename} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No image set
                </div>
              )}
              {images.about && (
                <p className="text-sm text-gray-500 mt-2">
                  Uploaded: {formatDate(images.about.uploadedAt)}
                </p>
              )}
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload New Image
              </label>
              <input
                id="about-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'about')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-rose-50 file:text-rose-700
                  hover:file:bg-rose-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Image Upload"
        message={`Are you sure you want to update the ${currentUpload?.pageType} page image?`}
        onConfirm={handleUpload}
        onCancel={() => {
          setShowConfirmModal(false);
          setCurrentUpload(null);
        }}
        confirmText="Update"
        cancelText="Cancel"
      />
    </div>
  );
};

export default HomeImageManager;