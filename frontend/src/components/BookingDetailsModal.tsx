import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Tour, Hotel, Guide, BookingRequest } from '../types';

interface BookingDetailsModalProps {
  tourId?: number;
  onClose: () => void;
  onSubmit: (bookingData: any) => void;
}

interface BookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  participants: Array<{
    fullName: string;
    dateOfBirth: string;
  }>;
  selectedDate: string;
  selectedHotel?: Hotel;
  selectedRoomCategory?: string;
  selectedGuide?: Guide;
  specialRequests: string;
  agreeToTerms: boolean;
  agreeToPaymentTerms: boolean;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  tourId,
  onClose,
  onSubmit
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'hotel' | 'booking' | 'payment'>('hotel');
  
  // Отладочная информация
  console.log('Current step in render:', step);
  const [tour, setTour] = useState<Tour | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    participants: [{ fullName: '', dateOfBirth: '' }],
    selectedDate: new Date().toISOString().split('T')[0],
    specialRequests: '',
    agreeToTerms: false,
    agreeToPaymentTerms: false
  });

  useEffect(() => {
    if (tourId) {
      fetchTourDetails();
    }
  }, [tourId]);

  const fetchTourDetails = async () => {
    try {
      const [tourRes, hotelsRes, guidesRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/tours/${tourId}`),
        axios.get('http://localhost:3001/api/hotels'),
        axios.get('http://localhost:3001/api/guides')
      ]);

      if (tourRes.data.success) {
        setTour(tourRes.data.data);
      }

      if (hotelsRes.data.success) {
        setHotels(hotelsRes.data.data);
      }

      if (guidesRes.data.success) {
        setGuides(guidesRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching tour details:', error);
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, { fullName: '', dateOfBirth: '' }]
    }));
  };

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const updateParticipant = (index: number, field: 'fullName' | 'dateOfBirth', value: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map((participant, i) => 
        i === index ? { ...participant, [field]: value } : participant
      )
    }));
  };

  const handleSubmit = async () => {
    if (!formData.agreeToTerms || !formData.agreeToPaymentTerms) {
      alert('Необходимо принять условия соглашения');
      return;
    }

    const bookingData = {
      tourId,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      participants: formData.participants,
      selectedDate: formData.selectedDate,
      hotelId: formData.selectedHotel?.id,
      guideId: formData.selectedGuide?.id,
      specialRequests: formData.specialRequests
    };

    onSubmit(bookingData);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных о туре...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Бронирование тура
              </h3>
              {tour && (
                <p className="text-sm text-gray-600">
                  {typeof tour.title === 'object' ? tour.title.ru : tour.title}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center">
              {['hotel', 'booking', 'payment'].map((stepKey, index) => (
                <React.Fragment key={stepKey}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step === stepKey ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 2 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      ['hotel', 'booking', 'payment'].indexOf(step) > index ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-600">Выбор отеля</span>
              <span className="text-sm text-gray-600">Данные бронирования</span>
              <span className="text-sm text-gray-600">Оплата</span>
            </div>
          </div>

          {/* Hotel Selection Step */}
          {step === 'hotel' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Выберите отель и категорию номера
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {hotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        formData.selectedHotel?.id === hotel.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 text-lg">
                            {typeof hotel.name === 'object' ? hotel.name.ru : hotel.name}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {typeof hotel.description === 'object' ? hotel.description?.ru : hotel.description || ''}
                          </p>
                          <p className="text-sm font-medium text-blue-600 mt-2">
                            {hotel.rating}⭐ • {hotel.location}
                          </p>
                        </div>
                      </div>
                      
                      {/* Room Categories */}
                      <div className="mt-4">
                        <h6 className="font-medium text-gray-800 mb-3">Категории номеров:</h6>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {['Стандарт', 'Комфорт', 'Люкс'].map((category) => (
                            <div
                              key={category}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                formData.selectedHotel?.id === hotel.id && formData.selectedRoomCategory === category
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => {
                                setFormData(prev => ({ 
                                  ...prev, 
                                  selectedHotel: hotel, 
                                  selectedRoomCategory: category 
                                }));
                              }}
                            >
                              <div className="text-sm font-medium text-gray-900">{category}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                {category === 'Стандарт' && 'Базовые удобства'}
                                {category === 'Комфорт' && 'Улучшенные условия'}
                                {category === 'Люкс' && 'Премиум сервис'}
                              </div>
                              <div className="text-sm font-medium text-blue-600 mt-2">
                                {category === 'Стандарт' && 'от $50/ночь'}
                                {category === 'Комфорт' && 'от $80/ночь'}
                                {category === 'Люкс' && 'от $120/ночь'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {formData.selectedHotel?.id === hotel.id && formData.selectedRoomCategory && (
                        <div className="mt-4 pt-4 border-t">
                          <button
                            onClick={() => {
                              console.log('Hotel and room selected:', hotel.id, formData.selectedRoomCategory);
                              setStep('booking');
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                          >
                            Продолжить с {formData.selectedRoomCategory}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Booking Details Step */}
          {(() => {
            console.log('Rendering booking step check. Step is:', step, 'Should show booking?', step === 'booking');
            return null;
          })()}
          {step === 'booking' && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Контактная информация
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ФИО заказчика *
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата тура *
                </label>
                <input
                  type="date"
                  value={formData.selectedDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, selectedDate: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Participants */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Список туристов
                  </h4>
                  <button
                    onClick={addParticipant}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Добавить туриста
                  </button>
                </div>
                
                {formData.participants.map((participant, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ФИО туриста *
                      </label>
                      <input
                        type="text"
                        value={participant.fullName}
                        onChange={(e) => updateParticipant(index, 'fullName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Дата рождения *
                      </label>
                      <input
                        type="date"
                        value={participant.dateOfBirth}
                        onChange={(e) => updateParticipant(index, 'dateOfBirth', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {formData.participants.length > 1 && (
                      <div className="md:col-span-2 flex justify-end">
                        <button
                          onClick={() => removeParticipant(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Удалить туриста
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Guide Selection */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Выберите гида (опционально)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guides.map((guide) => (
                    <div
                      key={guide.id}
                      onClick={() => setFormData(prev => ({ ...prev, selectedGuide: guide }))}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.selectedGuide?.id === guide.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h5 className="font-medium text-gray-900">
                        {typeof guide.name === 'object' ? guide.name.ru : guide.name}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        Языки: {guide.languages?.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Опыт: {guide.experience} лет
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Особые пожелания
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Укажите любые особые пожелания или требования..."
                />
              </div>

              {/* Agreements */}
              <div className="space-y-3">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    Я принимаю все условия Оферты (Договора) и даю согласие на использование моих персональных данных в рамках бронирования выбранного туристического продукта.
                  </span>
                </label>
                
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeToPaymentTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreeToPaymentTerms: e.target.checked }))}
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    Я ознакомлен с Правилами оплаты и возврата средств и подтверждаю их применение.
                  </span>
                </label>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('hotel')}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50"
                >
                  Назад
                </button>
                <button
                  onClick={() => setStep('payment')}
                  disabled={!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.agreeToTerms || !formData.agreeToPaymentTerms}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Продолжить к оплате
                </button>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">
                Выберите способ оплаты
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'payme', name: 'Payme', icon: '💳' },
                  { key: 'click', name: 'Click', icon: '📱' },
                  { key: 'stripe', name: 'Stripe', icon: '💯' },
                  { key: 'paypal', name: 'PayPal', icon: '🏦' }
                ].map((method) => (
                  <div
                    key={method.key}
                    className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50"
                    onClick={() => handleSubmit()}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="font-medium text-gray-900">{method.name}</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Сводка заказа:</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Тур:</span>
                      <span>{tour && (typeof tour.title === 'object' ? tour.title.ru : tour.title)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Количество туристов:</span>
                      <span>{formData.participants.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Отель:</span>
                      <span>{formData.selectedHotel && (typeof formData.selectedHotel.name === 'object' ? formData.selectedHotel.name.ru : formData.selectedHotel.name)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Дата:</span>
                      <span>{new Date(formData.selectedDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg border-t pt-2 mt-2">
                      <span>Итого:</span>
                      <span>${tour ? (parseInt(tour.price) * formData.participants.length).toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('booking')}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50"
                >
                  Назад
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;