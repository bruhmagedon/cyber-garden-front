import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Label } from '@/shared/ui';
import { useResetPassword } from '../../model/api';
import type { ResetPasswordFormValues } from '../../model/form/reset-password-form.control';
import { useResetPasswordForm } from '../../model/hooks';
import { usePasswordRecoveryStore } from '../../model/store/passwordRecoveryStore';
import { AuthCard } from '../../ui/AuthCard';
import { AuthFormWrapper } from '../../ui/AuthFormWrapper';
import { AuthHeader } from '../../ui/AuthHeader';
import { AuthNavLink } from '../../ui/AuthNavLink';
import { BackButton } from '../../ui/BackButton';
import { FormError } from '../../ui/FormError';
import { PasswordInput } from '../../ui/PasswordInput';
import { PasswordValidator } from './PasswordValidator';

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { register, handleSubmit, watch, errors, reset } = useResetPasswordForm();
  const email = usePasswordRecoveryStore((state) => state.email);
  const token = usePasswordRecoveryStore((state) => state.token);
  const clearData = usePasswordRecoveryStore((state) => state.clearData);
  const { resetPassword, isPending, isSuccess, isError, errorMessage } = useResetPassword();

  const newPassword = watch('newPassword');

  // Redirect to login on success
  useEffect(() => {
    if (isSuccess) {
      reset();
      clearData();
      navigate('/auth/login');
    }
  }, [isSuccess, navigate, clearData, reset]);

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (email && token) {
      resetPassword({
        token,
        email,
        new_password: data.newPassword,
      });
    }
  };

  const handleRegister = () => {
    navigate('/auth/register');
  };

  const handleBack = () => {
    navigate('/auth/verify-code');
  };

  return (
    <AuthCard maxWidth="lg">
      <AuthHeader />

      <AuthFormWrapper>
        <div className="flex w-full flex-col items-start gap-3">
          <BackButton onClick={handleBack} />
          <div className="font-inter font-semibold text-2xl text-text-quaternary leading-7 sm:text-3xl sm:leading-9">
            Создание нового пароля
          </div>
        </div>

        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full flex-col gap-3">
              <Label className="flex-1">Введите новый пароль</Label>
              <div className="relative flex w-full items-center">
                {passwordFocused && newPassword && <PasswordValidator password={newPassword} />}
                <PasswordInput
                  {...register('newPassword')}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Введите пароль"
                  className="text-text-secondary placeholder:text-text-secondary"
                />
              </div>
              <FormError message={errors.newPassword?.message} />
            </div>

            <div className="flex w-full flex-col gap-3">
              <Label className="py-0.5 text-text-primary">Подтвердите новый пароль</Label>
              <PasswordInput
                {...register('confirmPassword')}
                placeholder="Введите пароль"
                className="text-text-secondary placeholder:text-text-secondary"
              />
              <FormError message={errors.confirmPassword?.message} />
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
              className="w-full text-base"
              disabled={isPending}
            >
              {isPending ? 'Сохранение...' : 'Применить'}
            </Button>

            <AuthNavLink text="Нет аккаунта?" linkText="Зарегистрироваться" onClick={handleRegister} />
          </div>
        </div>
      </AuthFormWrapper>
    </AuthCard>
  );
};
