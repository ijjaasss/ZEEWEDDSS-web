export interface Gallery {

  id: string;
  clientName: string;
  eventName: string;
  eventDate: string;

  images: GalleryImage[];
  createdAt: string;
}

export interface GalleryImage {

  id: string;
  url: string;
  filename: string;
  size: number;
}

export interface User {
  email: string;

}

export interface DashboardStats {
  totalGalleries: number;
  totalImages: number;
  thisMonth: number;
  avgImagesPerGallery: number;
  recentGalleries: Gallery[];
}