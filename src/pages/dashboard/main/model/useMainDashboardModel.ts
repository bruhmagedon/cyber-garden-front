import { useEffect, useMemo, useState } from 'react';
import { MOCK_DATA } from '@/pages/dashboard/main/mockData';
import { api, HealthResponse, UploadResponse } from '@/shared/api/api';
import { useDashboardContext } from './DashboardProvider';
import { useTheme } from '@/shared/hooks';
import { CATEGORY_CONFIG, getCategoryConfig } from '@/shared/utils';

export type DashboardTab = 'overview' | 'transactions' | 'goals' | 'ml_details' | 'metrics';

export type TransactionItem = {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  categoryId: string;
  probabilities?: Record<string, number>;
};

export type ChartSlice = {
  value: number;
  color: string;
  label: string;
  categoryId: string;
};

const MOCK_TRANSACTIONS: TransactionItem[] = Array.from({ length: 50 }).map((_, idx) => {
  const categoryId = ['transport', 'food', 'subscriptions', 'cafes', 'rent', 'salary', 'health'][
    idx % 7
  ];
  const amount = Math.floor(Math.random() * 5000) + 150;
  const type = idx % 6 === 5 ? 'income' : 'expense';

  return {
    id: `tx-${idx}`,
    title: [
      'Uber Ride',
      'Supermarket',
      'Netflix Subscription',
      'Coffee Shop',
      'Rent Payment',
      'Freelance Income',
      'Gym Membership',
      'Restaurant',
    ][idx % 8],
    amount,
    date: new Date(2025, 10, 30 - idx).toISOString(),
    type,
    categoryId,
    probabilities: undefined,
  };
});

const mapApiTransactions = (data: UploadResponse | null): TransactionItem[] => {
  if (!data) {
    return MOCK_TRANSACTIONS;
  }
  return data.rows.map((row, index) => ({
    id: `api-tx-${index}`,
    title: `Операция #${row.index}`,
    amount: row.withdrawal > 0 ? row.withdrawal : row.deposit,
    date: row.date,
    type: row.deposit > 0 ? 'income' : 'expense',
    categoryId: row.predicted_category,
    probabilities: row.probabilities,
  }));
};

const mapChartData = (data: UploadResponse | null): ChartSlice[] => {
  if (!data) {
    return MOCK_DATA.budgets
      .filter((budget) => budget.month === '2025-11')
      .map((budget) => ({
        value: budget.limit,
        color: CATEGORY_CONFIG[budget.categoryId]?.color ?? '#9ca3af',
        label: CATEGORY_CONFIG[budget.categoryId]?.label ?? budget.categoryId,
        categoryId: budget.categoryId,
      }));
  }

  return (data.summary?.by_category ?? [])
    .map((category) => {
      const config = getCategoryConfig(category.category);
      return {
        value: category.amount,
        color: config.color,
        label: config.label,
        categoryId: category.category,
      };
    })
    .sort((a, b) => b.value - a.value);
};

