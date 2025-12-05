# Auth UI Components

Переиспользуемые UI компоненты для страниц авторизации, организованные по слот-паттерну.

## Структура

```
ui/
├── AuthCard/           # Основной контейнер карточки
├── AuthHeader/         # Заголовок с логотипом
├── AuthFormWrapper/    # Обертка для содержимого формы
├── PasswordInput/      # Инпут пароля с переключателем видимости
├── FormError/          # Отображение ошибок валидации
├── AuthNavLink/        # Навигационные ссылки между формами
├── BackButton/         # Кнопка "Назад"
└── PasswordValidator/  # Валидатор требований к паролю
```

## Компоненты

### AuthCard

Основной контейнер для всех форм авторизации.

**Props:**
- `children: ReactNode` - содержимое карточки
- `maxWidth?: 'sm' | 'md' | 'lg'` - максимальная ширина (по умолчанию 'sm')

**Пример:**
```tsx
<AuthCard maxWidth="lg">
  <AuthHeader />
  {/* ... */}
</AuthCard>
```

### AuthHeader

Заголовок с логотипом и названием "AutoBrief". Не принимает props.

**Пример:**
```tsx
<AuthHeader />
```

### AuthFormWrapper

Обертка для содержимого формы с настраиваемым отступом.

**Props:**
- `children: ReactNode` - содержимое
- `gap?: 'sm' | 'md' | 'lg'` - размер отступа (по умолчанию 'lg')

**Пример:**
```tsx
<AuthFormWrapper gap="sm">
  {/* Содержимое формы */}
</AuthFormWrapper>
```

### PasswordInput

Инпут для пароля с иконкой переключения видимости.

**Props:**
- Наследует все props от `HTMLInputElement` кроме `type`
- `className?: string` - дополнительные CSS классы

**Пример:**
```tsx
<PasswordInput
  {...register('password')}
  placeholder="Введите пароль"
  className="text-text-secondary"
/>
```

### FormError

Компонент для отображения ошибок валидации.

**Props:**
- `message?: string` - текст ошибки (если undefined, компонент не рендерится)

**Пример:**
```tsx
<FormError message={errors.email?.message} />
```

### AuthNavLink

Навигационная ссылка между формами (например, "Нет аккаунта? Зарегистрироваться").

**Props:**
- `text: string` - текст перед ссылкой
- `linkText: string` - текст ссылки
- `onClick: () => void` - обработчик клика

**Пример:**
```tsx
<AuthNavLink
  text="Нет аккаунта?"
  linkText="Зарегистрироваться"
  onClick={() => navigate('/auth/register')}
/>
```

### BackButton

Кнопка "Назад" со стрелкой.

**Props:**
- `onClick: () => void` - обработчик клика

**Пример:**
```tsx
<BackButton onClick={() => navigate('/auth/login')} />
```

## Пример использования

```tsx
import {
  AuthCard,
  AuthHeader,
  AuthFormWrapper,
  PasswordInput,
  FormError,
  AuthNavLink,
} from '@/features/auth';

export const LoginForm = () => {
  // ... логика формы

  return (
    <AuthCard>
      <AuthHeader />

      <AuthFormWrapper>
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col gap-3">
            <Label>Введите почту</Label>
            <Input {...register('email')} />
            <FormError message={errors.email?.message} />
          </div>

          <div className="flex w-full flex-col gap-3">
            <Label>Введите пароль</Label>
            <PasswordInput {...register('password')} />
            <FormError message={errors.password?.message} />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-5">
          <Button onClick={handleSubmit(onSubmit)}>
            Войти
          </Button>

          <AuthNavLink
            text="Нет аккаунта?"
            linkText="Зарегистрироваться"
            onClick={handleRegister}
          />
        </div>
      </AuthFormWrapper>
    </AuthCard>
  );
};
```

## Преимущества подхода

1. **DRY (Don't Repeat Yourself)** - устранено дублирование кода
2. **Консистентность** - все формы используют одинаковые компоненты
3. **Легкость изменений** - изменения в одном месте применяются ко всем формам
4. **Улучшенная читаемость** - код форм стал более декларативным
5. **Типобезопасность** - все компоненты типизированы с TypeScript
