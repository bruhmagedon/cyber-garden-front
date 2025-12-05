import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Label } from '@/shared/ui';
import { usePasswordRecovery } from '../../model/api';
import type { ForgotPasswordFormValues } from '../../model/form/forgot-password-form.control';
import { useForgotPasswordForm } from '../../model/hooks';
import { usePasswordRecoveryStore } from '../../model/store/passwordRecoveryStore';
import { AuthCard } from '../../ui/AuthCard';
import { AuthFormWrapper } from '../../ui/AuthFormWrapper';
import { AuthHeader } from '../../ui/AuthHeader';
import { AuthNavLink } from '../../ui/AuthNavLink';
import { BackButton } from '../../ui/BackButton';
import { FormError } from '../../ui/FormError';

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, errors, getValues, reset } = useForgotPasswordForm();
  const { sendRecoveryCode, isPending, isSuccess, isError, errorMessage } = usePasswordRecovery();
  const setEmail = usePasswordRecoveryStore((state) => state.setEmail);

  const onSubmit = (data: ForgotPasswordFormValues) => {
    sendRecoveryCode(data.email);
  };

  // Navigate to verify code form and save email on success
  useEffect(() => {
    if (isSuccess) {
      const email = getValues('email');
      setEmail(email);
      reset();
      navigate('/auth/verify-code');
    }
  }, [isSuccess, navigate, getValues, setEmail, reset]);

  const handleBack = () => {
    navigate('/auth/login');
  };

  const handleRegister = () => {
    navigate('/auth/register');
  };

  return (
    <AuthCard>
      <AuthHeader />

      <AuthFormWrapper gap="sm">
        <div className="flex w-full flex-col items-start justify-center gap-3">
          <BackButton onClick={handleBack} />
          <div className="font-inter font-semibold text-3xl text-text-quaternary leading-loose">
            Восстановление пароля
          </div>
        </div>

        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full flex-col gap-3">
              <Label className="py-0.5">Корпоративная почта</Label>
              <Input type="email" {...register('email')} placeholder="example@mail.com" />
              <FormError message={errors.email?.message} />
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
              {isPending ? 'Отправка...' : 'Отправить код'}
            </Button>

            <AuthNavLink text="Нет аккаунта?" linkText="Зарегистрироваться" onClick={handleRegister} />
          </div>
        </div>
      </AuthFormWrapper>
    </AuthCard>
  );
};
