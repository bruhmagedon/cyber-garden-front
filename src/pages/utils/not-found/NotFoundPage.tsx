'use client';

import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button/Button';
import { Rocket, Moon } from 'lucide-react';
import { StarsBackground } from '@/shared/ui/backgrounds/stars';

const NotFoundPageAsync = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0A0B10] text-white">
      <StarsBackground 
        className="absolute inset-0 z-0 bg-transparent"
        starColor="#fff"
        speed={100}
        factor={0.02}
      >
          {/* We can put the gradient overlay inside or keep it separate if StarsBackground supports children correctly. 
             Looking at StarsBackground source: it renders children at the end. 
             But it has its own background color. We might want to override className to remove default bg if we want our custom gradient, 
             OR use its default and just add our decorative elements. 
             The StarsBackground has `bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]`.
             Let's try to use it as is first, or override if needed. 
             The user asked to use the component, so let's leverage it.
          */}
        
        {/* --- Decorative Elements --- */}
        <div className="pointer-events-none absolute right-[15%] top-[15%] z-0 text-slate-700 opacity-20 blur-[1px] animate-float">
            <Moon size={120} strokeWidth={1} />
        </div>

        <div className="pointer-events-none absolute left-[10%] bottom-[20%] z-0 text-indigo-900 opacity-30 blur-[40px] delay-1000 animate-float">
            <div className="h-64 w-64 rounded-full bg-indigo-600/30" />
        </div>
      </StarsBackground>

      {/* --- Content --- */}
      {/* Needs to be z-10 to be above stars if they are z-0, but StarsBackground wraps everything. 
          Actually StarsBackground places children *after* stars motion div. 
          So children are on top by default in DOM order. 
          However, we put the whole StarsBackground as a wrapper. 
          Wait, StarsBackground is a full size div. 
          So we should wrap the Content in it too.
      */}
      
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
        <div className="relative z-10 flex flex-col items-center text-center pointer-events-auto p-4">
            {/* Glitchy 404 Text */}
            <div className="relative mb-4">
            <h1 className="text-[150px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] md:text-[200px]">
                404
            </h1>
            <div className="absolute left-0 top-0 -z-10 text-[150px] font-black leading-none tracking-tighter text-blue-500/20 blur-sm md:text-[200px] animate-pulse">404</div>
            </div>

            <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-200 md:text-4xl">
            Houston, we have a problem.
            </h2>
            
            <p className="mb-10 max-w-md text-slate-400">
            Страница, которую вы ищете, затерялась в открытом космосе или была уничтожена черной дырой.
            </p>

            <div className="flex gap-4">
            <Button 
                variant="primary" 
                size="lg" 
                className="group relative overflow-hidden bg-white text-black hover:bg-slate-200 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                onClick={() => navigate('/')}
            >
                <Rocket className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                Вернуться на базу
            </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPageAsync;
