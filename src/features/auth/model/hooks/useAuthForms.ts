import { useFormState } from 'react-hook-form';
import {
  forgotPasswordControl,
  getForgotPasswordValues,
  handleForgotPasswordSubmit,
  registerForgotPassword,
  resetForgotPassword,
} from '../form/forgot-password-form.control';
import { handleLoginSubmit, loginControl, registerLogin, resetLogin } from '../form/login-form.control';
import {
  handleRegisterSubmit,
  registerControl,
  registerRegister,
  resetRegister,
  watchRegister,
} from '../form/register-form.control';
import {
  handleResetPasswordSubmit,
  registerResetPassword,
  resetPasswordControl,
  resetResetPassword,
  watchResetPassword,
} from '../form/reset-password-form.control';

export const useLoginForm = () => {
  const { errors } = useFormState({ control: loginControl });

  return {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    errors,
    reset: resetLogin,
  };
};

export const useRegisterForm = () => {
  const { errors } = useFormState({ control: registerControl });

  return {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    watch: watchRegister,
    errors,
    reset: resetRegister,
  };
};

export const useForgotPasswordForm = () => {
  const { errors } = useFormState({ control: forgotPasswordControl });

  return {
    register: registerForgotPassword,
    handleSubmit: handleForgotPasswordSubmit,
    getValues: getForgotPasswordValues,
    errors,
    reset: resetForgotPassword,
  };
};

export const useResetPasswordForm = () => {
  const { errors } = useFormState({ control: resetPasswordControl });

  return {
    register: registerResetPassword,
    handleSubmit: handleResetPasswordSubmit,
    watch: watchResetPassword,
    errors,
    reset: resetResetPassword,
  };
};
