'use client';

import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card/Card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/shared/ui/line-charts-1';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select/Select';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import BlurFade from '@/shared/ui/magic/blur-fade';
import type { TransactionRow } from '@/shared/api/api';

// --- Types ---
interface TrendsSectionProps {
  transactions: TransactionRow[];
}

// --- Chart Configs ---
const incomeExpenseConfig = {
  income: {
    label: 'Приход',
    color: '#10b981', // green-500
    icon: TrendingUp,
  },
  expense: {
    label: 'Расход',
    color: '#ef4444', // red-500
    icon: TrendingDown,
  },
} satisfies ChartConfig;

const comparisonConfig = {
  current: {
    label: 'Текущий месяц',
    color: '#2563eb', // blue-600
  },
  previous: {
    label: 'Прошлый месяц',
    color: '#94a3b8', // slate-400
  },
} satisfies ChartConfig;

// --- Helpers (Native Date) ---
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const parseDate = (str: string) => new Date(str);
const formatDateYM = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
};
const formatMonthName = (month: number) => {
    return new Date(2000, month).toLocaleString('ru-RU', { month: 'long' });
};

export const TrendsSection = ({ transactions }: TrendsSectionProps) => {
  // Initialize with the most recent transaction date (prioritize expenses)
  const [selectedYear, setSelectedYear] = useState<string>(() => {
      const expenseTrans = transactions.filter(t => t.withdrawal > 0);
      const transToUse = expenseTrans.length > 0 ? expenseTrans : transactions;
      
      if (transToUse.length > 0) {
          const dates = transToUse.map(t => new Date(t.date).getFullYear());
          return Math.max(...dates).toString();
      }
      return new Date().getFullYear().toString();
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
       const expenseTrans = transactions.filter(t => t.withdrawal > 0);
       const transToUse = expenseTrans.length > 0 ? expenseTrans : transactions;

       if (transToUse.length > 0) {
          const dates = transToUse.map(t => new Date(t.date));
          const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
          return (maxDate.getMonth() + 1).toString(); // 1-12
      }
      return (new Date().getMonth() + 1).toString();
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Computed Available Years (only with expenses)
  const years = useMemo(() => {
      const ys = new Set<number>();
      transactions.forEach(t => {
          if (t.withdrawal > 0) {
              ys.add(new Date(t.date).getFullYear());
          }
      });
      return Array.from(ys).sort((a, b) => b - a).map(String);
  }, [transactions]);

  // Computed Available Months for selected Year
  const months = useMemo(() => {
      const ms = new Set(
          transactions
            .filter(t => new Date(t.date).getFullYear().toString() === selectedYear)
            .map(t => new Date(t.date).getMonth() + 1)
      );
      return Array.from(ms).sort((a, b) => b - a).map(String);
  }, [transactions, selectedYear]);


  // Ensure selected month is valid when year changes
  useMemo(() => {
      if (!months.includes(selectedMonth) && months.length > 0) {
          setSelectedMonth(months[0]);
      }
  }, [months, selectedMonth]);


  // --- Data Processing 1: Income vs Expense (Filtered Month) ---
  const chart1Data = useMemo(() => {
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth); // 1-12
    const daysCount = getDaysInMonth(year, month - 1);
    const days = Array.from({ length: daysCount }, (_, i) => i + 1);
    
    // Filter transactions by month and category
    const filtered = transactions.filter(t => {
      const d = parseDate(t.date);
      const isMonthMatch = d.getFullYear() === year && d.getMonth() === (month - 1);
      const category = t.actual_category || t.predicted_category;
      const isCategoryMatch = selectedCategory === 'all' || category === selectedCategory;
      return isMonthMatch && isCategoryMatch;
    });

    // Group by day
    return days.map(day => {
      const dayTrans = filtered.filter(t => parseDate(t.date).getDate() === day);
      const income = dayTrans.reduce((sum, t) => sum + (t.deposit || 0), 0);
      const expense = dayTrans.reduce((sum, t) => sum + (t.withdrawal || 0), 0);
      return { day, income, expense };
    });
  }, [transactions, selectedYear, selectedMonth, selectedCategory]);

  // --- Data Processing 2 & 3: Comparison (Selected Month vs Previous Month) ---
  const { incomeComparisonData, expenseComparisonData } = useMemo(() => {
    const year = parseInt(selectedYear);
    const monthIdx = parseInt(selectedMonth) - 1; // 0-11
    
    const prevDate = new Date(year, monthIdx - 1);
    const prevYear = prevDate.getFullYear();
    const prevMonthIdx = prevDate.getMonth();

    // Max days to show
    const daysCount = Math.max(getDaysInMonth(year, monthIdx), getDaysInMonth(prevYear, prevMonthIdx));
    const days = Array.from({ length: daysCount }, (_, i) => i + 1);

    const data = days.map(day => {
        // Current Month Data
        const currentTrans = transactions.filter(t => {
            const d = parseDate(t.date);
            return d.getFullYear() === year && d.getMonth() === monthIdx && d.getDate() === day;
        });
        
        // Previous Month Data
        const prevTrans = transactions.filter(t => {
            const d = parseDate(t.date);
            return d.getFullYear() === prevYear && d.getMonth() === prevMonthIdx && d.getDate() === day;
        });

        const currentIncome = currentTrans.reduce((acc, t) => acc + (t.deposit || 0), 0);
        const currentExpense = currentTrans.reduce((acc, t) => acc + (t.withdrawal || 0), 0);
        const prevIncome = prevTrans.reduce((acc, t) => acc + (t.deposit || 0), 0);
        const prevExpense = prevTrans.reduce((acc, t) => acc + (t.withdrawal || 0), 0);

        return {
            day,
            currentIncome,
            currentExpense,
            prevIncome,
            prevExpense
        };
    });

    return {
        incomeComparisonData: data.map(d => ({ day: d.day, current: d.currentIncome, previous: d.prevIncome })),
        expenseComparisonData: data.map(d => ({ day: d.day, current: d.currentExpense, previous: d.prevExpense }))
    };
  }, [transactions, selectedYear, selectedMonth]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.actual_category || t.predicted_category).filter(Boolean));
    return Array.from(cats).sort();
  }, [transactions]);




  return (
    <div className="space-y-6">
      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* --- Chart 1: Income vs Expense --- */}
            <Card className="lg:col-span-2 bg-background/60 backdrop-blur border border-border/60 shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5">
                    <div className="space-y-1 text-center sm:text-left">
                        <CardTitle className="flex items-center gap-2 justify-center sm:justify-start">
                            <Calendar className="w-5 h-5 text-primary" />
                            Динамика финансов
                        </CardTitle>
                        <CardDescription>Приходы и расходы по дням за выбранный период</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Year Select */}
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-[100px] h-9">
                                <SelectValue placeholder="Год" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map(y => (
                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Month Select */}
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[140px] h-9">
                                <SelectValue placeholder="Месяц" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map(m => (
                                    <SelectItem key={m} value={m}>
                                        {formatMonthName(parseInt(m) - 1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Category Select */}
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[160px] h-9">
                                <SelectValue placeholder="Категория" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все категории</SelectItem>
                                {categories.map(c => (
                                    <SelectItem key={c} value={c as string}>{c as string}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                    <ChartContainer config={incomeExpenseConfig} className="aspect-auto h-[300px] w-full">
                        <AreaChart data={chart1Data} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.5} />
                            <XAxis 
                                dataKey="day" 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={8}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                            />
                            <YAxis 
                                hide 
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <defs>
                                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-expense)" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                dataKey="expense"
                                type="monotone"
                                fill="url(#fillExpense)"
                                stroke="var(--color-expense)"
                                strokeWidth={2}
                                stackId="1"
                            />
                            <Area
                                dataKey="income"
                                type="monotone"
                                fill="url(#fillIncome)"
                                fillOpacity={0.4}
                                stroke="var(--color-income)"
                                strokeWidth={2}
                                stackId="2"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* --- Chart 2: Income Comparison --- */}
             <Card className="bg-background/60 backdrop-blur border border-border/60 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Сравнение: Приходы</CardTitle>
                    <CardDescription className="text-xs">Выбранный месяц vs Предыдущий</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={comparisonConfig} className="aspect-auto h-[200px] w-full">
                        <LineChart data={incomeComparisonData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.3} />
                             <XAxis 
                                dataKey="day" 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={8}
                                minTickGap={32}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Line 
                                dataKey="current" 
                                type="monotone" 
                                stroke="var(--color-current)" 
                                strokeWidth={2} 
                                dot={false}
                            />
                             <Line 
                                dataKey="previous" 
                                type="monotone" 
                                stroke="var(--color-previous)" 
                                strokeWidth={2} 
                                strokeDasharray="4 4"
                                dot={false}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </LineChart>
                     </ChartContainer>
                </CardContent>
            </Card>

            {/* --- Chart 3: Expense Comparison --- */}
             <Card className="bg-background/60 backdrop-blur border border-border/60 shadow-sm">
                <CardHeader>
                     <CardTitle className="text-base font-semibold">Сравнение: Расходы</CardTitle>
                    <CardDescription className="text-xs">Выбранный месяц vs Предыдущий</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={comparisonConfig} className="aspect-auto h-[200px] w-full">
                        <LineChart data={expenseComparisonData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.3} />
                             <XAxis 
                                dataKey="day" 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={8}
                                minTickGap={32}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Line 
                                dataKey="current" 
                                type="monotone" 
                                stroke="#ef4444" 
                                strokeWidth={2} 
                                dot={false}
                            />
                             <Line 
                                dataKey="previous" 
                                type="monotone" 
                                stroke="var(--color-previous)" 
                                strokeWidth={2} 
                                strokeDasharray="4 4"
                                dot={false}
                            />
                             <ChartLegend content={<ChartLegendContent />} />
                        </LineChart>
                     </ChartContainer>
                </CardContent>
            </Card>
        </div>
      </BlurFade>
    </div>
  );
};
