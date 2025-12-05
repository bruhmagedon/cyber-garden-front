import ArrowLeft from '@/shared/assets/Auth/arrowLeft.svg?react';

interface BackButtonProps {
  onClick: () => void;
}

/**
 * Кнопка "Назад" со стрелкой для навигации в формах авторизации
 */
export const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-6 w-6 cursor-pointer overflow-hidden transition-colors hover:opacity-70"
    >
      <ArrowLeft className="absolute top-[4.50px] left-[3px] h-3.5 w-4 text-text-tertiary" strokeWidth={2} />
    </button>
  );
};
