import React, { useState } from 'react';
import './App.css';

// Русская версия Viator для Таджикистана
const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const categories = [
    { id: 'mountains', name: 'Горные туры', count: 15 },
    { id: 'culture', name: 'Культурные туры', count: 8 },
    { id: 'adventure', name: 'Приключения', count: 12 },
    { id: 'silk-road', name: 'Шёлковый путь', count: 6 },
    { id: 'lakes', name: 'Озёра', count: 9 },
    { id: 'trekking', name: 'Треккинг', count: 18 }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Заголовок сайта */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Логотип */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <img 
                  src="/logo-bunyod-tour.png" 
                  alt="Bunyod-Tour" 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <span className="text-xl font-bold text-gray-900">Bunyod-Tour</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer">
                <span className="font-medium">Открыть</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Правая часть */}
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

      {/* Главный баннер */}
      <section className="relative h-screen">
        {/* Фоновое изображение */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 800\"%3E%3Cdefs%3E%3ClinearGradient id=\"mountains\" x1=\"0%25\" y1=\"100%25\" x2=\"100%25\" y2=\"0%25\"%3E%3Cstop offset=\"0%25\" style=\"stop-color:%234A90E2\" /%3E%3Cstop offset=\"50%25\" style=\"stop-color:%237ED321\" /%3E%3Cstop offset=\"100%25\" style=\"stop-color:%23F5A623\" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23mountains)\" /%3E%3Cpath d=\"M0,400 Q200,300 400,350 Q600,400 800,320 Q1000,250 1200,300 L1200,800 L0,800 Z\" fill=\"%234A90E2\" opacity=\"0.7\" /%3E%3Cpath d=\"M0,500 Q300,450 600,480 Q900,510 1200,470 L1200,800 L0,800 Z\" fill=\"%237ED321\" opacity=\"0.6\" /%3E%3Cpath d=\"M200,200 Q250,150 300,180 Q350,210 400,170 Q450,130 500,160 L500,350 Q450,320 400,350 Q350,380 300,360 Q250,340 200,370 Z\" fill=\"%23F5A623\" opacity=\"0.8\" /%3E%3C/svg%3E')"
          }}
        >
          {/* Затемнение */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        
        {/* Содержимое баннера */}
        <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-6xl font-bold mb-4 leading-tight">
            Bunyod-Tour: Откройте для себя Таджикистан
          </h1>
          <p className="text-xl mb-12 font-light">
            Погрузитесь в мир удивительных приключений
          </p>
          

        </div>
        
        {/* Точки карусели */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
        </div>
        
        {/* Брендинг */}
        <div className="absolute bottom-8 right-8">
          <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
            Больше с Tajik Trails
          </div>
        </div>
      </section>

      {/* Система фильтров туров */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Найдите идеальный тур
          </h2>
          
          {/* Фильтры */}
          <div className="bg-gray-50 rounded-lg p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Категория */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Категория тура</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Все категории</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Продолжительность */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Продолжительность</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option value="">Любая</option>
                  <option value="1">1 день</option>
                  <option value="2-3">2-3 дня</option>
                  <option value="4-7">4-7 дней</option>
                  <option value="7+">Более 7 дней</option>
                </select>
              </div>
              
              {/* Цена */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Цена (USD)</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option value="">Любая цена</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="100-300">$100 - $300</option>
                  <option value="300-500">$300 - $500</option>
                  <option value="500+">$500+</option>
                </select>
              </div>
              
              {/* Уровень сложности */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Сложность</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option value="">Любая</option>
                  <option value="easy">Легкая</option>
                  <option value="medium">Средняя</option>
                  <option value="hard">Сложная</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold">
                Применить фильтры
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Категории туров */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Категории туров</h2>
            <a href="#" className="text-blue-600 hover:underline font-medium">Смотреть все &gt;</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category, index) => (
              <div 
                key={category.id} 
                className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className={`w-full h-48 bg-gradient-to-br ${
                    index === 0 ? 'from-blue-400 to-blue-600' :
                    index === 1 ? 'from-green-400 to-green-600' :
                    index === 2 ? 'from-orange-400 to-orange-600' :
                    index === 3 ? 'from-purple-400 to-purple-600' :
                    index === 4 ? 'from-cyan-400 to-cyan-600' :
                    'from-red-400 to-red-600'
                  }`}></div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-bold text-xl">{category.name}</h3>
                    <p className="text-white text-sm opacity-90">{category.count} туров</p>
                  </div>
                  <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.count} доступных туров
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Гибкость планирования */}
      <section className="py-20 bg-green-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Планируйте гибко
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Используйте функцию "Забронировать сейчас и оплатить позже", чтобы забронировать активности без предварительной оплаты.
          </p>
        </div>
      </section>

      {/* Рекомендуемые туры */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Рекомендуемые туры по Таджикистану
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Полный день: Памирское шоссе, горы и озёра", price: "$120", rating: "4.8", reviews: "(234)", location: "Памирские горы, Таджикистан" },
              { title: "Культурный тур по Душанбе с посещением музеев", price: "$65", rating: "4.6", reviews: "(187)", location: "Душанбе, Таджикистан" },
              { title: "Треккинг к озеру Искандеркуль", price: "$95", rating: "4.9", reviews: "(412)", location: "Фанские горы, Таджикистан" },
              { title: "Шёлковый путь: древние города и крепости", price: "$150", rating: "4.7", reviews: "(298)", location: "Северный Таджикистан" }
            ].map((tour, index) => (
              <div key={index} className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
                <div className="relative overflow-hidden rounded-t-lg">
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
                <div className="p-4">
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                    {tour.title}
                  </h3>
                  <div className="text-lg font-bold">от {tour.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Популярные направления */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Популярные направления
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              "Душанбе", "Памир", "Искандеркуль", "Худжанд", "Хорог",
              "Мургаб", "Пенджикент", "Куляб", "Фанские горы", "Вахан"
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

      {/* Бесплатная отмена */}
      <section className="py-20 bg-green-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Бесплатная отмена
          </h2>
          <p className="text-lg text-gray-600">
            Получите полный возврат средств, если отмените бронирование за 24 часа до начала тура.
          </p>
        </div>
      </section>

      {/* Раскрывающиеся кнопки */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: 'special', title: 'Особые отметки' },
              { id: 'payment', title: 'Правила оплаты и возврата средств' },
              { id: 'privacy', title: 'Политика конфиденциальности' },
              { id: 'button4', title: '' }
            ].map((button, index) => (
              <div key={button.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === button.id ? null : button.id)}
                  className={`w-full p-4 text-left bg-orange-400 hover:bg-orange-500 text-white font-semibold flex justify-between items-center ${
                    activeAccordion === button.id ? 'bg-orange-500' : ''
                  }`}
                >
                  <span>{button.title || `Кнопка ${index + 1}`}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      activeAccordion === button.id ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeAccordion === button.id && (
                  <div className="p-4 bg-white border-t">
                    <div className="text-gray-600">
                      {button.id === 'special' && (
                        <div>
                          <p className="mb-2">• Все туры проводятся с лицензированными гидами</p>
                          <p className="mb-2">• Групповые туры до 15 человек для лучшего опыта</p>
                          <p>• Включена страховка для всех участников</p>
                        </div>
                      )}
                      {button.id === 'payment' && (
                        <div>
                          <p className="mb-2">• Полная оплата при бронировании</p>
                          <p className="mb-2">• Возврат 100% за 24+ часа до тура</p>
                          <p>• Частичный возврат за 12-24 часа до тура</p>
                        </div>
                      )}
                      {button.id === 'privacy' && (
                        <div>
                          <p className="mb-2">• Мы защищаем ваши персональные данные</p>
                          <p className="mb-2">• Информация используется только для бронирования</p>
                          <p>• Данные не передаются третьим лицам</p>
                        </div>
                      )}
                      {button.id === 'button4' && (
                        <p>Содержимое будет добавлено позже.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Отзывы клиентов */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Отлично</div>
              <div className="flex justify-center mb-2">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm text-gray-500">Основано на 1,247 отзывах</div>
              <div className="mt-4">
                <div className="text-green-600 font-bold text-lg">Tajik Trails</div>
              </div>
            </div>
            
            {[
              { time: "2 часа назад", text: "Отличный сервис", detail: "Быстрая организация тура, отличный гид и потрясающие виды в горах.", author: "Алексей Морозов" },
              { time: "1 день назад", text: "Хороший выбор туров", detail: "Много интересных маршрутов по Таджикистану.", author: "Мария Петрова" },
              { time: "3 дня назад", text: "Незабываемые впечатления", detail: "Памирское шоссе - это что-то невероятное! Организация на высшем уровне.", author: "Дмитрий Козлов" }
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

      {/* Футер */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Компания */}
            <div>
              <h3 className="text-white font-semibold mb-4">Компания:</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">О нас</a></li>
                <li><a href="#" className="hover:text-white">Тур-агентам</a></li>
                <li><a href="#" className="hover:text-white">Партнёры</a></li>
                <li><a href="#" className="hover:text-white">Инвестиционные Проекты</a></li>
                <li><a href="#" className="hover:text-white">Как бронировать туры?</a></li>
                <li><a href="#" className="hover:text-white">Каталог туров</a></li>
                <li><a href="#" className="hover:text-white">Календарь групповых туров</a></li>
              </ul>
            </div>

            {/* Социальные страницы */}
            <div>
              <h3 className="text-white font-semibold mb-4">Социальные страницы:</h3>
              <div className="flex space-x-3 mb-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.6 21c-.1.1-.2.2-.3.2-.1.1-.3.1-.4.1s-.3 0-.4-.1c-.1-.1-.2-.1-.3-.2L1.2 9.9c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0L12 19.5l10.1-10.3c.2-.2.5-.2.7 0 .2.2.2.5 0 .7L13.6 21z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.433-2.177 4.72-1.286 1.29-2.844 2.069-4.67 2.353-.436.068-.875.103-1.309.103-.295 0-.586-.014-.875-.042-.936-.091-1.85-.3-2.732-.627-.3-.111-.592-.238-.875-.38-.3-.152-.592-.32-.873-.506-.565-.374-1.098-.802-1.59-1.286-.246-.242-.48-.497-.702-.763-.11-.132-.217-.267-.318-.406-.202-.278-.39-.567-.562-.87-.172-.303-.33-.617-.473-.943-.286-.651-.49-1.336-.606-2.049-.058-.357-.088-.72-.088-1.087 0-.413.034-.822.103-1.226.137-1.821.867-3.415 2.177-4.746 1.31-1.33 2.89-2.069 4.746-2.177.404-.023.813-.035 1.226-.035.367 0 .73.012 1.087.035.713.046 1.398.177 2.049.39.326.107.64.232.943.377.303.145.594.307.87.495.139.094.274.194.406.301.266.215.521.446.763.692.484.492.912 1.025 1.286 1.59.187.281.355.573.506.873.142.283.269.575.38.875.222.6.375 1.229.453 1.883.039.327.058.659.058.994 0 .367-.012.73-.035 1.087-.046.713-.144 1.398-.32 2.049z"/>
                  </svg>
                </a>
              </div>
              <div className="text-sm text-gray-400">
                <p>Лицензия на туристической</p>
                <p>деятельности ГД МТД РТ № 053, от</p>
                <p>25.10.2022 г.</p>
              </div>
            </div>

            {/* Контакты */}
            <div>
              <h3 className="text-white font-semibold mb-4">Контакты:</h3>
              <div className="space-y-1 text-sm text-gray-300">
                <p>+992 44-625-7575; +992 93-126-1134</p>
                <p>+992 00-110-0087; +992 88-235-3434</p>
                <p>info@bunyodtourtj</p>
                <p>Публичная Оферта-Договор</p>
                <p>Правила оплаты и возврата</p>
                <p>средств</p>
                <p>Политика конфиденциальности</p>
              </div>
            </div>


          </div>
          
          {/* Нижняя строка */}
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-xs text-gray-400">
            <p>Все права защищены | ООО "Буньод-Тур" (2017-2025) | ИНН: 01009373У; ОГРН: 011002137</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
