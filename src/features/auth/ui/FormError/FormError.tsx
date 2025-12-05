interface FormErrorProps {
  message?: string;
}

/**
 * Компонент для отображения ошибок валидации формы
 */
export const FormError = ({ message }: FormErrorProps) => {
  if (!message) {
    return null;
  }

  return <p className="font-inter font-normal text-danger text-xs">{message}</p>;
};
