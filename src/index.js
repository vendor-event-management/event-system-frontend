import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

import { Provider } from 'react-redux';
import { store } from './state/store';

// Create the theme
const theme = createTheme({
  typography: {
    fontFamily: 'Open Sans, sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
