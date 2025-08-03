import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {  Home, Shield, Image,  Sliders } from 'lucide-react';
import { useAppSelector } from '../../hooks';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const { isLogin } = useAppSelector((state) => state.auth);
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            {/* <Camera className="w-8 h-8 text-rose-500" /> */}
            <span className="text-xl font-bold text-gray-900">
              ZEE WEDDSS
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-rose-600 bg-rose-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

          {
            isLogin&&
            <>
              <Link
              to="/admin/galleries"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin/galleries')
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Galleries</span>
            </Link>
             <Link
              to="/admin/control-panel"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin/control-panel')
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Control Panel</span>
            </Link>
           </>
          }

            {
              isLogin?(
                <Link
              to="/admin"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin')
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
           
              <span>Dashboard</span>
            </Link>
              ):(
                <Link
              to="/login"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/login')
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>
              )
            }
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className="flex items-center space-x-4">
              <Link to={isLogin?"/admin":"/login"} className="text-gray-600 hover:text-gray-900">
                <Shield className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};