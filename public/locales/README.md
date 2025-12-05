# Internationalization (i18n) Documentation

Документация по системе интернационализации приложения AutoBrief.

## 📁 Структура файлов

```
public/locales/
├── ru/                          # Русский язык
│   ├── global.json             # Глобальные переводы (навигация, общие слова)
│   ├── settings.json           # Страница настроек
│   ├── main.json               # Главная страница
│   ├── meetings.json           # Страница встреч
│   ├── projects.json           # Страница проектов
│   ├── auth.json               # Авторизация и регистрация
│   ├── error.json              # Страницы ошибок
│   └── not-found.json          # Страница 404
├── en/                          # Английский язык
│   └── ... (аналогичная структура)
└── README.md                    # Эта документация
```

## 🎯 Принципы организации

### 1. Разделение по namespaces (страницам)

Каждая страница имеет свой файл переводов (namespace). Это позволяет:
- **Уменьшить размер бандла** - загружаются только нужные переводы
- **Улучшить поддержку** - легко найти и обновить переводы
- **Ускорить загрузку** - lazy loading переводов

### 2. Global namespace

Файл `global.json` содержит:
- Общие слова и фразы (кнопки, действия)
- Навигацию
- Статусы
- Сообщения об ошибках
- Валидацию

## 🔨 Использование в компонентах

### Базовое использование

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation("settings"); // указываем namespace
  
  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("sections.profile.title")}</p>
    </div>
  );
}
```

### Использование глобального namespace

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation("global");
  
  return (
    <button>{t("common.save")}</button>
  );
}
```

### Множественные namespaces

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation(["settings", "global"]);
  
  return (
    <div>
      <h1>{t("settings:title")}</h1>
      <button>{t("global:common.save")}</button>
    </div>
  );
}
```

### Интерполяция переменных

```tsx
// В JSON файле:
// "welcome_message": "Привет, {{name}}!"

const { t } = useTranslation("global");
<p>{t("welcome_message", { name: "Иван" })}</p>
// Результат: "Привет, Иван!"
```

### Множественное число

```tsx
// В JSON файле:
// "items_count": "{{count}} элемент",
// "items_count_plural": "{{count}} элемента",
// "items_count_many": "{{count}} элементов"

const { t } = useTranslation("global");
<p>{t("items_count", { count: 5 })}</p>
```

## 🌐 Смена языка

### Использование хука useLanguage

```tsx
import { useLanguage } from "@/shared/hooks/useLanguage";

function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();
  
  return (
    <select 
      value={language} 
      onChange={(e) => changeLanguage(e.target.value as Language)}
    >
      <option value="ru">Русский</option>
      <option value="en">English</option>
    </select>
  );
}
```

### Прямое использование i18n

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { i18n } = useTranslation();
  
  const changeToEnglish = () => {
    i18n.changeLanguage("en");
  };
  
  return <button onClick={changeToEnglish}>Switch to English</button>;
}
```

## ➕ Добавление новых переводов

### 1. Добавление нового ключа в существующий файл

**ru/settings.json:**
```json
{
  "new_section": {
    "title": "Новая секция",
    "description": "Описание новой секции"
  }
}
```

**en/settings.json:**
```json
{
  "new_section": {
    "title": "New Section",
    "description": "Description of new section"
  }
}
```

### 2. Создание нового namespace (страницы)

1. Создайте файлы переводов:
   - `public/locales/ru/my-page.json`
   - `public/locales/en/my-page.json`

2. Добавьте namespace в конфигурацию i18n:

```typescript
// src/shared/config/i18n/i18n.ts
ns: [
  "global",
  "settings",
  "my-page", // новый namespace
  // ...
]
```

3. Используйте в компоненте:

```tsx
const { t } = useTranslation("my-page");
```

## 🎨 Структура ключей переводов

### Рекомендуемая иерархия

```json
{
  "title": "Заголовок страницы",
  
  "sections": {
    "section_name": {
      "title": "Название секции",
      "field_label": "Метка поля",
      "help_text": "Текст подсказки"
    }
  },
  
  "actions": {
    "create": "Создать",
    "edit": "Редактировать",
    "delete": "Удалить"
  },
  
  "messages": {
    "success": "Успешно",
    "error": "Ошибка"
  },
  
  "validation": {
    "required": "Обязательное поле",
    "invalid_format": "Неверный формат"
  }
}
```

## 🔤 Naming Conventions

### Для ключей
- Используйте `snake_case` для имен ключей
- Будьте описательными: `email_label` вместо `email`
- Группируйте связанные ключи: `sections.profile.title`

### Для значений
- Сохраняйте регистр и пунктуацию оригинала
- Русский - основной язык разработки
- Английский - полный перевод, не транслитерация

## 🚀 Best Practices

### 1. DRY (Don't Repeat Yourself)
Используйте `global.json` для повторяющихся слов:

```tsx
// ❌ Плохо
// settings.json: { "actions": { "save": "Сохранить" } }
// profile.json: { "actions": { "save": "Сохранить" } }

// ✅ Хорошо
// global.json: { "common": { "save": "Сохранить" } }
const { t } = useTranslation("global");
t("common.save");
```

### 2. Контекстные ключи
Делайте ключи понятными вне контекста:

```tsx
// ❌ Плохо
"title": "Настройки" // Какой страницы?

// ✅ Хорошо
"settings_page_title": "Настройки страницы"
```

### 3. Разделение UI и контента
Переводите только видимый пользователю текст:

```tsx
// ❌ Плохо
const STATUS_ACTIVE = t("status.active"); // константа

// ✅ Хорошо
<span>{t("status.active")}</span> // отображение
```

### 4. Fallback значения
Всегда предоставляйте переводы для всех языков:

```json
// ✅ В обоих файлах должны быть одинаковые ключи
// ru/settings.json
{ "title": "Настройки" }

// en/settings.json
{ "title": "Settings" }
```

## 🐛 Отладка

### Включение режима отладки

В `.env`:
```
VITE_APP_DEBUG_I18=true
```

Это выведет в консоль:
- Загруженные namespaces
- Отсутствующие ключи
- Ошибки загрузки

### Проверка отсутствующих переводов

```tsx
import { useTranslation } from "react-i18next";

const { t, ready } = useTranslation("settings");

if (!ready) {
  return <div>Загрузка переводов...</div>;
}
```

## 📦 Добавление нового языка

1. Создайте папку с кодом языка:
```bash
mkdir public/locales/de  # Немецкий
```

2. Скопируйте структуру файлов из `ru/` или `en/`

3. Добавьте язык в конфигурацию:

```typescript
// src/shared/config/i18n/i18n.ts
supportedLngs: ["ru", "en", "de"],
```

4. Добавьте тип:

```typescript
// src/shared/constants/language.ts
export const LANGUAGES = ["ru", "en", "de"] as const;
```

5. Добавьте опцию в UI:

```typescript
// LanguageRadioGroup или LanguageSelector
const languages = [
  { value: "ru", labelKey: "sections.language.options.ru" },
  { value: "en", labelKey: "sections.language.options.en" },
  { value: "de", labelKey: "sections.language.options.de" }, // новый
];
```

## 📚 Полезные ссылки

- [i18next документация](https://www.i18next.com/)
- [react-i18next документация](https://react.i18next.com/)
- [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector)

## 🤝 Contributing

При добавлении новых переводов:
1. Добавьте ключи в оба языка (`ru` и `en`)
2. Используйте осмысленные имена ключей
3. Группируйте связанные переводы
4. Проверьте, нет ли дубликатов в `global.json`
5. Протестируйте оба языка перед коммитом