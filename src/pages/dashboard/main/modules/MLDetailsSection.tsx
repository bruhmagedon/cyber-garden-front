import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BlurFade from '@/shared/ui/magic/blur-fade';
import { DashboardTable } from '@/shared/ui/server-management-table';
import { getCategoryConfig } from '@/shared/utils';
import type { TransactionItem } from '../model/useMainDashboardModel';

const PAGE_SIZE = 20;

type MLDetailsSectionProps = {
  transactions: TransactionItem[];
};

export const MLDetailsSection = ({ transactions }: MLDetailsSectionProps) => {
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setPage(1);
  }, [transactions]);

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
        title="Детализация ML"
        subtitle={`Всего: ${transactions.length}`}
        columns={[
          {
            key: 'title',
            header: 'Транзакция',
            className: 'col-span-4',
            render: (tx: TransactionItem) => <span className="font-medium text-foreground">{tx.title}</span>,
          },
          {
            key: 'prediction',
            header: 'Предсказание',
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
            key: 'probabilities',
            header: 'Топ категорий',
            className: 'col-span-5',
            render: (tx: TransactionItem) => {
              const probs = tx.probabilities ?? {};
              const sortedProbs = Object.entries(probs)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 3);

              return (
                <div className="flex flex-col gap-1.5">
                  {sortedProbs.map(([category, probability]) => (
                    <div key={category} className="flex items-center gap-2 text-xs">
                      <span className="w-24 truncate text-text-secondary" title={category}>
                        {category}
                      </span>
                      <div className="flex-1 h-1.5 bg-fill-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/70"
                          style={{ width: `${(probability as number) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-text-tertiary">
                        {((probability as number) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              );
            },
          },
        ]}
        rows={visibleItems}
        getRowId={(tx) => tx.id}
        lastRowRef={lastElementRef}
        emptyMessage="Нет данных"
        cardClassName="bg-background/60 backdrop-blur border-border/60 shadow-sm"
      />
    </BlurFade>
  );
};
