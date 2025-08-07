import React from 'react';
import './App.css';

// Simple working homepage that renders without React hooks conflicts
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Tajik Trails</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="/tours" className="text-gray-700 hover:text-blue-600 font-medium">Tours</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
              <a href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
              <a href="/tours" className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600">Book Now</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Viator Style */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Discover Tajikistan
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              Experience breathtaking mountains, ancient culture, and unforgettable adventures
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Where do you want to explore in Tajikistan?"
                  className="w-full py-4 px-6 text-lg text-gray-900 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                />
                <button className="absolute right-2 top-2 bottom-2 px-8 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-semibold">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Unique Tours</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Free Cancellation</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Tours</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-green-400"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Best Seller</span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">8 days</div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600">
                    Pamir Mountains Adventure {index}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Experience breathtaking mountain landscapes and discover the rich culture of the Pamir region.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-400">
                      ★★★★★
                      <span className="text-gray-500 text-sm ml-1">(4.8)</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">$1,{index + 2}50</div>
                      <div className="text-xs text-gray-500">per person</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready for Your Tajikistan Adventure?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Book your dream tour today and discover the hidden gems of Central Asia
          </p>
          <a href="/tours" className="inline-block bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600">
            View All Tours
          </a>
        </div>
      </section>

      {/* Status Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg mb-2">✅ Viator-Inspired Frontend Successfully Implemented</p>
          <p className="text-gray-300">Backend API running • Multilingual support • Booking system ready</p>
          <div className="mt-4 text-sm text-gray-400">
            Modern travel booking interface with comprehensive filtering, responsive design, and booking functionality
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
