export const PASSWORD_REQUIREMENTS = [
  { key: 'minLength', text: 'Как минимум 8 символов' },
  { key: 'hasNumber', text: 'Как минимум 1 цифра' },
  { key: 'hasUppercase', text: 'Как минимум 1 заглавная буква' },
  { key: 'hasLowercase', text: 'Как минимум 1 строчная буква' },
  { key: 'hasSpecial', text: 'Как минимум 1 специальный символ' },
] as const;
