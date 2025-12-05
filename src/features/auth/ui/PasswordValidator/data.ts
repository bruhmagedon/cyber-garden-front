interface PasswordRule {
  id: string;
  label: string;
  validator: (password: string) => boolean;
}

export const passwordRules: PasswordRule[] = [
  {
    id: 'minLength',
    label: 'Как минимум 8 символов',
    validator: (password) => password.length >= 8,
  },
  {
    id: 'hasNumber',
    label: 'Как минимум 1 цифра',
    validator: (password) => /\d/.test(password),
  },
  {
    id: 'hasUppercase',
    label: 'Как минимум 1 заглавная буква',
    validator: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'hasLowercase',
    label: 'Как минимум 1 строчная буква',
    validator: (password) => /[a-z]/.test(password),
  },
  {
    id: 'hasSpecial',
    label: 'Как минимум 1 специальный символ',
    validator: (password) => /[^A-Za-z0-9]/.test(password),
  },
];
