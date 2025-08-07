import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      common: {
        loading: "Loading...",
        error: "Error",
        tryAgain: "Try Again",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        create: "Create",
        update: "Update",
        refresh: "Refresh",
        submit: "Submit",
        back: "Back",
        next: "Next",
        previous: "Previous",
        close: "Close",
        required: "Required",
        optional: "Optional"
      },
      navigation: {
        home: "Home",
        tours: "Tours",
        admin: "Admin",
        dashboard: "Dashboard"
      },
      header: {
        title: "Tajik Trails",
        subtitle: "Discover the Beauty of Tajikistan"
      },
      home: {
        heroTitle: "Explore Magnificent Tajikistan",
        heroDescription: "Discover breathtaking mountains, ancient Silk Road cities, and warm hospitality in the heart of Central Asia. Join us for unforgettable adventures in Tajikistan.",
        exploreTours: "Explore Our Tours",
        whyChooseUs: "Why Choose Tajik Trails?",
        expertGuides: {
          title: "Expert Local Guides",
          description: "Our experienced guides know every trail and story of the magnificent Pamir Mountains."
        },
        safetyFirst: {
          title: "Safety First",
          description: "All our tours are carefully planned with safety equipment and emergency protocols."
        },
        authenticExperiences: {
          title: "Authentic Experiences",
          description: "Experience genuine Tajik culture, cuisine, and traditions with local families."
        },
        readyForAdventure: "Ready for Your Adventure?",
        readyDescription: "Browse our carefully curated tours and start planning your journey to Tajikistan today.",
        viewAllTours: "View All Tours"
      },
      tours: {
        title: "Our Tours",
        description: "Discover amazing adventures across Tajikistan. From mountain trekking to cultural experiences.",
        allTours: "All Tours",
        noToursInCategory: "No tours found in this category",
        noTours: "No tours available",
        viewDetails: "View Details",
        duration: "Duration",
        price: "Price",
        perPerson: "per person",
        category: "Category",
        backToTours: "Back to Tours"
      },
      languages: {
        english: "English",
        russian: "Русский",
        tajik: "Тоҷикӣ"
      }
    }
  },
  ru: {
    translation: {
      common: {
        loading: "Загрузка...",
        error: "Ошибка",
        tryAgain: "Попробовать снова",
        cancel: "Отмена",
        save: "Сохранить",
        delete: "Удалить",
        edit: "Редактировать",
        create: "Создать",
        update: "Обновить",
        refresh: "Обновить",
        submit: "Отправить",
        back: "Назад",
        next: "Далее",
        previous: "Предыдущий",
        close: "Закрыть",
        required: "Обязательно",
        optional: "Необязательно"
      },
      navigation: {
        home: "Главная",
        tours: "Туры",
        admin: "Админ",
        dashboard: "Панель управления"
      },
      header: {
        title: "Таджик Трейлс",
        subtitle: "Откройте красоту Таджикистана"
      },
      home: {
        heroTitle: "Исследуйте великолепный Таджикистан",
        heroDescription: "Откройте для себя захватывающие дух горы, древние города Шелкового пути и теплое гостеприимство в самом сердце Центральной Азии. Присоединяйтесь к нам в незабываемых приключениях в Таджикистане.",
        exploreTours: "Изучить наши туры",
        whyChooseUs: "Почему выбирают Таджик Трейлс?",
        expertGuides: {
          title: "Опытные местные гиды",
          description: "Наши опытные гиды знают каждую тропу и историю величественных Памирских гор."
        },
        safetyFirst: {
          title: "Безопасность прежде всего",
          description: "Все наши туры тщательно спланированы с использованием оборудования безопасности и протоколов экстренных ситуаций."
        },
        authenticExperiences: {
          title: "Аутентичный опыт",
          description: "Познакомьтесь с подлинной таджикской культурой, кухней и традициями с местными семьями."
        },
        readyForAdventure: "Готовы к приключению?",
        readyDescription: "Просмотрите наши тщательно отобранные туры и начните планировать свое путешествие в Таджикистан уже сегодня.",
        viewAllTours: "Посмотреть все туры"
      },
      tours: {
        title: "Наши туры",
        description: "Откройте для себя удивительные приключения по всему Таджикистану. От горного треккинга до культурных впечатлений.",
        allTours: "Все туры",
        noToursInCategory: "В этой категории туров не найдено",
        noTours: "Нет доступных туров",
        viewDetails: "Подробнее",
        duration: "Продолжительность",
        price: "Цена",
        perPerson: "за человека",
        category: "Категория",
        backToTours: "Вернуться к турам"
      },
      languages: {
        english: "English",
        russian: "Русский",
        tajik: "Тоҷикӣ"
      }
    }
  },
  tj: {
    translation: {
      common: {
        loading: "Бор шуда истодааст...",
        error: "Хато",
        tryAgain: "Аз нав кӯшиш кунед",
        cancel: "Бекор кардан",
        save: "Захира кардан",
        delete: "Нест кардан",
        edit: "Таҳрир кардан",
        create: "Офаридан",
        update: "Навсозӣ кардан",
        refresh: "Навсозӣ кардан",
        submit: "Ирсол кардан",
        back: "Бозгашт",
        next: "Минбаъда",
        previous: "Қаблӣ",
        close: "Пӯшидан",
        required: "Лозимӣ",
        optional: "Ихтиёрӣ"
      },
      navigation: {
        home: "Хона",
        tours: "Сафарҳо",
        admin: "Маъмур",
        dashboard: "Лавҳаи идора"
      },
      header: {
        title: "Тоҷик Трейлс",
        subtitle: "Зебоии Тоҷикистонро кашф кунед"
      },
      home: {
        heroTitle: "Тоҷикистони олишонро омӯзед",
        heroDescription: "Кӯҳҳои нафасгир, шаҳрҳои қадимаи Роҳи Абрешимӣ ва меҳмоннавозии гармро дар марками Осиёи Марказӣ кашф кунед. Дар саргузаштҳои фаромӯшнашавандаи Тоҷикистон ба мо ҳамроҳ шавед.",
        exploreTours: "Сафарҳои моро омӯзед",
        whyChooseUs: "Чаро Тоҷик Трейлсро интихоб кунед?",
        expertGuides: {
          title: "Роҳнамоҳои мутахассиси маҳаллӣ",
          description: "Роҳнамоҳои ботаҷрибаи мо ҳар роҳ ва достони кӯҳҳои олии Помирро медонанд."
        },
        safetyFirst: {
          title: "Аввал бехатарӣ",
          description: "Ҳама сафарҳои мо бо таҷҳизоти бехатарӣ ва протоколҳои фавриявӣ ба таври диққат нақшарезӣ шудаанд."
        },
        authenticExperiences: {
          title: "Таҷрибаҳои ҳақиқӣ",
          description: "Фарҳанг, хӯрокҳо ва анъанаҳои ҳақиқии тоҷикро бо оилаҳои маҳаллӣ таҷриба кунед."
        },
        readyForAdventure: "Барои саргузашт омодаед?",
        readyDescription: "Сафарҳои мо бо диққат интихобшударо баррасӣ кунед ва ҳоло сафари худро ба Тоҷикистон нақшарезӣ оғоз кунед.",
        viewAllTours: "Ҳамаи сафарҳоро дидан"
      },
      tours: {
        title: "Сафарҳои мо",
        description: "Саргузаштҳои аҷоибро дар саросари Тоҷикистон кашф кунед. Аз кӯҳнавардӣ то таҷрибаҳои фарҳангӣ.",
        allTours: "Ҳамаи сафарҳо",
        noToursInCategory: "Дар ин категория ҳеҷ сафар ёфт нашуд",
        noTours: "Ҳеҷ сафар дастрас нест",
        viewDetails: "Тафсилотро дидан",
        duration: "Давомнокӣ",
        price: "Нарх",
        perPerson: "барои як шахс",
        category: "Категория",
        backToTours: "Ба сафарҳо баргаштан"
      },
      languages: {
        english: "English",
        russian: "Русский",
        tajik: "Тоҷикӣ"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Configure language detection
    lng: 'en', // default language
  });

export default i18n;