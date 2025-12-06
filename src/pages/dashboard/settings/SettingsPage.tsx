import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@/app/providers';
import { useAuthMe } from '@/features/auth/model/api';
import { useAuthStore } from '@/features/auth/model/store';
import { Language } from '@/shared/constants/language';
import { useLanguage } from '@/shared/hooks/useLanguage/useLanguage';
import { useTheme } from '@/shared/hooks/useTheme/useTheme';
import { RadioGroup } from '@/shared/ui/RadioGroup/RadioGroup';
import { LanguageRadioGroup } from './modules/LanguageRadioGroup';
import { NotificationToggle } from './modules/NotificationToggle';
import { SettingsSidebar } from './modules/SettingsSidebar';
import { SettingsSection } from './ui/SettingsSection';
import { ThemeCard } from './ui/ThemeCard';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';

const SettingsPageAsync = () => {
  const { t } = useTranslation('settings');
  const { language, changeLanguage } = useLanguage();
  const storedUser = useAuthStore((state) => state.user);
  const { user: fetchedUser, isLoading: isProfileLoading } = useAuthMe();

  const { setTheme, theme } = useTheme();
  const [notifyMeetings, setNotifyMeetings] = useState(true);
  const [notifyResults, setNotifyResults] = useState(false);
  const userProfile = fetchedUser ?? storedUser;

  // Установка плавного скролла
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      <div className="mx-auto pt-6 flex w-full max-w-5xl flex-col gap-10 relative z-10 items-center">
        <h1 className="font-bold text-center text-3xl text-foreground md:text-4xl px-4 md:px-0">
          {t('title')}
        </h1>
        <div className="flex w-full flex-col gap-10 lg:flex-row justify-center">
          {/* <SettingsSidebar /> */}
          <main className="flex w-full flex-1 flex-col gap-8 items-center">
            <SettingsSection id="profile" title={t('sections.profile.title')}>
              <div className="flex flex-col gap-4 lg:gap-4">
                <div className="flex flex-col gap-4 lg:gap-4">
                  <Skeleton isLoading={isProfileLoading} className="h-[74px] w-full rounded-2xl">
                    <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                      <p className="text-text-tertiary text-sm">
                        {t('sections.profile.name_label')}
                      </p>
                      <p className="font-medium text-text-primary">
                        {userProfile?.fullName || '—'}
                      </p>
                    </div>
                  </Skeleton>

                  <Skeleton isLoading={isProfileLoading} className="h-[74px] w-full rounded-2xl">
                    <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                      <p className="text-text-tertiary text-sm">
                        {t('sections.profile.email_label')}
                      </p>
                      <p className="font-medium text-text-primary break-all">
                        {userProfile?.email || '—'}
                      </p>
                    </div>
                  </Skeleton>
                </div>
              </div>
            </SettingsSection>

            {/* Секция: Тема */}
            <SettingsSection id="interface" title={t('sections.interface.title')}>
              <RadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as Theme)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
              >
                <ThemeCard
                  theme="dark"
                  label={t('sections.interface.themes.dark')}
                  isSelected={theme === 'dark'}
                  onSelect={() => setTheme('dark')}
                />
                <ThemeCard
                  theme="light"
                  label={t('sections.interface.themes.light')}
                  isSelected={theme === 'light'}
                  onSelect={() => setTheme('light')}
                />
                <ThemeCard
                  theme="system"
                  label={t('sections.interface.themes.system')}
                  isSelected={theme === 'system'}
                  onSelect={() => setTheme('system')}
                />
              </RadioGroup>
            </SettingsSection>

            {/* Секция: Язык */}
            <SettingsSection id="language" title={t('sections.language.title')}>
              <LanguageRadioGroup
                value={language}
                onChange={(value) => changeLanguage(value as Language)}
              />
            </SettingsSection>

            {/* Секция: Уведомления */}
            <SettingsSection id="notifications" title={t('sections.notifications.title')}>
              <div className="flex flex-col gap-8">
                <NotificationToggle
                  label={t('sections.notifications.result_notifications')}
                  checked={notifyResults}
                  onChange={setNotifyResults}
                />
              </div>
            </SettingsSection>
          </main>
        </div>
      </div>
    </>
  );
};

export default SettingsPageAsync;
