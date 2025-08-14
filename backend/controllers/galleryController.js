
import GalleryImage from "../models/galleryImageModel.js";
import Gallery from "../models/galleryModel.js";
import { isValid } from "../services/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateNewTelegramUrl, validateTelegramUrl } from "../services/telagramService.js";

export const createGallery = asyncHandler(async (req, res) => {
  const { clientName, eventName, eventDate } = req.body;

  if(!isValid(clientName,eventName,eventDate)){
      return res.status(400).json({success:false,message:"all field are require"})
  }
  const gallery = await Gallery.create({
    clientName,
    eventName,
    eventDate
  });

  res.status(201).json({
    success: true,
    data: gallery
  });
});

export const getGalleries = asyncHandler(async (req, res) => {
   
  const galleries = await Gallery.find().populate('images');
  
  res.status(200).json({
    success: true,
    count: galleries.length,
    data: galleries
  });
});

export const getGallery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  const gallery = await Gallery.findById(id);
  if (!gallery) {
    return res.status(404).json({success:false,message:"gallery not found"});
  }

  const totalImages = gallery.images.length;
  const totalPages = Math.ceil(totalImages / limit);
  const hasMore = page < totalPages;

  const imageIds = gallery.images.slice((page - 1) * limit, page * limit);
  const images = await GalleryImage.find({ _id: { $in: imageIds } }).sort({ createdAt: -1 });
    for (let img of images) {
    const isValid = await validateTelegramUrl(img.url);
    if (!isValid) {
      const newUrl = await generateNewTelegramUrl(img.fileId);
      img.url = newUrl;
      await img.save(); // update in DB
    }
  }
  res.status(200).json({
    success: true,
    data: {
      ...gallery.toObject(),
      images,
      page,
      limit,
      totalImages,
      hasMore
    }
  });
});

export const updateGallery = asyncHandler(async (req, res, next) => {
      const { clientName, eventName, eventDate } = req.body;
  let gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    return res.status(404).json({success:false,message:"gallery not found"})
  }

  gallery = await Gallery.findByIdAndUpdate(req.params.id,{ clientName, eventName, eventDate}, {
    new: true,
    runValidators: true
  }).populate('images');

  res.status(200).json({
    success: true,
    data: gallery
  });
});

export const deleteGallery = asyncHandler(async (req, res, next) => {
  const gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    return res.status(404).json({success:false,message:"gallery not found"})
  }

  await GalleryImage.deleteMany({ _id: { $in: gallery.images } });

  await gallery.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});