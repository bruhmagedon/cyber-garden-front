interface AuthNavLinkProps {
  text: string;
  linkText: string;
  onClick: () => void;
}

/**
 * Компонент навигации между формами авторизации
 * Используется для перехода между login/register и другими формами
 */
export const AuthNavLink = ({ text, linkText, onClick }: AuthNavLinkProps) => {
  return (
    <div className="flex items-start gap-2">
      <span className="font-inter font-normal text-base text-text-secondary leading-snug">
        {text}
      </span>
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer font-inter font-normal text-base text-foreground leading-snug hover:underline"
      >
        {linkText}
      </button>
    </div>
  );
};
