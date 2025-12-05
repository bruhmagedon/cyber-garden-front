import { Button, InputOTP, InputOTPGroup, InputOTPSlot, Label } from '@/shared/ui';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePasswordRecovery, useVerifyRecoveryCode } from '../../model/api';
import { usePasswordRecoveryStore } from '../../model/store/passwordRecoveryStore';
import { AuthCard } from '../../ui/AuthCard';
import { AuthFormWrapper } from '../../ui/AuthFormWrapper';
import { AuthHeader } from '../../ui/AuthHeader';
import { AuthNavLink } from '../../ui/AuthNavLink';
import { BackButton } from '../../ui/BackButton';

export const VerifyCodeForm = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const email = usePasswordRecoveryStore((state) => state.email);
  const setToken = usePasswordRecoveryStore((state) => state.setToken);
  const { verifyCode, isPending, isSuccess, isError, errorMessage, data } = useVerifyRecoveryCode();
  const { sendRecoveryCode, isPending: isResending } = usePasswordRecovery();

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Save token and navigate to reset password on success
  useEffect(() => {
    if (isSuccess && data) {
      const token = (data as any)?.token;
      if (token) {
        setToken(token);
        setCode('');
        navigate('/auth/reset-password');
      }
    }
  }, [isSuccess, data, setToken, navigate]);

  // Redirect to forgot password if no email
  useEffect(() => {
    if (!email) {
      navigate('/auth/forgot-password');
    }
  }, [email, navigate]);

  const handleVerifyCode = () => {
    if (code.length === 6 && email) {
      verifyCode({ email, code });
    }
  };

  const handleBack = () => {
    navigate('/auth/forgot-password');
  };

  const handleRegister = () => {
    navigate('/auth/register');
  };

  const handleResend = () => {
    if (email) {
      sendRecoveryCode(email);
      setTimeLeft(60);
      setCode('');
    }
  };

  return (
    <AuthCard>
      <AuthHeader />

      <AuthFormWrapper gap="sm">
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full flex-col items-start justify-center gap-3 sm:w-96">
            <BackButton onClick={handleBack} />
            <div className="font-inter font-semibold text-2xl text-text-quaternary leading-7 sm:text-3xl sm:leading-loose">
              Введите код
            </div>
          </div>

          <div className="font-inter font-medium text-sm text-text-primary leading-tight">
            На вашу почту втечении минуты придет код введите его ниже
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Label className="py-0.5">Код</Label>

          <div className="flex w-full justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className={isError ? 'border-danger' : ''} />
                <InputOTPSlot index={1} className={isError ? 'border-danger' : ''} />
                <InputOTPSlot index={2} className={isError ? 'border-danger' : ''} />
                <InputOTPSlot index={3} className={isError ? 'border-danger' : ''} />
                <InputOTPSlot index={4} className={isError ? 'border-danger' : ''} />
                <InputOTPSlot index={5} className={isError ? 'border-danger' : ''} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {isError && errorMessage && (
            <p className="text-center font-inter text-danger text-xs">{errorMessage}</p>
          )}

          <div className="text-center font-inter font-normal text-text-primary text-xs">
            {timeLeft > 0 ? (
              `Отправить повторно через ${Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')} сек`
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="cursor-pointer text-button-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? 'Отправка...' : 'Отправить повторно'}
              </button>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col items-center gap-5">
            <Button
              onClick={handleVerifyCode}
              variant="primary"
              size="lg"
              className="w-full text-base"
              disabled={code.length !== 6 || isPending}
            >
              {isPending ? 'Проверка...' : 'Отправить код'}
            </Button>

            <AuthNavLink text="Нет аккаунта?" linkText="Зарегистрироваться" onClick={handleRegister} />
          </div>
        </div>
      </AuthFormWrapper>
    </AuthCard>
  );
};
