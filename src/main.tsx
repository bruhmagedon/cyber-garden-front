import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { appRouter } from './app/providers/router/AppRouter.tsx';

import '@/app/styles/index.css';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <RouterProvider
         router={appRouter}
         future={{
            v7_startTransition: true,
         }}
      />
   </StrictMode>,
);
