import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Gallery } from '../types/Gallery';
import api from '../api/axiosInstance';

interface GalleryState {
  currentGallery: Gallery | null;
  galleries: Gallery[];
  loading: boolean;
  error: string | null;
  success: boolean;
  uploadLoading: boolean;
  hasMore: boolean;
  page: number;
  totalImages: number;
}

const initialState: GalleryState = {
  currentGallery: null,
  galleries: [],
  loading: false,
  error: null,
  success: false,
  uploadLoading: false,
  hasMore: false,
  page: 1,
  totalImages: 0,
};

export const createGallery = createAsyncThunk(
  'gallery/create',
  async (
    galleryData: {
      clientName: string;
      eventName: string;
      eventDate: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/gallery/create`, galleryData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create gallery');
    }
  }
);

export const updateGallery = createAsyncThunk(
  'gallery/update',
  async (
    { id, galleryData }: { id: string; galleryData: { clientName: string; eventName: string; eventDate: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/gallery/update/${id}`, galleryData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update gallery');
    }
  }
);

export const getGalleries = createAsyncThunk('gallery/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/gallery/getgalleries`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch galleries');
  }
});

export const getGalleryById = createAsyncThunk(
  'gallery/getById',
  async ({ id, page }: { id: string; page: number }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/gallery/get-by-id/${id}?page=${page}&limit=12`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Gallery not found');
    }
  }
);

export const uploadGalleryImage = createAsyncThunk(
  'gallery/uploadImage',
  async ({ galleryId, file }: { galleryId: string; file: File }, { rejectWithValue }) => {
    try {
      console.log('started')
      const formData = new FormData();
      formData.append('galleryId', galleryId);
      formData.append('image', file);
      const response = await api.post(`/gallery-image/upload`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error: any) {

      return rejectWithValue(error.response?.data?.message || 'Failed to upload image');
    }
  }
);

export const downloadGalleryImage = createAsyncThunk(
  'gallery/downloadImage',
  async (imageUrl: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to download image');
    }
  }
);

export const deleteGallery = createAsyncThunk('gallery/delete', async (galleryId: string, { rejectWithValue }) => {
  try {
    await api.delete(`/gallery/delete/${galleryId}`, {
      withCredentials: true,
    });
    return galleryId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete gallery');
  }
});

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    resetGalleryState: (state) => {
      state.success = false;
      state.error = null;
      state.page = 1;
      state.hasMore = false;
      state.totalImages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadGalleryImage.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadGalleryImage.fulfilled, (state) => {
        state.uploadLoading = false;
      })
      .addCase(uploadGalleryImage.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.galleries.push(action.payload.data);
      })
      .addCase(createGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = state.galleries.filter((gallery) => gallery._id !== action.payload);
        if (state.currentGallery?._id === action.payload) {
          state.currentGallery = null;
        }
      })
      .addCase(deleteGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentGallery = action.payload.data;
        state.galleries = state.galleries.map((gallery) =>
          gallery._id === action.payload.data._id ? action.payload.data : gallery
        );
      })
      .addCase(updateGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getGalleries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGalleries.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = action.payload.data;
      })
      .addCase(getGalleries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getGalleryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGalleryById.fulfilled, (state, action) => {
  state.loading = false;
  const newData = action.payload.data;
  
  if (action.meta.arg.page === 1) {
    // First page - replace all data
    state.currentGallery = {
      ...newData,
      images: newData.images || []
    };
  } else {
    // Subsequent pages - append images
    if (state.currentGallery) {
      state.currentGallery = {
        ...state.currentGallery,
        images: [...(state.currentGallery.images || []), ...(newData.images || [])]
      };
    }
  }
  
  state.hasMore = newData.hasMore;
  state.totalImages = newData.totalImages;
  state.page = newData.page;
})
      .addCase(getGalleryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetGalleryState } = gallerySlice.actions;
export default gallerySlice.reducer;