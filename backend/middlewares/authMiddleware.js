import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import env from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

  }


  else if (req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
   
    return res.status(401).json({message:'Not authorized to access this route',success:false})
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

 
    const currentUser = await User.findById(decoded.id).select('-password');
    if (!currentUser) {
        
      return res.status(401).json({message:'User no longer exists',success:false})
    }


    req.user = currentUser;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});