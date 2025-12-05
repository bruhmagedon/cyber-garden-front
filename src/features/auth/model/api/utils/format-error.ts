/**
 * Dictionary for translating English error messages to Russian
 */
const errorTranslations: Record<string, string> = {
  'Not Found': 'Не найдено',
  'User not found': 'Пользователь не найден',
  'Email not found': 'Email не найден',
  'Invalid credentials': 'Неверные учетные данные',
  'Invalid email or password': 'Неверный email или пароль',
  'Email already exists': 'Email уже существует',
  'Email already registered': 'Email уже зарегистрирован',
  'Invalid token': 'Неверный токен',
  'Token expired': 'Токен истек',
  'Invalid verification code': 'Неверный код подтверждения',
  'Code expired': 'Код истек',
  Unauthorized: 'Не авторизован',
  Forbidden: 'Доступ запрещен',
  'Bad Request': 'Неверный запрос',
  'Internal Server Error': 'Внутренняя ошибка сервера',
  'Service Unavailable': 'Сервис недоступен',
  'An unexpected error occurred': 'Произошла непредвиденная ошибка',
};

/**
 * Translate error message from English to Russian
 */
function translateError(message: string): string {
  // Check for exact match
  if (errorTranslations[message]) {
    return errorTranslations[message];
  }

  // Check for partial matches (case-insensitive)
  const lowerMessage = message.toLowerCase();
  for (const [english, russian] of Object.entries(errorTranslations)) {
    if (lowerMessage.includes(english.toLowerCase())) {
      return russian;
    }
  }

  // Return original if no translation found
  return message;
}

/**
 * Format API error detail into a user-friendly message
 * Handles both string messages and FastAPI validation error arrays
 * Translates error messages to Russian
 */
export function formatErrorMessage(
  detail: string | Array<{ loc: (string | number)[]; msg: string; type: string }> | undefined,
): string | undefined {
  if (!detail) {
    return undefined;
  }

  // If it's already a string, translate and return it
  if (typeof detail === 'string') {
    return translateError(detail);
  }

  // If it's an array of validation errors, format and translate them
  if (Array.isArray(detail)) {
    return detail
      .map((error) => {
        const field = error.loc[error.loc.length - 1]; // Get the last element (field name)
        const translatedMsg = translateError(error.msg);
        return `${field}: ${translatedMsg}`;
      })
      .join(', ');
  }

  return translateError('An unexpected error occurred');
}
