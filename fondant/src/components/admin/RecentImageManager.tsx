import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import ConfirmationModal from '../ui/ConfirmationModal';


interface RecentImage {
  _id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

const RecentImageManager: React.FC = () => {
  const [images, setImages] = useState<RecentImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  // Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get<{ success: boolean; data: RecentImage[] }>(
          `${import.meta.env.VITE_API_URL}/recent-image`
        );
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Upload image
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setUploading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/recent-image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setImages([response.data.data, ...images]);
        setSelectedFile(null);
        // Clear file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/recent-image/delete/${id}`);
      setImages(images.filter(img => img._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <ImageIcon className="w-6 h-6 mr-2" />
        Recent Work Manager
      </h2>

      {/* Upload Section */}
      <div className="mb-8 p-4 border border-dashed border-gray-300 rounded-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload New Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-rose-50 file:text-rose-700
                hover:file:bg-rose-100"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:bg-rose-300 flex items-center"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Images Grid */}
        {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No recent work images found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div 
              key={image._id} 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <div className="relative aspect-square">
                <img
                  src={image.url}
                  alt={image.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => {
                    setImageToDelete(image._id);
                    setShowDeleteModal(true);
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all
                    opacity-0 group-hover:opacity-100"
                  aria-label="Delete image"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{image.filename}</h3>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{formatFileSize(image.size)}</span>
                  <span>{formatDate(image.uploadedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        onConfirm={() => {
          if (imageToDelete) {
            handleDelete(imageToDelete);
          }
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default RecentImageManager;