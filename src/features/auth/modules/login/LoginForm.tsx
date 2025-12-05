import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/features/auth/model/api';
import { Button, Input, Label } from '@/shared/ui';
import type { LoginFormValues } from '../../model/form/login-form.control';
import { useLoginForm } from '../../model/hooks';
import { AuthCard } from '../../ui/AuthCard';
import { AuthFormWrapper } from '../../ui/AuthFormWrapper';
import { AuthHeader } from '../../ui/AuthHeader';
import { AuthNavLink } from '../../ui/AuthNavLink';
import { FormError } from '../../ui/FormError';
import { PasswordInput } from '../../ui/PasswordInput';

export const LoginForm = () => {
  const { register, handleSubmit, errors, reset } = useLoginForm();
  const { login, isPending, isSuccess, isError, errorMessage } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      reset();
      navigate('/', { replace: true });
    }
  }, [isSuccess, navigate, reset]);

  const onSubmit = (data: LoginFormValues) => {
    login(data.email, data.password);
  };

  const handleForgotPassword = () => {
    navigate('/auth/forgot-password');
  };

  const handleRegister = () => {
    navigate('/auth/register');
  };

  return (
    <AuthCard>
      <AuthHeader />

      <AuthFormWrapper>
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col gap-3">
            <Label className="flex-1">Введите почту</Label>
            <Input type="email" {...register('email')} placeholder="example@mail.com" />
            <FormError message={errors.email?.message} />
          </div>

          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="flex-1">Введите пароль</Label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="cursor-pointer text-primary text-sm leading-tight hover:underline"
              >
                Забыли пароль?
              </button>
            </div>
            <PasswordInput {...register('password')} placeholder="Введите пароль" />
            <FormError message={errors.password?.message} />
          </div>
        </div>

        {isError && errorMessage && (
          <p className="text-center font-inter text-danger text-sm">{errorMessage}</p>
        )}

        <div className="flex w-full flex-col items-center gap-5">
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            Войти
          </Button>

          <AuthNavLink text="Нет аккаунта?" linkText="Зарегистрироваться" onClick={handleRegister} />
        </div>
      </AuthFormWrapper>
    </AuthCard>
  );
};
