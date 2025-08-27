import React from 'react';
import { Admin, Resource } from 'react-admin';
import { authProvider } from './providers/authProvider';
import { dataProvider } from './providers/dataProvider';
import { i18nProvider } from './i18n/i18nProvider';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { ToursResource } from './resources/tours';
import { BookingsResource } from './resources/bookings';
import { UsersResource } from './resources/users';
import { PromotionsResource } from './resources/promotions';

function App() {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      loginPage={LoginPage}
      dashboard={Dashboard}
      title="Bunyod-Tour Admin"
    >
      <Resource name="tours" {...ToursResource} />
      <Resource name="bookings" {...BookingsResource} />
      <Resource name="users" {...UsersResource} />
      <Resource name="promotions" {...PromotionsResource} />
    </Admin>
  );
}

export default App;