import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@/app/providers';
import { Language } from '@/shared/constants/language';
import { useLanguage } from '@/shared/hooks/useLanguage/useLanguage';
import { useTheme } from '@/shared/hooks/useTheme/useTheme';
import { Button } from '@/shared/ui/Button/Button';
import { RadioGroup } from '@/shared/ui/RadioGroup/RadioGroup';
import { AvatarUpload } from './modules/AvatarUpload';
import { LanguageRadioGroup } from './modules/LanguageRadioGroup';
import { NotificationToggle } from './modules/NotificationToggle';
import { SettingsSidebar } from './modules/SettingsSidebar';
import { SettingsInput } from './ui/SettingsInput';
import { SettingsSection } from './ui/SettingsSection';
import { SpecializationSelect } from './ui/SpecializationSelect';
import { ThemeCard } from './ui/ThemeCard';

const SettingsPageAsync = () => {
  const { t } = useTranslation('settings');
  const { language, changeLanguage } = useLanguage();

  // ⚠️ Временное состояние для интерактивности (будет заменено на state management)
  const [userName, setUserName] = useState('Георгий Кобзев');
  const [userEmail, setUserEmail] = useState('m2312261@edu.misis.ru');
  const [specialization, setSpecialization] = useState('project-manager');
  const { setTheme, theme } = useTheme();
  const [notifyMeetings, setNotifyMeetings] = useState(true);
  const [notifyResults, setNotifyResults] = useState(false);
  const [exportPath, setExportPath] = useState('');

  const handleSelectFolder = () => {
    console.log(t('sections.storage.select_folder'));
    // Здесь будет логика выбора папки
  };

  // Установка плавного скролла
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-300 flex-col gap-10 bg-background lg:gap-10">
      <h1 className="font-semibold text-2xl text-text-quaternary leading-7 lg:text-4xl lg:leading-10">
        {t('title')}
      </h1>
      <div className="flex flex-col gap-10 lg:flex-row">
        <SettingsSidebar />
        <main className="flex flex-1 flex-col gap-12">
          <SettingsSection id="profile" title={t('sections.profile.title')}>
            <div className="flex flex-col gap-8 lg:gap-8">
              <AvatarUpload />

              {/* Поле имени */}
              <SettingsInput
                label={t('sections.profile.name_label')}
                helpText={t('sections.profile.help_text')}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />

              {/* Поле email */}
              <SettingsInput
                label={t('sections.profile.email_label')}
                helpText={t('sections.profile.help_text')}
                value={userEmail}
                type="email"
                onChange={(e) => setUserEmail(e.target.value)}
              />

              {/* Выбор специализации */}
              <SpecializationSelect value={specialization} onChange={setSpecialization} />
            </div>
          </SettingsSection>

          {/* Секция: Тема */}
          <SettingsSection id="interface" title={t('sections.interface.title')} maxWidth="full">
            <RadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as Theme)}
              className="flex w-full min-w-0 gap-7 overflow-x-auto pb-2"
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
            <LanguageRadioGroup value={language} onChange={(value) => changeLanguage(value as Language)} />
          </SettingsSection>

          {/* Секция: Уведомления */}
          <SettingsSection id="notifications" title={t('sections.notifications.title')}>
            <div className="flex flex-col gap-8">
              <NotificationToggle
                label={t('sections.notifications.meeting_reminders')}
                checked={notifyMeetings}
                onChange={setNotifyMeetings}
              />
              <NotificationToggle
                label={t('sections.notifications.result_notifications')}
                checked={notifyResults}
                onChange={setNotifyResults}
              />
            </div>
          </SettingsSection>

          {/* Секция: Хранение и экспорт */}
          <SettingsSection id="storage" title={t('sections.storage.title')}>
            <SettingsInput
              label={t('sections.storage.export_path_label')}
              helpText={t('sections.storage.help_text')}
              placeholder={t('sections.storage.export_path_placeholder')}
              value={exportPath}
              onChange={(e) => setExportPath(e.target.value)}
            />

            <Button variant="primary" size="md" className="w-full" onClick={handleSelectFolder}>
              {t('sections.storage.select_folder')}
            </Button>
          </SettingsSection>
        </main>
      </div>
    </div>
  );
};

export default SettingsPageAsync;
