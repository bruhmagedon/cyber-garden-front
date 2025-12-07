import { Goal } from '../../model/useGoals';
import { Target } from 'lucide-react';
import { cn } from '@/shared/utils';

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  const percentage = Math.min(
    100,
    Math.round((goal.currentAmount / goal.targetAmount) * 100)
  );

  const priorityColors = {
    HIGH: 'text-red-500 bg-red-500/10 border-red-500/20',
    MEDIUM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    LOW: 'text-green-500 bg-green-500/10 border-green-500/20',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  return (
    <div className="relative flex flex-col gap-4 rounded-[20px] border border-white/5 bg-[#151515] p-6 shadow-xl transition-transform hover:scale-[1.01]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Target className="h-6 w-6" />
          </div>
        </div>
        <div
          className={cn(
            'rounded-lg border px-2.5 py-1 text-[10px] font-bold tracking-wider',
            priorityColors[goal.priority]
          )}
        >
          {goal.priority}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold leading-tight text-white">
          {goal.title}
        </h3>
        <p className="text-sm font-medium text-muted-foreground">
          Цель: к {new Date(goal.targetDate).toLocaleDateString('ru-RU')}
        </p>
      </div>

      {/* Amounts */}
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-white">
          {formatCurrency(goal.currentAmount)}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          из {formatCurrency(goal.targetAmount)} ₽
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/30">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-right text-xs font-medium text-muted-foreground">
          {percentage}% выполнено
        </div>
      </div>
    </div>
  );
};
