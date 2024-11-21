import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Title } from '@/shared/ui/title';

import { useLogin } from '../model/api/LoginApi';

const formSchema = z.object({
   username: z.string().min(2).max(50),
   password: z.string().min(2, { message: 'Пароль должен быть не менее 8 символов' }).max(50),
});

export function AuthModal() {
   const [open, setOpen] = useState(false);
   const { mutate: login } = useLogin();
   const [error, setError] = useState<string | null>(null);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         username: '',
         password: '',
      },
   });

   const onSubmit = (values: z.infer<typeof formSchema>) => {
      login(
         { username: values.username, password: values.password },
         {
            onSuccess: (data) => {
               localStorage.setItem('token', data.access);
               setOpen(false);
            },
            onError: () => {
               setError('Ошибка при входе');
               setOpen(true);
            },
         },
      );
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button size={'small'} variant={'secondary'} className='flex gap-[10px]'>
               Авторизоваться
            </Button>
         </DialogTrigger>

         <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
               <DialogTitle>Авторизация</DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                  <FormField
                     control={form.control}
                     name='username'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Логин</FormLabel>
                           <FormControl>
                              <Input placeholder='Введите логин' {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name='password'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Пароль</FormLabel>
                           <FormControl>
                              <Input placeholder='Введите пароль' {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  {error && <Title text={error} className='text-red-500' />}
                  <Button type='submit'>Авторизоваться</Button>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
