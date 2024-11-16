import { Link } from 'react-router-dom';

import { Container } from '@/components/Container/Container';
import { SeachInput } from '@/components/SearchInput.tsx/SeachInput';
import { cn } from '@/utils/lib/utils';
import { Button } from '@/shared/ui/button';

interface HeaderProps {
   className?: string;
}

export const Header = ({ className }: HeaderProps) => {
   return (
      <header className={cn('h-[var(--header-height)]', className)}>
         <Container className='flex h-full border border-border bg-background-secondary'>
            <Link to='/' className='flex items-center gap-[10px] border-r border-border px-6 py-5'>
               <span className='text-2xl'>
                  <strong>bigas</strong> <span className='font-light'>production</span>
               </span>
            </Link>
            <div className='flex flex-1 items-center justify-between py-5 pl-6 pr-7'>
               <SeachInput className='flex-1' />
               <div className='flex items-center gap-2'>
                  <Button size={'small'} className='flex gap-[10px]'>
                     <p>Кнопка обычная</p>
                  </Button>
                  <Button size={'small'} variant={'secondary'} className='flex gap-[10px]'>
                     <p>Кнопка другая</p>
                  </Button>
                  {/* <ModeToggle /> */}
               </div>
            </div>
         </Container>
      </header>
   );
};
