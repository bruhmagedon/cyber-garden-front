import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode, Ref } from 'react';
import { Link, NavLink, To } from 'react-router-dom';
import { cn } from '@/shared/utils';

const linkVariants = cva(
  'relative inline-flex cursor-pointer transition-colors duration-200 ease-out leading-none',
  {
    variants: {
      size: {
        default: 'text-base',
        large: 'text-lg',
      },
      theme: {
        unstyled: 'text-current',
        primary: ['text-primary font-medium '],
        secondary: 'text-link',
        light: 'text-white/80 hover:text-white',
      },
      decoration: {
        none: 'no-underline',
        underline:
          'underline decoration-transparent underline-offset-3 decoration-2 hover:decoration-inherit',
        boldUnderline:
          'after:absolute after:left-0  after:h-[2.5px] after:w-full after:bottom-[-3px] after:bg-primary after:rounded-b-full after:transition-opacity after:duration-150 after:opacity-0 hover:after:opacity-100',
      },
    },
    defaultVariants: {
      decoration: 'none',
      theme: 'unstyled',
      size: 'default',
    },
  },
);

export type LinkType = 'external' | 'navigation' | 'internal';

// Базовые пропсы для всех ссылок
export interface BaseLinkProps extends VariantProps<typeof linkVariants> {
  children?: ReactNode;
  className?: string;
  prefix?: ReactNode;
  postfix?: ReactNode;
  activeLinkStyle?: string;
}

export interface ExternalLinkProps extends BaseLinkProps {
  linkType: Extract<'external', LinkType>;
  to: string; // Обязательно строка для внешних ссылок
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

// Пропсы для внутренних и навигационных ссылок
export interface InternalOrNavLinkProps extends BaseLinkProps {
  linkType: Exclude<LinkType, 'external'>;
  activeLinkStyle?: string;
  to: To; // Может быть строкой или объектом
}

const AppLink = (props: ExternalLinkProps | InternalOrNavLinkProps, ref?: Ref<HTMLAnchorElement>) => {
  const {
    to,
    children,
    className,
    theme,
    size,
    linkType,
    prefix,
    decoration,
    postfix,
    activeLinkStyle,
    ...otherProps
  } = props;

  const content = (
    <>
      {prefix}
      {children}
      {postfix}
    </>
  );

  if (linkType === 'external') {
    return (
      <Link
        to={to as string}
        className={cn(linkVariants({ size, theme, decoration }), className)}
        target="_blank"
        rel="noopener noreferrer"
        ref={ref}
        {...otherProps}
      >
        {content}
      </Link>
    );
  }

  if (linkType === 'navigation') {
    return (
      <NavLink
        preventScrollReset={false}
        to={to}
        className={({ isActive }) =>
          cn(linkVariants({ size, theme, decoration }), className, isActive && activeLinkStyle)
        }
        ref={ref}
        {...otherProps}
      >
        {content}
      </NavLink>
    );
  }

  if (linkType === 'internal') {
    return (
      <Link
        preventScrollReset={false}
        to={to}
        className={cn(linkVariants({ size, theme, decoration }), className)}
        ref={ref}
        {...otherProps}
      >
        {content}
      </Link>
    );
  }

  throw new Error('Unknown link type');
};

AppLink.displayName = 'AppLink';

export { AppLink, linkVariants };
