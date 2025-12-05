import Company from '@/assets/icons/Company.svg?react';
import FAQ from '@/assets/icons/FAQ.svg?react';
import Folder from '@/assets/icons/Folder.svg?react';
import History from '@/assets/icons/History.svg?react';
import Home from '@/assets/icons/Home.svg?react';
import Logout from '@/assets/icons/Logout.svg?react';
import Settings from '@/assets/icons/Settings.svg?react';

// Навигационные элементы
export const navigationItems = [
  { titleKey: 'navigation.main', url: '/', icon: Home, active: true },
  { titleKey: 'navigation.projects', url: '/projects', icon: Folder },
  { titleKey: 'navigation.meetings', url: '/meetings', icon: History },
];

export const desktopOnly = [{ titleKey: 'navigation.company', url: '/company', icon: Company }];

export const settingsItem = [{ titleKey: 'navigation.settings', url: '/settings', icon: Settings }];

export const footerItems = [
  { titleKey: 'navigation.help_center', action: 'help', icon: FAQ },
  { titleKey: 'navigation.logout', action: 'logout', icon: Logout },
];