export const useMainDashboardModel = () => {
  const { apiData, user } = useDashboardContext();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [activeSegmentLabel, setActiveSegmentLabel] = useState<string | null>(null);
  const [hoveredLegendLabel, setHoveredLegendLabel] = useState<string | null>(null);
  const [txFilterCategory, setTxFilterCategory] = useState<string>('all');
  const [txSearch, setTxSearch] = useState('');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [health, setHealth] = useState<HealthResponse | null>(null);

  // Filters for Overview Chart
  const [overviewYear, setOverviewYear] = useState<string>('');
  const [overviewMonth, setOverviewMonth] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    api.checkHealth().then((response) => {
      if (isMounted) {
        setHealth(response);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (event: MediaQueryListEvent) =>
        setResolvedTheme(event.matches ? 'dark' : 'light');
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    setResolvedTheme(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  // Reset filters when data changes
  useEffect(() => {
    if (apiData) {
      setActiveTab('overview');
      // Set default to latest year/month WITH EXPENSES
      const expenseRows = apiData.rows.filter(r => r.withdrawal > 0);
      const rowsToUse = expenseRows.length > 0 ? expenseRows : apiData.rows;
      
      const dates = rowsToUse.map(r => new Date(r.date));
      if (dates.length > 0) {
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
        setOverviewYear(maxDate.getFullYear().toString());
        setOverviewMonth((maxDate.getMonth() + 1).toString());
      } else {
        const now = new Date();
        setOverviewYear(now.getFullYear().toString());
        setOverviewMonth((now.getMonth() + 1).toString());
      }
    }
  }, [apiData]);

  const currentTransactions = useMemo(() => mapApiTransactions(apiData), [apiData]);

  // Extract available years (only with expenses)
  const availableYears = useMemo(() => {
      if (!apiData) return [];
      const years = new Set<number>();
      apiData.rows.forEach(r => {
          if (r.withdrawal > 0) {
              years.add(new Date(r.date).getFullYear());
          }
      });
      return Array.from(years).sort((a, b) => b - a).map(String);
  }, [apiData]);

  // Extract available months for the selected year
  const availableMonths = useMemo(() => {
      if (!apiData || !overviewYear) return [];
      const months = new Set(
          apiData.rows
            .filter(r => new Date(r.date).getFullYear().toString() === overviewYear)
            .map(r => new Date(r.date).getMonth() + 1)
      );
      return Array.from(months).sort((a, b) => b - a).map(String);
  }, [apiData, overviewYear]);


  // Client-side aggregation for Donut Chart
  const chartData = useMemo(() => {
      if (!apiData) {
           return mapChartData(null); // Fallback to mock
      }

      // Filter rows
      const filteredRows = apiData.rows.filter(row => {
          const d = new Date(row.date);
          return d.getFullYear().toString() === overviewYear && (d.getMonth() + 1).toString() === overviewMonth;
      });

      // Aggregate expenses by category
      const categoryMap = new Map<string, number>();
      filteredRows.forEach(row => {
          // Check if it's an expense (using withdrawal > 0 from api logic or type logic)
          // Based on mapApiTransactions: amount = withdrawal > 0 ? withdrawal : deposit. type = deposit > 0 ? income : expense.
          // We only want expenses for the donut chart usually?
          // Looking at mapChartData original, it used Summary which usually implies expenses for budget charts.
          // Let's assume we sum withdrawals.
          if (row.withdrawal > 0) {
             const cat = row.actual_category || row.predicted_category || 'Uncategorized';
             categoryMap.set(cat, (categoryMap.get(cat) || 0) + row.withdrawal);
          }
      });

      // Map to ChartSlice
      const entries = Array.from(categoryMap.entries()).map(([cat, value]) => {
          const config = getCategoryConfig(cat);
          return {
              value: value,
              color: config.color,
              label: cat, // Use category name directly or mapped label if exists in config
              categoryId: cat,
          };
      });
      
      return entries.sort((a, b) => b.value - a.value);

  }, [apiData, overviewYear, overviewMonth]);


  const totalBudget = useMemo(
    () => chartData.reduce((sum, slice) => sum + slice.value, 0),
    [chartData],
  );

  const activeChartItem = useMemo(() => {
    const label = hoveredLegendLabel || activeSegmentLabel;
    if (!label) {
      return null;
    }
    return chartData.find((slice) => slice.label === label) ?? null;
  }, [activeSegmentLabel, chartData, hoveredLegendLabel]);

  const centerDisplayValue = activeChartItem ? activeChartItem.value : totalBudget;
  const centerDisplayLabel = activeChartItem ? activeChartItem.label : 'Всего';

  const filteredTransactions = useMemo(() => {
    return currentTransactions.filter((transaction) => {
      const matchesCategory =
        txFilterCategory === 'all' || transaction.categoryId === txFilterCategory;
      const matchesSearch = transaction.title
        .toLowerCase()
        .includes(txSearch.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [currentTransactions, txFilterCategory, txSearch]);

  const isRealData = Boolean(apiData);
  const starColor = resolvedTheme === 'dark' ? '#FFF' : '#000';

  return {
    apiData,
    user,
    health,
    activeTab,
    setActiveTab,
    activeSegmentLabel,
    setActiveSegmentLabel,
    hoveredLegendLabel,
    setHoveredLegendLabel,
    txFilterCategory,
    setTxFilterCategory,
    txSearch,
    setTxSearch,
    resolvedTheme,
    starColor,
    currentTransactions,
    filteredTransactions,
    chartData,
    totalBudget,
    activeChartItem,
    centerDisplayValue,
    centerDisplayLabel,
    isRealData,
    // New exports
    overviewYear,
    setOverviewYear,
    overviewMonth,
    setOverviewMonth,
    availableYears,
    availableMonths,
  };
};
