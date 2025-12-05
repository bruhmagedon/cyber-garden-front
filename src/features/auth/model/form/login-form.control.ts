import { zodResolver } from '@hookform/resolvers/zod';
import { createFormControl } from 'react-hook-form';
import { z } from 'zod';
import { VALIDATION_MESSAGES } from './validation-messages';

const LoginFormSchema = z.object({
  email: z.string().min(1, VALIDATION_MESSAGES.required).email(VALIDATION_MESSAGES.invalid_email),
  password: z
    .string()
    .min(8, VALIDATION_MESSAGES.password_min_length)
    .regex(/\d/, VALIDATION_MESSAGES.password_must_contain_number)
    .regex(/[A-Z]/, VALIDATION_MESSAGES.password_must_contain_uppercase)
    .regex(/[a-z]/, VALIDATION_MESSAGES.password_must_contain_lowercase)
    .regex(/[^A-Za-z0-9]/, VALIDATION_MESSAGES.password_must_contain_special),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;

export const defaultLoginValues: LoginFormValues = {
  email: '',
  password: '',
};

export const {
  formControl: loginFormControl,
  control: loginControl,
  handleSubmit: handleLoginSubmit,
  register: registerLogin,
  watch: watchLogin,
  setValue: setLoginValue,
  getValues: getLoginValues,
  reset: resetLogin,
} = createFormControl<LoginFormValues>({
  mode: 'onChange',
  defaultValues: defaultLoginValues,
  resolver: zodResolver(LoginFormSchema),
});
