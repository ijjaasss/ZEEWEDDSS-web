// pages/admin/CreateGallery.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks'
import { createGallery, updateGallery, getGalleryById, resetGalleryState } from '../../features/gallerySlice'
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { toast } from 'react-toastify';

export const CreateGallery: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const { currentGallery, loading, error, success } = useAppSelector((state) => state.gallery);
  
  const [formData, setFormData] = useState({
    clientName: '',
    eventName: '',
    eventDate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!editId;

  useEffect(() => {
    if (isEditing && editId) {
      dispatch(getGalleryById({ id: editId, page: 1 }));
    }
    
    return () => {
      dispatch(resetGalleryState());
    };
  }, [dispatch, editId, isEditing]);

  useEffect(() => {
    if (isEditing && currentGallery) {
      setFormData({
        clientName: currentGallery.clientName,
        eventName: currentGallery.eventName,
        eventDate: currentGallery.eventDate
      });
    }
  }, [currentGallery, isEditing]);

  useEffect(() => {
    if (success) {
      navigate('/admin/galleries');
    }
  }, [success, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && editId) {
        await dispatch(updateGallery({ id: editId, galleryData: formData }));
      } else {
        await dispatch(createGallery(formData));
      }
    } finally {
      setIsSubmitting(false);
    }
    toast.success( `Gallery ${isEditing?"editing":"creating"} successfully`)
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/galleries')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Galleries
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Edit Gallery' : 'Create New Gallery'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update gallery information' : 'Set up a new client photo gallery'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Client Name"
              value={formData.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
              placeholder="e.g., Sarah & Michael Johnson"
              error={errors.clientName}
              disabled={loading}
              required
            />

            <Input
              label="Event Name"
              value={formData.eventName}
              onChange={(e) => handleChange('eventName', e.target.value)}
              placeholder="e.g., Garden Wedding Reception"
              error={errors.eventName}
              disabled={loading}
              required
            />

            <Input
              label="Event Date"
              type="date"
              value={formData.eventDate}
              onChange={(e) => handleChange('eventDate', e.target.value)}
              error={errors.eventDate}
              disabled={loading}
              required
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/galleries')}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              
              <Button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={loading}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting 
                  ? (isEditing ? 'Updating...' : 'Creating...') 
                  : (isEditing ? 'Update Gallery' : 'Create Gallery')
                }
              </Button>
            </div>
          </form>
        </Card>

        <ConfirmationModal
          isOpen={showConfirmModal}
          title="Confirm Submission"
          message="Are you sure you want to submit this gallery?"
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
          confirmText="Submit"
          cancelText="Cancel"
        />

        {isEditing && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Changes will be saved immediately. Clients using the existing gallery link 
              will see the updated information on their next visit.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};