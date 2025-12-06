'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { MOCK_DATA } from './mockData';
import { DonutChart } from '@/shared/ui/donut-chart';
import { DashboardTable } from '@/shared/ui/server-management-table';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Target,
  Zap,
  Search,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Music,
  MoreHorizontal,
  CreditCard,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { motion } from 'framer-motion';
import { StarsBackground } from '@/shared/ui/backgrounds/stars';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/Tabs/Tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card/Card';

import { MetricCircle } from './components/MetricCircle';

// Magic UI
import NumberTicker from '@/shared/ui/magic/number-ticker';
import BlurFade from '@/shared/ui/magic/blur-fade';
import ShineBorder from '@/shared/ui/magic/shine-border';
import DotPattern from '@/shared/ui/magic/dot-pattern';
import { SparklesCore } from '@/shared/ui/magic/sparkles';
import { useTheme } from '@/shared/hooks';

// API
import { api, HealthResponse, UploadResponse } from '@/shared/api/api';
import { useDashboardContext } from '@/pages/dashboard/main/model/DashboardProvider';
import { AIChatWidget } from '@/features/ai-chat/AIChatWidget';

// --- Data Configuration ---

const MOCK_TRANSACTIONS = Array.from({ length: 50 }).map((_, i) => ({
  id: `tx-${i}`,
  title: [
    'Uber Ride',
    'Supermarket',
    'Netflix Subscription',
    'Coffee Shop',
    'Rent Payment',
    'Freelance Income',
    'Gym Membership',
    'Restaurant',
  ][i % 8],
  amount: Math.floor(Math.random() * 5000) + 150,
  date: new Date(2025, 10, 30 - i).toISOString(),
  type: i % 6 === 5 ? 'income' : 'expense',
  categoryId: ['transport', 'food', 'subscriptions', 'cafes', 'rent', 'salary', 'health', 'cafes'][
    i % 8
  ],
  probabilities: undefined as Record<string, number> | undefined,
}));

const CATEGORY_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  salary: { color: '#10b981', icon: Wallet, label: 'Зарплата' },
  food: { color: '#f59e0b', icon: ShoppingBag, label: 'Продукты' },
  cafes: { color: '#ef4444', icon: Coffee, label: 'Кафе' },
  transport: { color: '#3b82f6', icon: Car, label: 'Транспорт' },
  subscriptions: { color: '#8b5cf6', icon: Music, label: 'Подписки' },
  rent: { color: '#ec4899', icon: Home, label: 'Аренда' },
  other: { color: '#6b7280', icon: MoreHorizontal, label: 'Прочее' },
  health: { color: '#14b8a6', icon: Zap, label: 'Здоровье' },
  // Fallback map for API categories
  Food: { color: '#f59e0b', icon: ShoppingBag, label: 'Еда' },
  Misc: { color: '#6b7280', icon: MoreHorizontal, label: 'Разное' },
};

