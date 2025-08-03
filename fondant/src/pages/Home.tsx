import React, { useEffect, useState } from 'react';

import { Camera, Heart, Award, Users } from 'lucide-react';
import axios from 'axios';
interface Image {
  _id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  __v: number;
  pageType?: string;
}

interface ApiResponse {
  success: boolean;
  data: Image[];
}
interface HomePageImages {
  home: Image;
  about: Image;
}

export const Home: React.FC = () => {
 const [recentImages, setRecentImages] = useState<Image[]>([]);
  const [homeImages, setHomeImages] = useState<HomePageImages | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent work images
        const recentResponse = await axios.get<ApiResponse>(
          `${import.meta.env.VITE_API_URL}/recent-image`
        );
        
        // Fetch home page images
        const homeResponse = await axios.get<{ success: boolean; data: HomePageImages }>(
          `${import.meta.env.VITE_API_URL}/home-page`
        );

        if (recentResponse.data.success) {
          setRecentImages(recentResponse.data.data);
        }

        if (homeResponse.data.success) {
          setHomeImages(homeResponse.data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-gray-100">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          
         style={{
            backgroundImage: homeImages?.home 
              ? `url(${homeImages.home.url})` 
              : 'url(/images/homebackground.jpg)'
          }}
        ></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Capturing Your
            <span className="text-white block">Perfect Moments</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Professional wedding photography that tells your unique love story with elegance and artistry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
           
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About ZEE WEDDSS Wedding Company
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                With over a decade of experience capturing love stories, we specialize in creating 
                timeless wedding photography that reflects the unique personality of each couple.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our approach combines artistic vision with documentary storytelling, ensuring that 
                every precious moment of your special day is preserved beautifully for generations to come.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-500 mb-2">50+</div>
                  <div className="text-sm text-gray-600">Weddings Captured</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-500 mb-2">2+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={homeImages?.about ? homeImages.about.url: "/images/aboutpic.JPG"}
                alt="Wedding couple"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg">
                <Camera className="w-8 h-8 text-rose-500 mb-2" />
                <div className="text-sm font-semibold text-gray-900">Professional</div>
                <div className="text-sm text-gray-600">Equipment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide more than just photography – we create lasting memories with exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-white p-6 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Personalized Approach
                </h3>
                <p className="text-gray-600">
                  Every couple is unique, and we tailor our photography style to match your vision and personality.
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-white p-6 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                <Award className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Award-Winning Quality
                </h3>
                <p className="text-gray-600">
                  Our work has been recognized by industry professionals and featured in top wedding publications.
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-white p-6 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                <Users className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Exceptional Service
                </h3>
                <p className="text-gray-600">
                  From planning to delivery, we provide seamless service that lets you focus on enjoying your day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recent Work
            </h2>
            <p className="text-lg text-gray-600">
              A glimpse into some of our favorite moments captured
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {recentImages.map((image) => (
                <div key={image._id} className="group relative overflow-hidden rounded-xl aspect-square">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      
    </div>
  );
};