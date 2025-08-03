import React from 'react';
import { Gallery } from '../../types/Gallery';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Eye, Edit, Trash2, Copy, Calendar, User } from 'lucide-react';

interface GalleryCardProps {
  gallery: Gallery;
  onView?: (gallery: Gallery) => void;
  onEdit?: (gallery: Gallery) => void;
  onDelete?: (gallery: Gallery) => void;
  onCopyUrl?: (gallery: Gallery) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  gallery,
  onView,
  onEdit,
  onDelete,
  onCopyUrl
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const galleryUrl = `/gallery/${gallery._id}`;

  return (
    <Card hover className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {gallery.eventName}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <User className="w-4 h-4 mr-1" />
                {gallery.clientName}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(gallery.eventDate)}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600">
              {gallery.images?.length} image{gallery.images?.length !== 1 ? 's' : ''}
            </div>
            <div className="text-xs text-gray-500">
              Created {formatDate(gallery.createdAt)}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <div className="text-xs text-gray-500 mb-1">Gallery URL:</div>
            <div className="text-sm font-mono text-gray-700 break-all">
              {galleryUrl}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onView?.(gallery)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(gallery)}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopyUrl?.(gallery)}
          >
            <Copy className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete?.(gallery)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};