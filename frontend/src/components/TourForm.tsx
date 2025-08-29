import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tour, Category, ApiResponse } from '../types';

interface TourFormProps {
  tour?: Tour | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const TourForm: React.FC<TourFormProps> = ({ tour, onSuccess, onCancel }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    title_en: '',
    title_ru: '',
    description_en: '',
    description_ru: '',
    duration: '',
    price: '',
    categoryId: 0,
    startTime: '',
    mealsIncluded: false,
    languages: [] as string[],
    availableMonths: [] as string[],
    availableDays: [] as string[]
  });

  useEffect(() => {
    fetchCategories();
    
    // Pre-fill form if editing
    if (tour) {
      setFormData({
        title_en: tour.title.en || '',
        title_ru: tour.title.ru || '',
        description_en: tour.description.en || '',
        description_ru: tour.description.ru || '',
        duration: tour.duration || '',
        price: tour.price || '',
        categoryId: tour.categoryId || 0,
        startTime: (tour as any).startTime || '',
        mealsIncluded: (tour as any).mealsIncluded || false,
        languages: (tour as any).languages ? JSON.parse((tour as any).languages) : [],
        availableMonths: (tour as any).availableMonths ? JSON.parse((tour as any).availableMonths) : [],
        availableDays: (tour as any).availableDays ? JSON.parse((tour as any).availableDays) : []
      });
    }
  }, [tour]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<ApiResponse>('http://localhost:5000/api/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'categoryId' ? parseInt(value) || 0 : value
    }));
  };
  
  // Handle multiple checkbox selections
  const handleMultipleSelection = (name: 'availableMonths' | 'availableDays' | 'languages', value: string) => {
    setFormData(prev => {
      const currentValues = prev[name];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [name]: newValues
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Package multilingual data
    const tourData = {
      title: {
        en: formData.title_en,
        ru: formData.title_ru
      },
      description: {
        en: formData.description_en,
        ru: formData.description_ru
      },
      duration: formData.duration,
      price: formData.price,
      categoryId: formData.categoryId,
      startTime: formData.startTime,
      mealsIncluded: formData.mealsIncluded,
      languages: JSON.stringify(formData.languages),
      availableMonths: JSON.stringify(formData.availableMonths),
      availableDays: JSON.stringify(formData.availableDays)
    };

    try {
      let response;
      
      if (tour) {
        // Update existing tour
        response = await axios.put<ApiResponse>(`http://localhost:5000/api/tours/${tour.id}`, tourData);
      } else {
        // Create new tour
        response = await axios.post<ApiResponse>('http://localhost:5000/api/tours', tourData);
      }

      if (response.data.success) {
        setMessage({ 
          type: 'success', 
          text: tour ? 'Tour updated successfully!' : 'Tour created successfully!' 
        });
        
        // Reset form if creating new
        if (!tour) {
          setFormData({
            title_en: '',
            title_ru: '',
            description_en: '',
            description_ru: '',
            duration: '',
            price: '',
            categoryId: 0,
            startTime: '',
            mealsIncluded: false,
            languages: [],
            availableMonths: [],
            availableDays: []
          });
        }
        
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Tour form error:', err);
      
      let errorMessage = 'Failed to save tour. Please try again.';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* English Fields */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🇺🇸</span>
            English Content
          </h4>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title_en" className="block text-sm font-medium text-gray-700 mb-1">
                Title (English) *
              </label>
              <input
                type="text"
                id="title_en"
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tour title in English"
              />
            </div>

            <div>
              <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 mb-1">
                Description (English) *
              </label>
              <textarea
                id="description_en"
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter detailed description in English"
              />
            </div>
          </div>
        </div>

        {/* Russian Fields */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🇷🇺</span>
            Russian Content
          </h4>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title_ru" className="block text-sm font-medium text-gray-700 mb-1">
                Title (Russian) *
              </label>
              <input
                type="text"
                id="title_ru"
                name="title_ru"
                value={formData.title_ru}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите название тура на русском"
              />
            </div>

            <div>
              <label htmlFor="description_ru" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Russian) *
              </label>
              <textarea
                id="description_ru"
                name="description_ru"
                value={formData.description_ru}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите подробное описание на русском языке"
              />
            </div>
          </div>
        </div>

        {/* Other Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration *
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5 days, 1 week"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., $500, $1,200"
            />
          </div>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name.en}
              </option>
            ))}
          </select>
        </div>
        
        {/* Additional Tour Details */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Время начала тура
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="08:00"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="mealsIncluded"
                checked={formData.mealsIncluded}
                onChange={(e) => setFormData(prev => ({ ...prev, mealsIncluded: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="text-sm font-medium text-gray-700">Приём включен в тур</span>
            </label>
          </div>
        </div>
        
        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Языки тура (select all that apply)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'russian', label: 'Русский' },
              { value: 'english', label: 'Английский' },
              { value: 'tajik', label: 'Таджикский' },
              { value: 'uzbek', label: 'Узбекский' },
              { value: 'kyrgyz', label: 'Киргизский' },
              { value: 'kazakh', label: 'Казахский' },
              { value: 'turkmen', label: 'Туркменский' },
              { value: 'persian', label: 'Персидский' },
              { value: 'arabic', label: 'Арабский' }
            ].map(language => (
              <label key={language.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.languages.includes(language.value)}
                  onChange={() => handleMultipleSelection('languages', language.value)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">{language.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Available Months */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Months (select all that apply)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'january', label: 'Январь' },
              { value: 'february', label: 'Февраль' },
              { value: 'march', label: 'Март' },
              { value: 'april', label: 'Апрель' },
              { value: 'may', label: 'Май' },
              { value: 'june', label: 'Июнь' },
              { value: 'july', label: 'Июль' },
              { value: 'august', label: 'Август' },
              { value: 'september', label: 'Сентябрь' },
              { value: 'october', label: 'Октябрь' },
              { value: 'november', label: 'Ноябрь' },
              { value: 'december', label: 'Декабрь' }
            ].map(month => (
              <label key={month.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.availableMonths.includes(month.value)}
                  onChange={() => handleMultipleSelection('availableMonths', month.value)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">{month.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Available Days of Week */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Days of Week (select all that apply)
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: 'monday', label: 'Понедельник' },
              { value: 'tuesday', label: 'Вторник' },
              { value: 'wednesday', label: 'Среда' },
              { value: 'thursday', label: 'Четверг' },
              { value: 'friday', label: 'Пятница' },
              { value: 'saturday', label: 'Суббота' },
              { value: 'sunday', label: 'Воскресенье' }
            ].map(day => (
              <label key={day.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.availableDays.includes(day.value)}
                  onChange={() => handleMultipleSelection('availableDays', day.value)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">{day.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {tour ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              tour ? 'Update Tour' : 'Create Tour'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TourForm;