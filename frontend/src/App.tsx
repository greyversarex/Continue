import React from 'react';
import './App.css';

// Simple component without hooks to test basic React functionality
const SimpleComponent: React.FC = () => {
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to Tajik Trails
          </h2>
          <p className="text-gray-600 mb-6">
            Testing basic React without hooks...
          </p>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-800">
              If you can see this page without errors, React is working!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <SimpleComponent />
    </div>
  );
}

export default App;
