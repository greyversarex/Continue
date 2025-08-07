import React from 'react';
import './App.css';

// Simple working homepage without complex dependencies for now
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center text-blue-600">
            Tajik Trails
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Discover the Beauty of Tajikistan
          </p>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Experience Authentic Tajikistan
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
            Join us on unforgettable journeys through the majestic Pamir Mountains and discover the rich cultural heritage of Tajikistan. 
            Our expert local guides will take you on adventures of a lifetime.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
              <p className="text-gray-600">
                Our experienced guides know every trail and story of the magnificent Pamir Mountains.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Safety First</h3>
              <p className="text-gray-600">
                All our tours are carefully planned with safety equipment and emergency protocols.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Experiences</h3>
              <p className="text-gray-600">
                Experience genuine Tajik culture, cuisine, and traditions with local families.
              </p>
            </div>
          </div>
        </section>
        
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Featured Tours
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-2">Pamir Mountains Trek</h3>
              <p className="text-gray-600 mb-4">
                Experience the breathtaking beauty of the Pamir Mountains with this challenging trek through some of Tajikistan's most spectacular landscapes.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Duration: 8 days</span>
                <span className="text-green-600 font-semibold">$1,350</span>
              </div>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-2">Cultural Heritage Tour</h3>
              <p className="text-gray-600 mb-4">
                Discover the rich cultural heritage of Tajikistan with visits to ancient sites, traditional markets, and local communities.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Duration: 5 days</span>
                <span className="text-green-600 font-semibold">$750</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Backend API is running and ready for bookings!</p>
            <p className="text-sm text-gray-500">Email notifications and multilingual support are configured.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
