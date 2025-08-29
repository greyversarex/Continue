import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Hotel {
  id?: number;
  name: {
    en: string;
    ru: string;
  };
  description: {
    en: string;
    ru: string;
  };
  brand?: string;
  country: string;
  city: string;
  address?: string;
  rating?: number;
  priceRange?: string;
  amenities?: string[];
  images?: string[];
  isActive?: boolean;
}

interface HotelFormProps {
  hotel: Hotel | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface Message {
  type: 'success' | 'error';
  text: string;
}

const HotelForm: React.FC<HotelFormProps> = ({ hotel, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name_en: '',
    name_ru: '',
    description_en: '',
    description_ru: '',
    brand: '',
    country: '',
    city: '',
    address: '',
    rating: 0,
    priceRange: '',
    amenities: [] as string[],
    images: [] as string[]
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [newAmenity, setNewAmenity] = useState('');
  const [newImage, setNewImage] = useState('');

  // Countries data for dropdown
  const countries = [
    'Таджикистан',
    'Узбекистан', 
    'Кыргызстан',
    'Казахстан',
    'Туркменистан'
  ];

  // Hotel brands data
  const hotelBrands = [
    'Four Seasons',
    'Hilton',
    'Marriott',
    'Hyatt',
    'InterContinental',
    'Radisson',
    'Sheraton',
    'Other'
  ];

  useEffect(() => {
    if (hotel) {
      setFormData({
        name_en: typeof hotel.name === 'object' ? hotel.name.en || '' : hotel.name || '',
        name_ru: typeof hotel.name === 'object' ? hotel.name.ru || '' : hotel.name || '',
        description_en: typeof hotel.description === 'object' ? hotel.description.en || '' : hotel.description || '',
        description_ru: typeof hotel.description === 'object' ? hotel.description.ru || '' : hotel.description || '',
        brand: hotel.brand || '',
        country: hotel.country || '',
        city: hotel.city || '',
        address: hotel.address || '',
        rating: hotel.rating || 0,
        priceRange: hotel.priceRange || '',
        amenities: hotel.amenities || [],
        images: hotel.images || []
      });
    }
  }, [hotel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const hotelData = {
        name: {
          en: formData.name_en,
          ru: formData.name_ru
        },
        description: {
          en: formData.description_en,
          ru: formData.description_ru
        },
        brand: formData.brand,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        rating: formData.rating,
        priceRange: formData.priceRange,
        amenities: formData.amenities,
        images: formData.images
      };

      const response = await axios({
        method: hotel ? 'PUT' : 'POST',
        url: hotel 
          ? `http://localhost:5000/api/hotels/${hotel.id}`
          : 'http://localhost:5000/api/hotels',
        data: hotelData
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: hotel ? 'Hotel updated successfully!' : 'Hotel created successfully!' });
        onSuccess();
      } else {
        setMessage({ type: 'error', text: response.data.error || 'Failed to save hotel' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index)
    });
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage.trim()]
      });
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8 max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {hotel ? 'Edit Hotel' : 'Add New Hotel'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message && (
            <div className={`p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel Name (English)
              </label>
              <input
                type="text"
                required
                value={formData.name_en}
                onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel Name (Russian)
              </label>
              <input
                type="text"
                required
                value={formData.name_ru}
                onChange={(e) => setFormData({...formData, name_ru: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (English)
              </label>
              <textarea
                required
                rows={4}
                value={formData.description_en}
                onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Russian)
              </label>
              <textarea
                required
                rows={4}
                value={formData.description_ru}
                onChange={(e) => setFormData({...formData, description_ru: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location & Brand */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                required
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Brand</option>
                {hotelBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Address & Rating */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (0-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add amenity"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (hotel ? 'Update Hotel' : 'Create Hotel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HotelForm;