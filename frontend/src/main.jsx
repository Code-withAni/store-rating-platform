import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '0.875rem',
            fontWeight: '500',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
          },
          success: {
            iconTheme: {
              primary: '#059669',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: 'white',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
