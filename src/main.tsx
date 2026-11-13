import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '@fontsource-variable/geist-mono';
import '@fontsource/silkscreen/700.css';
import './styles/app.css';
import './styles/wallets.css';
import './styles/brand.css';
import { router } from './routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
