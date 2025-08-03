export interface Gallery {

  _id: string;
  clientName: string;
  eventName: string;
  eventDate: string;

  images?: GalleryImage[];
  createdAt: string;
}

export interface GalleryImage {

  _id: string;
  url: string;
  filename: string;
  size: number;
}