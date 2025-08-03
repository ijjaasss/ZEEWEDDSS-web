import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
            
              <span className="text-xl font-bold">ZEE WEDDSS</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Capturing your most precious moments with artistry and passion. 
              Every wedding tells a unique story, and we're here to preserve yours beautifully.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-rose-500" />
                <span className="text-gray-400">zeeweddssweddingcompany@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-rose-500" />
                <span className="text-gray-400">+91 9656945794</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span className="text-gray-400">Kerala,Malappuram</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Wedding Photography</li>
              <li>Engagement Sessions</li>
              <li>Out Door</li>
              <li>Fashion </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 ZEE WEDDSS Wedding Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};