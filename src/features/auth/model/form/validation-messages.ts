export const VALIDATION_MESSAGES = {
  required: 'Это поле обязательно для заполнения',
  invalid_email: 'Введите корректный email адрес',
  password_min_length: 'Это поле обязательно для заполнения',
  password_must_contain_number: 'Пароль должен содержать хотя бы одну цифру',
  password_must_contain_uppercase: 'Пароль должен содержать хотя бы одну заглавную букву',
  password_must_contain_lowercase: 'Пароль должен содержать хотя бы одну строчную букву',
  password_must_contain_special: 'Пароль должен содержать хотя бы один специальный символ',
  passwords_must_match: 'Пароли должны совпадать',
  must_accept_terms: 'Необходимо принять условия пользовательского соглашения',
  code_must_be_6_digits: 'Код должен состоять из 6 цифр',
} as const;