const getCategoryConfig = (catName: string) => {
  if (!catName) return { color: '#9ca3af', icon: MoreHorizontal, label: 'Неизвестно' };
  // Try exact match
  if (CATEGORY_CONFIG[catName]) return CATEGORY_CONFIG[catName];
  // Try lowercase match
  if (CATEGORY_CONFIG[catName.toLowerCase()]) return CATEGORY_CONFIG[catName.toLowerCase()];

  // Auto-generate or fallback
  return {
    color: stringToColor(catName),
    icon: MoreHorizontal,
    label: catName,
  };
};

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const TransactionList = ({
  transactions,
  filterTitle,
}: {
  transactions: any[];
  filterTitle: string;
}) => {
  const [page, setPage] = useState(1);
  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [filterTitle, transactions]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && transactions.length > page * 20) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [transactions.length, page],
  );

  const visibleItems = transactions.slice(0, page * 20);

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
            render: (tx: any) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-fill-tertiary flex items-center justify-center text-text-secondary">
                  {tx.type === 'income' ? (
                    <ArrowRight className="rotate-[-45deg] text-green-500 w-4 h-4" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className="font-medium text-foreground truncate max-w-[200px]"
                    title={tx.title}
                  >
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
            render: (tx: any) => {
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
            render: (tx: any) => (
              <span className="text-sm text-text-secondary">{formatDate(tx.date)}</span>
            ),
          },
          {
            key: 'amount',
            header: 'Сумма',
            className: 'col-span-3 text-right',
            render: (tx: any) => (
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
        getRowId={(tx: any, idx: number) => tx.id ?? `tx-${idx}`}
        lastRowRef={lastElementRef}
        emptyMessage="Ничего не найдено"
      />
    </BlurFade>
  );
};

const MLDetailsList = ({ transactions }: { transactions: any[] }) => {
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && transactions.length > page * 20) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [transactions.length, page],
  );

  const visibleItems = transactions.slice(0, page * 20);

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
            render: (tx: any) => <span className="font-medium text-foreground">{tx.title}</span>,
          },
          {
            key: 'prediction',
            header: 'Предсказание',
            className: 'col-span-3',
            render: (tx: any) => {
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
            render: (tx: any) => {
              const probs = tx.probabilities || {};
              const sortedProbs = Object.entries(probs)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 3);

              return (
                <div className="flex flex-col gap-1.5">
                  {sortedProbs.map(([cat, prob]) => (
                    <div key={cat} className="flex items-center gap-2 text-xs">
                      <span className="w-24 truncate text-text-secondary" title={cat}>
                        {cat}
                      </span>
                      <div className="flex-1 h-1.5 bg-fill-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/70"
                          style={{ width: `${(prob as number) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-text-tertiary">
                        {((prob as number) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              );
            },
          },
        ]}
        rows={visibleItems}
        getRowId={(tx: any, idx: number) => tx.id ?? `ml-${idx}`}
        lastRowRef={lastElementRef}
        emptyMessage="Нет данных"
      />
    </BlurFade>
  );
};

const MainPageAsync = () => {
  // State
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSegmentLabel, setActiveSegmentLabel] = useState<string | null>(null);
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [hoveredLegendLabel, setHoveredLegendLabel] = useState<string | null>(null);

  // Filters
  const [txFilterCategory, setTxFilterCategory] = useState<string>('all');
  const [txSearch, setTxSearch] = useState('');

  // API State
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const { apiData, user } = useDashboardContext();

  useEffect(() => {
    api.checkHealth().then(setHealth);
  }, []);

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (event: MediaQueryListEvent) => {
        setResolvedTheme(event.matches ? 'dark' : 'light');
      };
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    setResolvedTheme(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  // Data Selectors (Mock vs Real)
  const isRealData = !!apiData;
  const starColor = resolvedTheme === 'dark' ? '#FFF' : '#000';

  useEffect(() => {
    if (apiData) {
      setActiveTab('overview');
    }
  }, [apiData]);

  const currentTransactions = useMemo(() => {
    if (apiData) {
      return apiData.rows.map((row, idx) => ({
        id: `api-tx-${idx}`, // Generate ID
        title: `Операция #${row.index}`, // Fallback title or use index
        amount: row.withdrawal > 0 ? row.withdrawal : row.deposit,
        date: row.date,
        type: row.deposit > 0 ? 'income' : 'expense',
        categoryId: row.predicted_category,
        probabilities: row.probabilities,
      }));
    }
    return MOCK_TRANSACTIONS;
  }, [apiData]);

  const chartData = useMemo(() => {
    if (apiData) {
      // Map API summary to Chart Data
      return apiData.summary.by_category
        .map((c) => {
          const conf = getCategoryConfig(c.category);
          return {
            value: c.amount,
            color: conf.color,
            label: conf.label,
            categoryId: c.category,
          };
        })
        .sort((a, b) => b.value - a.value);
    }

    // Mock Fallback
    return MOCK_DATA.budgets
      .filter((b) => b.month === '2025-11')
      .map((b) => ({
        value: b.limit,
        color: CATEGORY_CONFIG[b.categoryId]?.color || '#9ca3af',
        label: CATEGORY_CONFIG[b.categoryId]?.label || b.categoryId,
        categoryId: b.categoryId,
      }))
      .sort((a, b) => b.value - a.value);
  }, [apiData]);

  const totalBudget = chartData.reduce((sum, item) => sum + item.value, 0);

  // Derived state for Donut Chart Content
  const activeChartItem = useMemo(() => {
    const displayedSegmentLabel = hoveredLegendLabel || activeSegmentLabel;
    if (displayedSegmentLabel) {
      return chartData.find((d) => d.label === displayedSegmentLabel);
    }
    return null;
  }, [activeSegmentLabel, hoveredLegendLabel, chartData]);
  const centerDisplayValue = activeChartItem ? activeChartItem.value : totalBudget;
  const centerDisplayLabel = activeChartItem ? activeChartItem.label : 'Всего';

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return currentTransactions.filter((tx) => {
      const matchesCategory = txFilterCategory === 'all' || tx.categoryId === txFilterCategory;
      const matchesSearch = tx.title.toLowerCase().includes(txSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [txFilterCategory, txSearch, currentTransactions]);

  const renderUploadPlaceholder = () => (
    <div className="p-6 border border-dashed border-border rounded-xl bg-fill-secondary/30 text-center text-text-secondary">
      <p className="font-medium">Загрузите CSV файл</p>
      <p className="text-sm text-text-tertiary mt-1">
        После загрузки появятся аналитика и детализация.
      </p>
    </div>
  );

  return (
    <StarsBackground
      starColor={starColor}
      className={cn(
        'min-h-(--main-height) bg-background overflow-x-hidden relative px-20 py-10',
        'dark:bg-[radial-gradient(ellipse_at_bottom,#262626_0%,#000_100%)]',
        'bg-[radial-gradient(ellipse_at_bottom,#f5f5f5_0%,#fff_100%)]',
      )}
    >
      {/* Background Pattern */}
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]',
          'opacity-30 dark:opacity-20 fixed inset-0 z-0 text-primary/50',
        )}
      />

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 relative z-10">
        {/* Header / Hero */}

        {/* Main Content Tabs */}
        {isRealData ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
            <BlurFade delay={0.2}>
              <TabsList className="w-full md:w-auto bg-fill-secondary/50 p-1 border border-fill-quaternary/50 backdrop-blur-sm overflow-x-auto">
                <TabsTrigger value="overview" className="flex-1 md:flex-none min-w-[120px]">
                  Обзор
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex-1 md:flex-none min-w-[120px]">
                  История
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex-1 md:flex-none min-w-[120px]">
                  Цели
                </TabsTrigger>
                {apiData && (
                  <TabsTrigger value="ml_details" className="flex-1 md:flex-none min-w-[120px]">
                    ML Детализация
                  </TabsTrigger>
                )}
                {apiData && (
                  <TabsTrigger value="metrics" className="flex-1 md:flex-none min-w-[120px]">
                    ML Метрики
                  </TabsTrigger>
                )}
              </TabsList>
            </BlurFade>

            {/* If we have API Data, show Meta stats in a responsive grid atop content */}
            {apiData && (
              <BlurFade delay={0.25} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-background/60 backdrop-blur border rounded-xl p-4 flex flex-col">
                  <span className="text-xs text-text-tertiary uppercase font-bold">
                    Строк всего
                  </span>
                  <span className="text-2xl font-bold">
                    <NumberTicker value={apiData.meta.total_rows} />
                  </span>
                </div>
                <div className="bg-background/60 backdrop-blur border rounded-xl p-4 flex flex-col">
                  <span className="text-xs text-text-tertiary uppercase font-bold">Обработано</span>
                  <span className="text-2xl font-bold text-green-600">
                    <NumberTicker value={apiData.meta.processed_rows} />
                  </span>
                </div>
                <div className="bg-background/60 backdrop-blur border rounded-xl p-4 flex flex-col">
                  <span className="text-xs text-text-tertiary uppercase font-bold">Ошибки</span>
                  <span
                    className={cn(
                      'text-2xl font-bold',
                      apiData.meta.failed_rows > 0 ? 'text-red-500' : 'text-text-secondary',
                    )}
                  >
                    <NumberTicker value={apiData.meta.failed_rows} />
                  </span>
                </div>
                <div className="bg-background/60 backdrop-blur border rounded-xl p-4 flex flex-col">
                  <span className="text-xs text-text-tertiary uppercase font-bold">
                    Версия Модели
                  </span>
                  <span className="text-sm font-medium truncate mt-1">
                    {apiData.meta.model_type}
                  </span>
                </div>
              </BlurFade>
            )}

            {/* TAB: OVERVIEW */}
            <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
              {isRealData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BlurFade delay={0.6} className="lg:col-span-2">
                    <Card className="bg-background/60 backdrop-blur border border-border/60 shadow-sm h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                            <Target className="w-4 h-4" />
                          </div>
                          Анализ Расходов
                        </CardTitle>
                        <CardDescription>
                          Распределение фактических трат по категориям
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col xl:flex-row items-center justify-around gap-8 py-4 px-2">
                          <div className="relative shrink-0 group filter transition-all duration-300">
                            <DonutChart
                              data={chartData}
                              size={260}
                              strokeWidth={24}
                              activeSegmentLabel={hoveredLegendLabel || activeSegmentLabel}
                              onSegmentHover={(seg) =>
                                setActiveSegmentLabel(seg ? seg.label : null)
                              }
                              centerContent={
                                <motion.div
                                  key={activeChartItem ? activeChartItem.label : 'total'}
                                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  className="text-center flex flex-col items-center"
                                >
                                  <span className="text-sm text-text-secondary font-medium dark:text-text-tertiary">
                                    {centerDisplayLabel}
                                  </span>
                                  <div
                                    className={cn(
                                      'text-2xl font-bold tracking-tight tabular-nums',
                                      activeChartItem ? 'text-primary' : 'text-foreground',
                                    )}
                                  >
                                    <div className="flex items-baseline gap-1">
                                      <NumberTicker value={centerDisplayValue} delay={0} />
                                      <span className="text-sm font-semibold text-text-tertiary">
                                        ₽
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              }
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full xl:w-auto overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                            {chartData.map((item) => {
                              const isActive =
                                (hoveredLegendLabel || activeSegmentLabel) === item.label;
                              return (
                                <motion.button
                                  key={item.categoryId + item.label}
                                  whileHover={{ scale: 1.02, x: 2 }}
                                  whileTap={{ scale: 0.98 }}
                                  onMouseEnter={() => setHoveredLegendLabel(item.label)}
                                  onMouseLeave={() => setHoveredLegendLabel(null)}
                                  className={cn(
                                    'flex items-center justify-between gap-4 p-3 rounded-xl border transition-all text-left min-w-[170px]',
                                    isActive
                                      ? 'bg-primary/5 border-primary/50 shadow-md shadow-primary/10'
                                      : 'bg-background/50 border-border/40 hover:bg-fill-secondary',
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={cn(
                                        'w-2.5 h-2.5 rounded-full shadow-sm ring-2 transition-all',
                                        isActive
                                          ? 'ring-offset-2 ring-primary scale-110'
                                          : 'ring-transparent',
                                      )}
                                      style={{ backgroundColor: item.color }}
                                    />
                                    <span
                                      className={cn(
                                        'text-sm font-medium transition-colors truncate max-w-[100px]',
                                        isActive ? 'text-primary' : 'text-foreground',
                                      )}
                                    >
                                      {item.label}
                                    </span>
                                  </div>
                                  <span className="text-xs font-semibold text-text-secondary bg-fill-tertiary px-1.5 py-0.5 rounded">
                                    {totalBudget > 0
                                      ? Math.round((item.value / totalBudget) * 100)
                                      : 0}
                                    %
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </BlurFade>
                </div>
              ) : (
                renderUploadPlaceholder()
              )}
            </TabsContent>

            {/* TAB: TRANSACTIONS */}
            <TabsContent
              value="transactions"
              className="space-y-6 focus-visible:outline-none relative z-10"
            >
              {isRealData ? (
                <TransactionList filterTitle={txSearch} transactions={filteredTransactions} />
              ) : (
                renderUploadPlaceholder()
              )}
            </TabsContent>

            {/* TAB: GOALS */}
            <TabsContent
              value="goals"
              className="space-y-6 focus-visible:outline-none bg-background/60 backdrop-blur"
            >
              {isRealData ? (
                <div className="p-4 rounded-xl border border-dashed border-border text-center text-text-tertiary">
                  Функционал целей доступен в расширенной версии.
                </div>
              ) : (
                renderUploadPlaceholder()
              )}
            </TabsContent>
            {/* TAB: ML DETAILS (NEW) */}
            {isRealData && (
              <TabsContent value="ml_details" className="space-y-6 focus-visible:outline-none">
                <MLDetailsList transactions={currentTransactions} />
              </TabsContent>
            )}

            {/* TAB: METRICS (Simplified) */}
            {apiData && apiData.metrics && (
              <TabsContent value="metrics" className="space-y-6 focus-visible:outline-none">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <MetricCircle
                    value={apiData.metrics.accuracy || 0}
                    label="Accuracy"
                    sublabel="Общая точность"
                    theme="success"
                    index={0}
                  />
                  <MetricCircle
                    value={apiData.metrics.macro_f1 || 0}
                    label="Macro F1"
                    sublabel="Среднее F1"
                    theme="info"
                    index={1}
                  />
                  <MetricCircle
                    value={apiData.metrics.balanced_accuracy || 0}
                    label="Balanced Acc."
                    sublabel="Сбалансированная"
                    theme="orange"
                    index={2}
                  />
                  {/* Placeholder or hidden if not needed */}
                </div>
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <BlurFade delay={0.2} className="w-full">
            {renderUploadPlaceholder()}
          </BlurFade>
        )}
      </div>
      <AIChatWidget />
    </StarsBackground>
  );
};

export default MainPageAsync;
