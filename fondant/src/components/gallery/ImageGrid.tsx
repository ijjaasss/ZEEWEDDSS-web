import React, { useState, useEffect, useRef } from 'react';
import { GalleryImage } from '../../types/Gallery';
import { Download, Check, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { SkeletonLoader } from '../ui/SkeletonLoader';

interface ImageGridProps {
  images: GalleryImage[];
  allowSelection?: boolean;
  onSelectionChange?: (selectedImages: GalleryImage[]) => void;
  onDownloadSelected?: (selectedImages: GalleryImage[]) => void;
  onDownloadAll?: () => void;
  downloadLoading?: boolean;
  selectionDisabled?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  allowSelection = false,
  onSelectionChange,
  onDownloadSelected,
  onDownloadAll,
  downloadLoading = false,
  selectionDisabled = false,
  hasMore = false,
  onLoadMore,
  isLoading = false,
}) => {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsClient(true); // To prevent SSR hydration issues
  }, []);

  useEffect(() => {
    if (onSelectionChange) {
      const selected = images.filter((img) => selectedImages.has(img._id));
      onSelectionChange(selected);
    }
  }, [selectedImages, images, onSelectionChange]);

  useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current && observerRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, onLoadMore, isLoading]);

  const toggleImageSelection = (imageId: string) => {
    if (selectionDisabled) return;

    setSelectedImages((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(imageId)) {
        newSelected.delete(imageId);
      } else {
        newSelected.add(imageId);
      }
      return newSelected;
    });
  };

  const handleDownloadSelected = () => {
    if (!onDownloadSelected || selectedImages.size === 0) return;
    const selected = images.filter((img) => selectedImages.has(img._id));
    onDownloadSelected(selected);
  };

  const handleSelectAll = () => {
    if (selectionDisabled) return;

    setSelectedImages((prev) =>
      images.length === prev.size ? new Set() : new Set(images.map((img) => img._id))
    );
  };

  const formatFileSize = (bytes: number) => {
    if (!isClient || bytes === undefined) return 'Loading...';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };



  return (
    <div className="space-y-6">
      {allowSelection && (
        <div className="flex flex-wrap gap-4 justify-between items-center bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              disabled={selectionDisabled || images.length === 0}
            >
              {images.length === selectedImages.size ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-sm text-gray-600">
              {selectedImages.size} of {images.length} selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSelected}
              disabled={selectedImages.size === 0 || downloadLoading}
            >
              {downloadLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download Selected
            </Button>
           {selectedImages.size==0&&
             <Button
              variant="primary"
              size="sm"
              onClick={onDownloadAll}
              disabled={images.length === 0 || downloadLoading}
            >
              {downloadLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download All
            </Button>
           }
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image._id}
            className={`group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
              selectedImages.has(image._id) ? 'ring-2 ring-rose-500' : ''
            }`}
          >
            {allowSelection && (
              <div className="absolute top-2 left-2 z-10">
                <button
                  onClick={() => toggleImageSelection(image._id)}
                  disabled={selectionDisabled}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedImages.has(image._id)
                      ? 'bg-rose-500 border-rose-500 text-white'
                      : 'bg-white border-gray-300 hover:border-rose-500'
                  } ${selectionDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {selectedImages.has(image._id) && <Check className="w-3 h-3" />}
                </button>
              </div>
            )}
            <div className="aspect-square overflow-hidden relative">
              <img
                src={image.url}
                alt={image.filename}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 truncate" title={image.filename}>
                {image.filename}
              </p>
              <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        )}
      </div>
      {hasMore && !isLoading && (
        <div ref={loadMoreRef} className="h-10 w-full"></div>
      )}
      {images.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Download className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">No images in this gallery yet.</p>
        </div>
      )}
    </div>
  );
};