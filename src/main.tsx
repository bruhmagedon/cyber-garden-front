import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { appRouter } from './app/providers/router/AppRouter.tsx';
import { queryClient } from './shared/api/query-client.ts';

import '@/app/styles/index.css';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
         <RouterProvider
            router={appRouter}
            future={{
               v7_startTransition: true,
            }}
         />
      </QueryClientProvider>
   </StrictMode>,
);
