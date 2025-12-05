import { zodResolver } from '@hookform/resolvers/zod';
import { createFormControl } from 'react-hook-form';
import { z } from 'zod';
import { VALIDATION_MESSAGES } from './validation-messages';

const ForgotPasswordFormSchema = z.object({
  email: z.string().min(1, VALIDATION_MESSAGES.required).email(VALIDATION_MESSAGES.invalid_email),
});

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordFormSchema>;

export const defaultForgotPasswordValues: ForgotPasswordFormValues = {
  email: '',
};

export const {
  formControl: forgotPasswordFormControl,
  control: forgotPasswordControl,
  handleSubmit: handleForgotPasswordSubmit,
  register: registerForgotPassword,
  watch: watchForgotPassword,
  setValue: setForgotPasswordValue,
  getValues: getForgotPasswordValues,
  reset: resetForgotPassword,
} = createFormControl<ForgotPasswordFormValues>({
  mode: 'onChange',
  defaultValues: defaultForgotPasswordValues,
  resolver: zodResolver(ForgotPasswordFormSchema),
});
