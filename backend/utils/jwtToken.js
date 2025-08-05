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
   
    httpOnly: true,
    secure: env.NODE_ENV === 'production', 
    sameSite: env.NODE_ENV === 'production'?'None': 'Lax' ,
    path: '/',
     maxAge: 15 * 60 * 1000, 
  };


  user.password = undefined;

  res.status(200).cookie('token', token, options).json({
      success: true,
      token,
      data: user
    });

};