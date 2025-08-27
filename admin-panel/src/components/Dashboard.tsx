import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Title, useGetList } from 'react-admin';

export default function Dashboard() {
  const { data: tours, total: toursTotal } = useGetList('tours', {
    pagination: { page: 1, perPage: 1 },
    sort: { field: 'id', order: 'ASC' },
    filter: {},
  });

  const { data: bookings, total: bookingsTotal } = useGetList('bookings', {
    pagination: { page: 1, perPage: 1 },
    sort: { field: 'id', order: 'ASC' },
    filter: {},
  });

  const { data: users, total: usersTotal } = useGetList('users', {
    pagination: { page: 1, perPage: 1 },
    sort: { field: 'id', order: 'ASC' },
    filter: {},
  });

  const { data: promotions, total: promotionsTotal } = useGetList('promotions', {
    pagination: { page: 1, perPage: 1 },
    sort: { field: 'id', order: 'ASC' },
    filter: {},
  });

  return (
    <div>
      <Title title="Dashboard" />
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardHeader title="Tours" />
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3f51b5' }}>
              {toursTotal || 0}
            </div>
            <div>Total Tours</div>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardHeader title="Bookings" />
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>
              {bookingsTotal || 0}
            </div>
            <div>Total Bookings</div>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardHeader title="Users" />
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800' }}>
              {usersTotal || 0}
            </div>
            <div>Total Users</div>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardHeader title="Promotions" />
          <CardContent>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f44336' }}>
              {promotionsTotal || 0}
            </div>
            <div>Active Promotions</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}