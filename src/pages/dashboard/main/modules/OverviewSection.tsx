import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card/Card';
import { DonutChart } from '@/shared/ui/donut-chart';
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
}: OverviewSectionProps) => (
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
          <CardDescription>Распределение фактических трат по категориям</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col xl:flex-row items-center justify-around gap-8 py-4 px-2">
            <div className="relative shrink-0 group filter transition-all duration-300">
              <DonutChart
                data={chartData}
                size={260}
                strokeWidth={24}
                activeSegmentLabel={hoveredLegendLabel || activeSegmentLabel}
                onSegmentHover={(segment) => onSegmentHover(segment ? segment.label : null)}
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
                        <span className="text-sm font-semibold text-text-tertiary">₽</span>
                      </div>
                    </div>
                  </motion.div>
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full xl:w-auto overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {chartData.map((item) => {
                const isActive = (hoveredLegendLabel || activeSegmentLabel) === item.label;
                return (
                  <motion.button
                    key={item.categoryId + item.label}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => onLegendHover(item.label)}
                    onMouseLeave={() => onLegendHover(null)}
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
                          isActive ? 'ring-offset-2 ring-primary scale-110' : 'ring-transparent',
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
                      {totalBudget > 0 ? Math.round((item.value / totalBudget) * 100) : 0}%
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
);
