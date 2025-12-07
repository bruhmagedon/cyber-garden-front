import { zodResolver } from '@hookform/resolvers/zod';
import { createFormControl } from 'react-hook-form';
import { z } from 'zod';
import { VALIDATION_MESSAGES } from './validation-messages';

const RegisterFormSchema = z
  .object({
    fullName: z.string().min(1, VALIDATION_MESSAGES.required),
    email: z.string().min(1, VALIDATION_MESSAGES.required).email(VALIDATION_MESSAGES.invalid_email),
    password: z.string().min(1, VALIDATION_MESSAGES.required),
    confirmPassword: z.string().min(1, VALIDATION_MESSAGES.required),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.passwords_must_match,
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;

export const defaultRegisterValues: RegisterFormValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const {
  formControl: registerFormControl,
  control: registerControl,
  handleSubmit: handleRegisterSubmit,
  register: registerRegister,
  watch: watchRegister,
  setValue: setRegisterValue,
  getValues: getRegisterValues,
  reset: resetRegister,
} = createFormControl<RegisterFormValues>({
  mode: 'onChange',
  defaultValues: defaultRegisterValues,
  resolver: zodResolver(RegisterFormSchema),
});
