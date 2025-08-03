import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
};

export const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);


  const options = {
    expires: new Date(
      Date.now() + env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: env.NODE_ENV === 'production', 
    sameSite: 'strict'
  };


  user.password = undefined;

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: user
    });
};