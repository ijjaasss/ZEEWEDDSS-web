import React, { useState, useEffect, useRef } from 'react';
import { GalleryImage } from '../../types/Gallery';
import { Download, Loader2 } from 'lucide-react';
import { SkeletonLoader } from '../ui/SkeletonLoader';

interface ImageGridProps {
  images: GalleryImage[];
  onDownload: (image: GalleryImage) => Promise<void>;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onDownload,
  hasMore = false,
  onLoadMore,
  isLoading = false,
}) => {
  const [isClient, setIsClient] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true); // To prevent SSR hydration issues
  }, []);

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

  const formatFileSize = (bytes: number) => {
    if (!isClient || bytes === undefined) return 'Loading...';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async (image: GalleryImage) => {
    setDownloadingId(image._id);
    try {
      await onDownload(image);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image._id}
            className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="aspect-square overflow-hidden relative">
              <img
                src={image.url}
                alt={image.filename}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <button
                onClick={() => handleDownload(image)}
                disabled={downloadingId === image._id}
                className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all hover:scale-110"
                title="Download image"
              >
                {downloadingId === image._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
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