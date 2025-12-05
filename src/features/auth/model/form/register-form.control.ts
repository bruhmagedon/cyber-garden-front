import { zodResolver } from '@hookform/resolvers/zod';
import { createFormControl } from 'react-hook-form';
import { z } from 'zod';
import { VALIDATION_MESSAGES } from './validation-messages';

const RegisterFormSchema = z
  .object({
    fullName: z.string().min(1, VALIDATION_MESSAGES.required),
    email: z.string().min(1, VALIDATION_MESSAGES.required).email(VALIDATION_MESSAGES.invalid_email),
    password: z
      .string()
      .min(8, VALIDATION_MESSAGES.password_min_length)
      .regex(/\d/, VALIDATION_MESSAGES.password_must_contain_number)
      .regex(/[A-Z]/, VALIDATION_MESSAGES.password_must_contain_uppercase)
      .regex(/[a-z]/, VALIDATION_MESSAGES.password_must_contain_lowercase)
      .regex(/[^A-Za-z0-9]/, VALIDATION_MESSAGES.password_must_contain_special),
    confirmPassword: z.string().min(1, VALIDATION_MESSAGES.required),
    acceptTerms: z.boolean().refine((val) => val === true, VALIDATION_MESSAGES.must_accept_terms),
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
  acceptTerms: false,
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
