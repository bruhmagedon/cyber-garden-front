import Logo from '@/assets/icons/logo.svg?react';
import { useAuthStore } from '@/features/auth';
import {
  Button,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui';
import { cn } from '@/shared/utils';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { desktopOnly, footerItems, navigationItems, settingsItem } from './sidebarConfig';

export function LayoutSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation('global');
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { clearTokens } = useAuthStore();
  // TODO: Подекомпозировать сайдбар, чтобы уменьшить повторение кода

  return (
    <Sidebar collapsible="icon" className="border-none bg-background-secondary px-5 py-7.5" {...props}>
      <SidebarHeader className="mb-10">
        <Logo className="h-7 w-7" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-3">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    asChild
                    tooltip={t(item.titleKey)}
                    isActive={isActive}
                    className={cn(
                      'flex items-center gap-2.5',
                      'h-12 rounded-[0.625rem] p-3 transition-all',
                      'hover:bg-hover-primary hover:text-foreground data-[active=true]:bg-fill-secondary data-[active=true]:font-semibold data-[active=true]:text-foreground data-[active=true]:hover:bg-hover-secondary',
                      'font-medium text-sm leading-tight lg:font-normal lg:text-base lg:leading-snug',
                      'group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!p-0',
                    )}
                  >
                    <Link to={item.url}>
                      {<item.icon className={cn('transition-all', 'group-data-[collapsible=icon]:ml-4')} />}
                      <span
                        className={cn(
                          'text-nowrap leading-tight transition-all',
                          'group-data-[collapsible=icon]:ml-4',
                        )}
                      >
                        {t(item.titleKey)}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
            {desktopOnly.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    asChild
                    tooltip={t(item.titleKey)}
                    isActive={isActive}
                    className={cn(
                      'flex items-center gap-2.5',
                      'h-12 rounded-[0.625rem] p-3 transition-all',
                      'hover:bg-hover-primary hover:text-foreground data-[active=true]:bg-fill-secondary data-[active=true]:font-semibold data-[active=true]:text-foreground data-[active=true]:hover:bg-hover-secondary',
                      'font-medium text-sm leading-tight lg:font-normal lg:text-base lg:leading-snug',
                      // Переопределение размера в collapsed: базовый size-8! -> size-12!
                      'group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!p-0',
                    )}
                  >
                    <Link to={item.url}>
                      {<item.icon className={cn('transition-all', 'group-data-[collapsible=icon]:ml-4')} />}
                      <span
                        className={cn(
                          'text-nowrap leading-tight transition-all',
                          'group-data-[collapsible=icon]:ml-4',
                        )}
                      >
                        {t(item.titleKey)}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
            {<Separator className="block lg:hidden" />}
            {settingsItem.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    asChild
                    tooltip={t(item.titleKey)}
                    isActive={isActive}
                    className={cn(
                      'flex items-center gap-2.5',
                      'h-12 rounded-[0.625rem] p-3 transition-all',
                      'hover:bg-hover-primary hover:text-foreground data-[active=true]:bg-fill-secondary data-[active=true]:font-semibold data-[active=true]:text-foreground data-[active=true]:hover:bg-hover-secondary',
                      'font-medium text-sm leading-tight lg:font-normal lg:text-base lg:leading-snug',
                      'group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!p-0',
                    )}
                  >
                    <Link to={item.url}>
                      {<item.icon className={cn('transition-all', 'group-data-[collapsible=icon]:ml-4')} />}
                      <span
                        className={cn(
                          'text-nowrap leading-tight transition-all',
                          'group-data-[collapsible=icon]:ml-4',
                        )}
                      >
                        {t(item.titleKey)}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-3">
            {footerItems.map((item) => {
              return (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    tooltip={t(item.titleKey)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5',
                      'h-12 rounded-[0.625rem] p-3 transition-all',
                      'hover:bg-hover-primary hover:text-foreground data-[active=true]:bg-fill-secondary data-[active=true]:font-semibold data-[active=true]:text-foreground data-[active=true]:hover:bg-hover-secondary',
                      'font-medium text-sm leading-tight lg:font-normal lg:text-base lg:leading-snug',
                      'group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!p-0',
                    )}
                    onClick={() => {
                      if (item.action === 'logout') {
                        clearTokens();
                        navigate('/auth/login');
                      }
                    }}
                  >
                    {<item.icon className={cn('transition-all', 'group-data-[collapsible=icon]:ml-4')} />}
                    <span
                      className={cn(
                        'text-nowrap leading-tight transition-all',
                        'group-data-[collapsible=icon]:ml-4',
                      )}
                    >
                      {t(item.titleKey)}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="-right-3 absolute top-12 z-50 hidden h-6 w-6 rounded-full bg-fill-tertiary p-0 transition-colors hover:bg-hover-tertiary md:flex"
        aria-label={isCollapsed ? t('common.expand') : t('common.collapse')}
      >
        <ChevronLeft
          className={cn(
            'h-3.5 w-3.5 text-foreground transition-transform duration-300',
            isCollapsed && 'rotate-180',
          )}
        />
      </Button>
    </Sidebar>
  );
}
