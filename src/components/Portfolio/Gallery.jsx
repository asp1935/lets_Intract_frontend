import React, { useState } from 'react';
import { FaPlay, FaImages, FaVideo, FaTimes } from 'react-icons/fa';

const Gallery = ({ galleryItems }) => {

  const [activeTab, setActiveTab] = useState('images');


  // Filter items by type with proper null checks
  const images = galleryItems?.filter(item => item?.type === 'img') || [];
  const videos = galleryItems?.filter(item => item?.type === 'video') || [];
  const url = import.meta.env.VITE_IMG_URL;




  return (
    <section className="py-12 bg-gray-50 w-full" id="gallery">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-color mb-3">Our Creative Showcase</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of stunning visuals and engaging video content
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center mt-8 mb-8">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-6 py-2 text-sm font-medium rounded-l-lg flex items-center justify-center ${activeTab === 'images'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'}`}
                onClick={() => setActiveTab('images')}
                aria-current={activeTab === 'images' ? 'page' : undefined}
              >
                <FaImages className="mr-2" /> Images ({images.length})
              </button>
              <button
                type="button"
                className={`px-6 py-2 text-sm font-medium rounded-r-lg flex items-center justify-center ${activeTab === 'videos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'}`}
                onClick={() => setActiveTab('videos')}
                aria-current={activeTab === 'videos' ? 'page' : undefined}
              >
                <FaVideo className="mr-2" /> Videos ({videos.length})
              </button>
            </div>
          </div>
        </div>

        {/* Images Section */}
        {activeTab === 'images' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((item, index) => (
              <div key={`image-${index}`} className="group relative">
                <div
                  className="relative overflow-hidden rounded-xl shadow-md transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1 cursor-pointer h-64"
                  // onClick={() => openLightbox(item)}
                  style={{ boxShadow: " rgba(3, 51, 107, 0.5) 0px 0px 0px 3px" }}
                >
                  <img
                    src={url + item.url}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-white text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-lg font-semibold mb-1">{item.title || 'Untitled'}</h3>
                      {item.description && <p className="text-sm">{item.description}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos Section */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((item, index) => (
              <div key={`video-${index}`} className="group relative">
                <div
                  className="relative overflow-hidden rounded-xl shadow-md transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1 cursor-pointer h-64"
                  // onClick={() => openLightbox(item)}/
                  style={{ boxShadow: "rgba(3, 51, 107, 0.5) 0px 0px 0px 3px" }}
                >
                  {/* Video Thumbnail Container */}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    {item.url ? (
                      <video
                        src={url + item.url}
                        controls
                        alt={item.title || 'Video thumbnail'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-gray-500 text-center p-4">
                        <FaVideo className="text-4xl mx-auto mb-2" />
                        <p>No thumbnail available</p>
                      </div>
                    )}
                  </div>

                  {/* Play button overlay */}
                  {/* <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all duration-300">
                    <div className="icon-bg rounded-full p-4 flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
                      <FaPlay className="text-white text-xl" />
                    </div>
                  </div> */}
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-lg text-center font-semibold text-color">{item.title || 'Untitled Video'}</h3>
                  {item.description && <p className="text-gray-600 mt-1">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;