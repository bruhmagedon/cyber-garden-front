import { Outlet } from 'react-router-dom';

import { Footer } from '@/widgets/Footer';
import { Header } from '@/widgets/Header';

const BaseLayout = () => {
   return (
      <div className='h-screen bg-background'>
         <Header />
         <div>
            <div>
               <Outlet />
            </div>
            <Footer />
         </div>
      </div>
   );
};

export default BaseLayout;
