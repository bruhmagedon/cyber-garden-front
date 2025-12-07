import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '@/features/auth/model/api';
import { PasswordValidator } from '@/features/auth/ui/PasswordValidator';
import { Button, Input, Label } from '@/shared/ui';
import type { RegisterFormValues } from '../../model/form/register-form.control';
import { useRegisterForm } from '../../model/hooks';
import { AuthCard } from '../../ui/AuthCard';
import { AuthFormWrapper } from '../../ui/AuthFormWrapper';
import { AuthHeader } from '../../ui/AuthHeader';
import { AuthNavLink } from '../../ui/AuthNavLink';
import { FormError } from '../../ui/FormError';
import { PasswordInput } from '../../ui/PasswordInput';

export const RegisterForm = () => {
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { register, handleSubmit, watch, errors, reset } = useRegisterForm();
  const { register: registerUser, isPending, isSuccess } = useRegister();
  const password = watch('password');
  const navigate = useNavigate();

  // Редирект на главную после успешной регистрации
  useEffect(() => {
    if (isSuccess) {
      reset();
      navigate('/', { replace: true });
    }
  }, [isSuccess, navigate, reset]);

  // Сброс формы при размонтировании
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const onSubmit = (data: RegisterFormValues) => {
    registerUser({
      name: data.fullName,
      email: data.email,
      password: data.password,
    });
  };

  const handleLogin = () => {
    navigate('/auth/login');
  };

  return (
    <AuthCard>
      <AuthFormWrapper>
        <div className="flex w-full flex-col gap-5">
          <div className="flex w-full flex-col gap-3">
            <Label className="flex-1">Введите имя и фамилию</Label>
            <Input type="text" {...register('fullName')} placeholder="Имя Фамилия" />
            <FormError message={errors.fullName?.message} />
          </div>

          <div className="flex w-full flex-col gap-3">
            <Label className="flex-1">Введите почту</Label>
            <Input type="email" {...register('email')} placeholder="example@mail.com" />
            <FormError message={errors.email?.message} />
          </div>

          <div className="flex w-full flex-col gap-3">
            <Label className="flex-1">Придумайте пароль</Label>
            <div className="relative flex w-full items-center">
              <PasswordInput
                {...register('password')}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="Введите пароль"
              />
            </div>
            <FormError message={errors.password?.message} />
          </div>
          <div className="flex w-full flex-col gap-3">
            <Label className="py-0.5 text-text-primary">Подтвердите пароль</Label>
            <PasswordInput {...register('confirmPassword')} placeholder="Введите пароль" />
            <FormError message={errors.confirmPassword?.message} />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-5">
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="primary"
            size="lg"
            className="group relative w-full overflow-hidden bg-gradient-to-r from-primary to-violet-600 shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95 border-0 hover:bg-none"
            disabled={isPending}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:animate-shimmer" />
            <span className="relative z-10">Зарегистрироваться</span>
          </Button>
          <AuthNavLink text="Есть аккаунт?" linkText="Войти" onClick={handleLogin} />
        </div>
      </AuthFormWrapper>
    </AuthCard>
  );
};
