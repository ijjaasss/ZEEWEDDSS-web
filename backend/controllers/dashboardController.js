import Gallery from "../models/galleryModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  // Get total galleries count
  const totalGalleries = await Gallery.countDocuments();

  // Get total images count (using aggregation to sum array lengths)
  const galleriesWithImages = await Gallery.aggregate([
    {
      $project: {
        imagesCount: { $size: "$images" }
      }
    },
    {
      $group: {
        _id: null,
        totalImages: { $sum: "$imagesCount" }
      }
    }
  ]);

  // Get current month's galleries
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  const thisMonthGalleries = await Gallery.countDocuments({
    createdAt: { $gte: firstDayOfMonth }
  });

  // Get recent galleries (last 3 created)
  const recentGalleries = await Gallery.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('images');

  res.status(200).json({
    success: true,
    data: {
      totalGalleries,
      totalImages: galleriesWithImages[0]?.totalImages || 0,
      thisMonth: thisMonthGalleries,
      avgImagesPerGallery: totalGalleries > 0 
        ? Math.round((galleriesWithImages[0]?.totalImages || 0) / totalGalleries)
        : 0,
      recentGalleries
    }
  });
});