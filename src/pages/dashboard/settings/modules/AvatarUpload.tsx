import PlusIcon from '@/assets/icons/Plus.svg?react';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/utils';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AvatarUpload = () => {
  const { t } = useTranslation('settings');
  const [avatarUrl, setAvatarUrl] = useState('https://placehold.co/110x110');

  // Обработчики
  const handleAvatarUpload = () => {
    console.log(t('messages.avatar_upload_success'));
    // Здесь будет логика загрузки файла
  };

  const handleAvatarDelete = () => {
    console.log(t('messages.avatar_delete_success'));
    setAvatarUrl('https://placehold.co/110x110');
  };

  return (
    <div className="flex items-center gap-8">
      <div className="relative h-20 w-20 lg:h-28 lg:w-28">
        <img
          src={avatarUrl}
          alt={t('sections.profile.avatar.upload')}
          className="h-full w-full rounded-full object-cover"
        />
        {/* Кнопка редактирования - только на мобильных */}
        <Button
          // onClick={onUpload}
          variant="ghost"
          size="icon"
          className={cn(
            'absolute top-0 right-0 flex size-5 items-center justify-center p-0',
            'rounded-xl bg-white shadow-lg hover:bg-white/80',
            'lg:hidden',
          )}
          aria-label={t('sections.profile.avatar.delete')}
        >
          <XIcon className="size-3 text-black" />
        </Button>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row">
        <Button onClick={handleAvatarUpload} variant="primary">
          {t('sections.profile.avatar.upload')}
          <PlusIcon />
        </Button>
        <Button
          onClick={handleAvatarDelete}
          variant="secondary"
          size="default"
          className="hidden text-[#555555] hover:bg-[#c4c4c4] lg:flex dark:text-[#E9E9E9]"
        >
          {t('sections.profile.avatar.delete')}
        </Button>
      </div>
    </div>
  );
};
