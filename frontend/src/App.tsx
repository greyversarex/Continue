import React from 'react';
import './App.css';

// Exact Viator clone
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Exact Viator Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Viator Logo */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <svg className="w-20 h-8" viewBox="0 0 120 40" fill="none">
                  <text x="0" y="25" fontSize="18" fontWeight="bold" fill="#00A651">viator</text>
                  <text x="0" y="35" fontSize="8" fill="#666">A TripAdvisor company</text>
                </svg>
              </div>
              <div className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer">
                <span className="font-medium">Discover</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Exact Viator Hero Section */}
      <section className="relative h-screen">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 800\"%3E%3Cdefs%3E%3ClinearGradient id=\"beach\" x1=\"0%25\" y1=\"0%25\" x2=\"100%25\" y2=\"100%25\"%3E%3Cstop offset=\"0%25\" style=\"stop-color:%23FFE5B4\" /%3E%3Cstop offset=\"50%25\" style=\"stop-color:%23D2B48C\" /%3E%3Cstop offset=\"100%25\" style=\"stop-color:%23CD853F\" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23beach)\" /%3E%3Cpath d=\"M0,600 Q300,550 600,580 T1200,600 L1200,800 L0,800 Z\" fill=\"%23F0E68C\" opacity=\"0.7\" /%3E%3Cpath d=\"M0,650 Q400,600 800,630 T1200,650 L1200,800 L0,800 Z\" fill=\"%23DEB887\" opacity=\"0.8\" /%3E%3Cpath d=\"M800,200 Q850,180 900,200 Q950,220 1000,200 Q1050,180 1100,200 L1100,400 Q1050,380 1000,400 Q950,420 900,400 Q850,380 800,400 Z\" fill=\"%234682B4\" opacity=\"0.6\" /%3E%3Cellipse cx=\"1000\" cy=\"300\" rx=\"80\" ry=\"120\" fill=\"%23FF6347\" opacity=\"0.8\" /%3E%3C/svg%3E')"
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-6xl font-bold mb-4 leading-tight">
            Seize the summer
          </h1>
          <p className="text-xl mb-12 font-light">
            Dive into 300,000+ travel experiences
          </p>
          
          {/* Exact Viator Search Form */}
          <div className="bg-white rounded-full p-2 shadow-2xl max-w-2xl w-full flex">
            <div className="flex-1 px-6 py-4">
              <div className="text-gray-500 text-sm font-medium">Where to?</div>
              <input 
                type="text" 
                placeholder="Search for a place or activity"
                className="text-gray-900 w-full focus:outline-none text-lg"
              />
            </div>
            <div className="border-l border-gray-200 flex-1 px-6 py-4">
              <div className="text-gray-500 text-sm font-medium">When</div>
              <input 
                type="text" 
                placeholder="Select Dates"
                className="text-gray-900 w-full focus:outline-none text-lg"
              />
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-4 m-1 font-semibold flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Carousel Dots */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
        </div>
        
        {/* "Do more with Viator" */}
        <div className="absolute bottom-8 right-8">
          <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
            Do more with Viator
          </div>
        </div>
      </section>

      {/* Why book with Viator? - Exact Copy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Why book with Viator?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">24/7 customer support</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                No matter the time zone, we're here to help.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Earn rewards</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Explore, earn, redeem, and repeat with our loyalty program.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Millions of reviews</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Plan and book with confidence using reviews from fellow travelers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Plan your way</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stay flexible with free cancellation and the option to reserve now and pay later at no additional cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Banner */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Log in to manage bookings & Viator Rewards
          </h2>
          <p className="text-gray-600 mb-6">
            Don't have an account yet? <span className="text-blue-600 underline cursor-pointer">Sign up</span>
          </p>
          <button className="bg-black text-white px-12 py-3 rounded-lg font-semibold hover:bg-gray-800">
            Log in
          </button>
        </div>
      </section>

      {/* Recently viewed */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recently viewed</h2>
            <a href="#" className="text-blue-600 hover:underline font-medium">See all &gt;</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tour Card 1 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-500 mb-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Rio de Janeiro, Southeast Brazil
              </div>
              <div className="flex items-center text-green-600 text-xs mb-2">
                <span className="mr-1">★</span>
                <span className="font-semibold">4.6</span>
                <span className="text-gray-500 ml-1">(122)</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Telegraph Stone Adventure
              </h3>
              <div className="text-lg font-bold">from $43</div>
            </div>
            
            {/* Tour Card 2 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <div className="w-full h-64 bg-gradient-to-br from-green-400 to-green-600"></div>
                <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-500 mb-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Rio de Janeiro, Southeast Brazil
              </div>
              <div className="flex items-center text-green-600 text-xs mb-2">
                <span className="mr-1">★</span>
                <span className="font-semibold">4.9</span>
                <span className="text-gray-500 ml-1">(313)</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Rainforest Hike in Rio: Tijuca Waterfalls, Wildlife & Caves
              </h3>
              <div className="text-sm text-gray-500 mb-1">from $72</div>
              <div className="text-xs text-gray-400">Price varies by group size</div>
            </div>
            
            {/* Tour Card 3 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <div className="w-full h-64 bg-gradient-to-br from-orange-400 to-orange-600"></div>
                <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-500 mb-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Rome, Italy
              </div>
              <div className="flex items-center text-green-600 text-xs mb-2">
                <span className="mr-1">★</span>
                <span className="font-semibold">4.5</span>
                <span className="text-gray-500 ml-1">(5,320)</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Pompeii, Amalfi Coast and Positano Day Trip from Rome
              </h3>
              <div className="text-sm text-gray-500 mb-1">from $130</div>
              <div className="text-xs text-gray-400">Price varies by group size</div>
            </div>
          </div>
        </div>
      </section>

      {/* Keep things flexible */}
      <section className="py-20 bg-green-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Keep things flexible
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Use Reserve Now & Pay Later to secure the activities you don't want to miss without being locked in.
          </p>
        </div>
      </section>

      {/* Recommended Tours */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Based on your interest in Rio de Janeiro
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Full Day: Christ Redeemer, Sugarloaf, City Tour & Barbecue Lunch", price: "$80", rating: "4.7", reviews: "(770)", location: "Rio de Janeiro, Southeast Brazil" },
              { title: "Rio's Full Day: Selaron Steps, Christ & Sugarloaf – Tickets & Lunch Included", price: "$149", rating: "4.2", reviews: "(467)", location: "Rio de Janeiro, Southeast Brazil" },
              { title: "The Best Half Day in Rio with Christ Redeemer and Sugar Loaf Hill", price: "$88", rating: "4.8", reviews: "(1,140)", location: "Rio de Janeiro, Southeast Brazil" },
              { title: "Sunset Sailing Tour in Rio de Janeiro", price: "$68", rating: "4.9", reviews: "(673)", location: "Rio de Janeiro, Southeast Brazil" }
            ].map((tour, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <div className={`w-full h-48 bg-gradient-to-br ${
                    index === 0 ? 'from-blue-400 to-cyan-600' :
                    index === 1 ? 'from-green-400 to-emerald-600' :
                    index === 2 ? 'from-purple-400 to-indigo-600' :
                    'from-orange-400 to-red-500'
                  }`}></div>
                  <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="text-xs text-gray-500 mb-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {tour.location}
                </div>
                <div className="flex items-center text-green-600 text-xs mb-2">
                  <span className="mr-1">★</span>
                  <span className="font-semibold">{tour.rating}</span>
                  <span className="text-gray-500 ml-1">{tour.reviews}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 line-clamp-2">
                  {tour.title}
                </h3>
                <div className="text-lg font-bold">from {tour.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Destinations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Top Destinations
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              "Las Vegas", "Rome", "Paris", "London", "New York City",
              "Washington DC", "Cancun", "Florence", "Barcelona", "Oahu"
            ].map((city, index) => (
              <div key={index} className="relative group cursor-pointer">
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <div className={`w-full h-full bg-gradient-to-br ${
                    index % 5 === 0 ? 'from-red-400 to-pink-600' :
                    index % 5 === 1 ? 'from-blue-400 to-indigo-600' :
                    index % 5 === 2 ? 'from-green-400 to-emerald-600' :
                    index % 5 === 3 ? 'from-yellow-400 to-orange-600' :
                    'from-purple-400 to-violet-600'
                  }`}></div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-bold text-lg">{city}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free cancellation */}
      <section className="py-20 bg-green-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Free cancellation
          </h2>
          <p className="text-lg text-gray-600">
            You'll receive a full refund if you cancel at least 24 hours in advance of most experiences.
          </p>
        </div>
      </section>

      {/* Trustpilot Reviews */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Excellent</div>
              <div className="flex justify-center mb-2">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm text-gray-500">Based on 274,247 reviews</div>
              <div className="mt-4">
                <svg className="w-20 h-8 mx-auto" viewBox="0 0 120 40" fill="none">
                  <text x="0" y="25" fontSize="14" fontWeight="bold" fill="#00B67A">Trustpilot</text>
                </svg>
              </div>
            </div>
            
            {[
              { time: "23 minutes ago", text: "Sales person was quick", detail: "Sales person was quick, courteous, and had the answers I needed without waiting.", author: "David Chamois" },
              { time: "45 minutes ago", text: "Good selection of tours.", detail: "Good selection of tours.", author: "Don Sessler" },
              { time: "53 minutes ago", text: "Booking several consecutive excursions...", detail: "Booking several consecutive excursions was straightforward and when I made an error or wrong...", author: "James Macpherson" }
            ].map((review, index) => (
              <div key={index} className="text-left">
                <div className="flex mb-2">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-2">{review.time}</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">{review.text}</h4>
                <p className="text-xs text-gray-600 mb-2">{review.detail}</p>
                <p className="text-xs text-gray-500">{review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center space-x-8 mb-8">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.742.098.119.112.223.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.766-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.012 0z"/></svg>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <div className="flex">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm">4.4 rating | 274,247 reviews</span>
              <svg className="w-16 h-4" viewBox="0 0 80 20" fill="none">
                <text x="0" y="15" fontSize="10" fontWeight="bold" fill="#00B67A">Trustpilot</text>
              </svg>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
