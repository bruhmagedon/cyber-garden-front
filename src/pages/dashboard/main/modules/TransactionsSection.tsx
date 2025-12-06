import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CreditCard } from 'lucide-react';
import BlurFade from '@/shared/ui/magic/blur-fade';
import { DashboardTable } from '@/shared/ui/server-management-table';
import { cn, formatCurrency, formatDate, getCategoryConfig } from '@/shared/utils';
import type { TransactionItem } from '../model/useMainDashboardModel';

const PAGE_SIZE = 20;

type TransactionsSectionProps = {
  transactions: TransactionItem[];
  filterTitle: string;
};

export const TransactionsSection = ({ transactions, filterTitle }: TransactionsSectionProps) => {
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setPage(1);
  }, [filterTitle, transactions]);

  useEffect(
    () => () => {
      observerRef.current?.disconnect();
    },
    [],
  );

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && transactions.length > page * PAGE_SIZE) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [page, transactions.length],
  );

  const visibleItems = useMemo(
    () => transactions.slice(0, page * PAGE_SIZE),
    [page, transactions],
  );

  return (
    <BlurFade>
      <DashboardTable
        title="История операций"
        subtitle={`Всего: ${transactions.length}`}
        columns={[
          {
            key: 'title',
            header: 'Описание',
            className: 'col-span-4',
            render: (tx: TransactionItem) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-fill-tertiary flex items-center justify-center text-text-secondary">
                  {tx.type === 'income' ? (
                    <ArrowRight className="rotate-[-45deg] text-green-500 w-4 h-4" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground truncate max-w-[200px]" title={tx.title}>
                    {tx.title}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {tx.type === 'income' ? 'Доход' : 'Расход'}
                  </span>
                </div>
              </div>
            ),
          },
          {
            key: 'category',
            header: 'Категория',
            className: 'col-span-3',
            render: (tx: TransactionItem) => {
              const catConfig = getCategoryConfig(tx.categoryId);
              return (
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: catConfig.color }} />
                  <span className="text-foreground">{catConfig.label}</span>
                </div>
              );
            },
          },
          {
            key: 'date',
            header: 'Дата',
            className: 'col-span-2',
            render: (tx: TransactionItem) => (
              <span className="text-sm text-text-secondary">{formatDate(tx.date)}</span>
            ),
          },
          {
            key: 'amount',
            header: 'Сумма',
            className: 'col-span-3 text-right',
            render: (tx: TransactionItem) => (
              <span
                className={cn(
                  'text-sm font-semibold',
                  tx.type === 'income' ? 'text-green-500' : 'text-foreground',
                )}
              >
                {formatCurrency(tx.amount)}
              </span>
            ),
          },
        ]}
        rows={visibleItems}
        getRowId={(tx) => tx.id}
        lastRowRef={lastElementRef}
        emptyMessage="Ничего не найдено"
        cardClassName="bg-background/60 backdrop-blur border-border/60 shadow-sm"
      />
    </BlurFade>
  );
};
