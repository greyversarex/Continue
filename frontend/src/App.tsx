import React from 'react';
import TourList from './components/TourList';
import './App.css';

function App() {
  return (
    <div className="App">
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
        
        <main>
          <TourList />
        </main>
      </div>
    </div>
  );
}

export default App;
