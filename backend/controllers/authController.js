import Gallery from "../models/galleryModel.js";
import User from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendToken } from "../utils/jwtToken.js";




export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

 
  if (!email || !password) {
    return res.status(400).json({success:false,message:"Please provide email and password"})
  }


  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({success:false,message:"Invalid credentials"})
  }


  sendToken(user, 200, res);
  res.status(200).json({
      success: true,
      data: user
    });
});

export const logoutUser = asyncHandler(async (req, res) => {
 res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    maxAge:0
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  
  res.status(200).json({
    success: true,
    data: user
  });
});

