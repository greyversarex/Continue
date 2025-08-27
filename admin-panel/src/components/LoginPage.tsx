import React from 'react';
import { Login, LoginForm } from 'react-admin';
import { Box, Card, CardContent, Typography } from '@mui/material';

const CustomLoginForm = () => (
  <Card sx={{ minWidth: 300, marginTop: 8 }}>
    <Box
      sx={{
        margin: '1em',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h4" color="primary">
        Bunyod-Tour Admin
      </Typography>
    </Box>
    <CardContent>
      <LoginForm />
    </CardContent>
  </Card>
);

const LoginPage = () => (
  <Login
    sx={{
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}
  >
    <CustomLoginForm />
  </Login>
);

export default LoginPage;