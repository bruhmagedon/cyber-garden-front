import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card/Card';
import { DonutChart } from '@/shared/ui/donut-chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select/Select';
import BlurFade from '@/shared/ui/magic/blur-fade';
import NumberTicker from '@/shared/ui/magic/number-ticker';
import { cn } from '@/shared/utils';
import type { ChartSlice } from '../model/useMainDashboardModel';

type OverviewSectionProps = {
  chartData: ChartSlice[];
  totalBudget: number;
  activeSegmentLabel: string | null;
  hoveredLegendLabel: string | null;
  onSegmentHover: (label: string | null) => void;
  onLegendHover: (label: string | null) => void;
  activeChartItem: ChartSlice | null;
  centerDisplayValue: number;
  centerDisplayLabel: string;
  // Filters
  selectedYear: string;
  onYearChange: (val: string) => void;
  selectedMonth: string;
  onMonthChange: (val: string) => void;
  years: string[];
  months: string[];
};

export const OverviewSection = ({
  chartData,
  totalBudget,
  activeSegmentLabel,
  hoveredLegendLabel,
  onSegmentHover,
  onLegendHover,
  activeChartItem,
  centerDisplayValue,
  centerDisplayLabel,
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
  years,
  months
}: OverviewSectionProps) => {
    const formatMonth = (m: string) => {
        if (m === 'all') return 'Весь год';
        return new Date(2000, parseInt(m) - 1).toLocaleString('ru-RU', { month: 'long' });
    };

    // --- Spending Suggestions Logic ---
    const topCategory = chartData.length > 0 ? chartData[0] : null;
    const suggestions = [
        topCategory ? {
            title: 'Анализ топ-категории',
            text: `Больше всего вы тратите на "${topCategory.label}". Попробуйте установить лимит.`,
            icon: Target,
            color: 'text-primary'
        } : null,
        {
            title: 'Накопления',
            text: 'Рекомендуем откладывать 10% от дохода в "Подушку безопасности".',
            icon: Target, // Or PiggyBank if available
            color: 'text-emerald-500' // green
        },
        /*
        {
           title: 'Подписки',
           text: 'Проверьте регулярные списания, возможно есть неиспользуемые сервисы.',
           icon: Target,
           color: 'text-orange-500'
        }
        */
    ].filter(Boolean);


    return (
  <div className="grid grid-cols-1 gap-6">
    <BlurFade delay={0.6}>
      <Card className="bg-background/60 backdrop-blur border border-border/60 shadow-sm h-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                    <Target className="w-4 h-4" />
                    </div>
                    Анализ Расходов
                </CardTitle>
                <CardDescription>Распределение фактических трат по категориям</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                   <Select value={selectedYear} onValueChange={onYearChange}>
                        <SelectTrigger className="w-[90px] h-8 text-xs">
                            <SelectValue placeholder="Год" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(y => (
                                <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedMonth} onValueChange={onMonthChange}>
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue placeholder="Месяц" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map(m => (
                                <SelectItem key={m} value={m}>{formatMonth(m)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
              </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Column: Chart & Legend */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                     <div className="flex items-center justify-center py-4">
                        <DonutChart
                          data={chartData}
                          onSegmentHover={(segment) => onSegmentHover(segment ? segment.label : null)}
                          activeSegmentLabel={activeSegmentLabel}
                          centerContent={
                            <motion.div
                                key={activeSegmentLabel || 'total'}
                                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="text-center flex flex-col items-center"
                            >
                                <span className="text-xs text-text-secondary font-medium dark:text-text-tertiary">
                                {centerDisplayLabel}
                                </span>
                                <div
                                className={cn(
                                    'text-xl font-bold tracking-tight tabular-nums',
                                    activeSegmentLabel ? 'text-primary' : 'text-foreground',
                                )}
                                >
                                <div className="flex items-baseline gap-1">
                                    <NumberTicker value={centerDisplayValue} delay={0} />
                                    <span className="text-xs font-semibold text-text-tertiary">₽</span>
                                </div>
                                </div>
                            </motion.div>
                          }
                        />
                     </div>
                     
                     {/* Legend Below */}
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {chartData.map((item, index) => {
                           const isActive = activeSegmentLabel === item.label;
                           return (
                           <motion.div
                             key={item.label}
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.1 * index }}
                             className={cn(
                               "flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer",
                               isActive 
                                 ? "bg-primary/5 border-primary/50 shadow-md shadow-primary/10 scale-[1.02]" 
                                 : "bg-background/50 border-border/40 hover:bg-muted/50"
                             )}
                             onMouseEnter={() => {
                                 onLegendHover(item.label);
                                 onSegmentHover(item.label);
                             }}
                             onMouseLeave={() => {
                                 onLegendHover(null);
                                 onSegmentHover(null);
                             }}
                           >
                             <div 
                                className={cn(
                                  "w-2.5 h-2.5 rounded-full shrink-0 transition-all",
                                  isActive ? "ring-2 ring-offset-2 ring-primary scale-110" : "ring-0"
                                )}
                                style={{ backgroundColor: item.color }}
                             />
                             <div className="flex flex-col min-w-0">
                                <span className={cn(
                                    "text-[11px] font-medium truncate transition-colors",
                                    isActive ? "text-primary" : "text-foreground"
                                )}>{item.label}</span>
                                <span className="text-[10px] text-muted-foreground">
                                    {Math.round((item.value / totalBudget) * 100)}%
                                </span>
                             </div>
                           </motion.div>
                           );
                        })}
                     </div>
                </div>

                {/* Right Column: Suggestions */}
                <div className="lg:col-span-2 border-t lg:border-l lg:border-t-0 border-border/60 pl-0 lg:pl-8 pt-6 lg:pt-0">
                    <h3 className="text-base font-semibold mb-6 flex items-center gap-2">
                         <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                             <Target className="w-4 h-4 text-emerald-500" />
                         </div>
                         Рекомендации
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        {suggestions.map((s, i) => s && (
                            <div key={i} className="p-4 bg-muted/30 rounded-xl border border-border/40 hover:border-border/80 transition-colors">
                                <div className="flex flex-col gap-3">
                                    <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg bg-background shadow-sm", s.color)}>
                                        <s.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium mb-1.5">{s.title}</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {s.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                        
                    {!topCategory && (
                        <div className="p-4 text-center text-xs text-muted-foreground">
                            Нет данных о расходах за выбранный период для формирования советов.
                        </div>
                    )}
                </div>
            </div>
        </CardContent>
      </Card>
    </BlurFade>
  </div>
);
};
