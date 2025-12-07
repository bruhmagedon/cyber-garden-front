import type { LucideIcon } from 'lucide-react';
import {
  Wallet,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Music,
  MoreHorizontal,
  Zap,
} from 'lucide-react';

export type CategoryConfig = {
  color: string;
  icon: LucideIcon;
  label: string;
};

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  salary: { color: '#10b981', icon: Wallet, label: 'Зарплата' },
  food: { color: '#f59e0b', icon: ShoppingBag, label: 'Продукты' },
  cafes: { color: '#ef4444', icon: Coffee, label: 'Кафе' },
  transport: { color: '#3b82f6', icon: Car, label: 'Транспорт' },
  subscriptions: { color: '#8b5cf6', icon: Music, label: 'Подписки' },
  rent: { color: '#ec4899', icon: Home, label: 'Аренда' },
  other: { color: '#6b7280', icon: MoreHorizontal, label: 'Прочее' },
  health: { color: '#14b8a6', icon: Zap, label: 'Здоровье' },
  Food: { color: '#f59e0b', icon: ShoppingBag, label: 'Еда' },
  Misc: { color: '#6b7280', icon: MoreHorizontal, label: 'Разное' },
};

export const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const value = (hash & 0x00ffffff).toString(16).toUpperCase();
  return `#${'000000'.substring(0, 6 - value.length)}${value}`;
};

export const getCategoryConfig = (catName: string): CategoryConfig => {
  if (!catName) {
    return { color: '#9ca3af', icon: MoreHorizontal, label: 'Неизвестно' };
  }
  if (CATEGORY_CONFIG[catName]) {
    return CATEGORY_CONFIG[catName];
  }
  const lower = catName.toLowerCase();
  if (CATEGORY_CONFIG[lower]) {
    return CATEGORY_CONFIG[lower];
  }

  return {
    color: stringToColor(catName),
    icon: MoreHorizontal,
    label: catName,
  };
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
