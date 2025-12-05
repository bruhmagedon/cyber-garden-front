import { zodResolver } from '@hookform/resolvers/zod';
import { createFormControl } from 'react-hook-form';
import { z } from 'zod';
import { VALIDATION_MESSAGES } from './validation-messages';

const VerifyCodeFormSchema = z.object({
  code: z.string().length(6, VALIDATION_MESSAGES.code_must_be_6_digits),
});

export type VerifyCodeFormValues = z.infer<typeof VerifyCodeFormSchema>;

export const defaultVerifyCodeValues: VerifyCodeFormValues = {
  code: '',
};

export const {
  formControl: verifyCodeFormControl,
  control: verifyCodeControl,
  handleSubmit: handleVerifyCodeSubmit,
  register: registerVerifyCode,
  watch: watchVerifyCode,
  setValue: setVerifyCodeValue,
  getValues: getVerifyCodeValues,
} = createFormControl<VerifyCodeFormValues>({
  mode: 'onChange',
  defaultValues: defaultVerifyCodeValues,
  resolver: zodResolver(VerifyCodeFormSchema),
});
