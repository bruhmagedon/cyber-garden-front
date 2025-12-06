import { useFormState } from 'react-hook-form';
import { handleLoginSubmit, loginControl, registerLogin, resetLogin } from '../form/login-form.control';
import {
  handleRegisterSubmit,
  registerControl,
  registerRegister,
  resetRegister,
  watchRegister,
} from '../form/register-form.control';

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


