import { zodResolver } from '@hookform/resolvers/zod';
import { createFormControl } from 'react-hook-form';
import { z } from 'zod';
import { VALIDATION_MESSAGES } from './validation-messages';

const ResetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, VALIDATION_MESSAGES.password_min_length)
      .regex(/\d/, VALIDATION_MESSAGES.password_must_contain_number)
      .regex(/[A-Z]/, VALIDATION_MESSAGES.password_must_contain_uppercase)
      .regex(/[a-z]/, VALIDATION_MESSAGES.password_must_contain_lowercase)
      .regex(/[^A-Za-z0-9]/, VALIDATION_MESSAGES.password_must_contain_special),
    confirmPassword: z.string().min(1, VALIDATION_MESSAGES.required),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: VALIDATION_MESSAGES.passwords_must_match,
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;

export const defaultResetPasswordValues: ResetPasswordFormValues = {
  newPassword: '',
  confirmPassword: '',
};

export const {
  formControl: resetPasswordFormControl,
  control: resetPasswordControl,
  handleSubmit: handleResetPasswordSubmit,
  register: registerResetPassword,
  watch: watchResetPassword,
  setValue: setResetPasswordValue,
  getValues: getResetPasswordValues,
  reset: resetResetPassword,
} = createFormControl<ResetPasswordFormValues>({
  mode: 'onChange',
  defaultValues: defaultResetPasswordValues,
  resolver: zodResolver(ResetPasswordFormSchema),
});
