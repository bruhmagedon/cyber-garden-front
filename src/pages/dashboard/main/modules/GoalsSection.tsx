import { useState } from 'react';
import { Plus } from 'lucide-react';
import { 
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogTitle, 
  Button
} from '@/shared/ui';
import { useGoals } from '@/features/goals/model/useGoals';
import { GoalCard } from '@/features/goals/ui/GoalCard/GoalCard';
import { AddGoalForm } from '@/features/goals/ui/AddGoalForm/AddGoalForm';

type GoalsSectionProps = {
  hasData: boolean;
};

export const GoalsSection = ({ hasData }: GoalsSectionProps) => {
  const { goals, addGoal } = useGoals();
  const [isOpen, setIsOpen] = useState(false);

  // If hasData is strictly required to show anything, we might keep the check.
  // However, the user wants this to be the goals widget area.
  // Assuming we always want to show the goals widget now, ignoring hasData for the widget visibility itself,
  // or maybe hasData was about backend data? 
  // The original code showed a placeholder if hasData was true? No, it showed placeholder if hasData was true.
  // "Functional goals available in extended version" was the text.
  // I will replace it entirely with the goals widget.

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white">Цели</h2>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}

        {/* Placeholder Button Card */}
        <button
           onClick={() => setIsOpen(true)}
           className="group flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-[20px] border-2 border-dashed border-white/10 bg-transparent p-6 transition-all hover:border-white/20 hover:bg-white/5 active:scale-[0.99]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-white/10">
            <Plus className="h-6 w-6 text-white/50 group-hover:text-white" />
          </div>
          <span className="font-medium text-muted-foreground group-hover:text-white">
            Добавить цель
          </span>
        </button>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogPanel>
          <DialogHeader>
            <DialogTitle>Новая цель</DialogTitle>
          </DialogHeader>
          <AddGoalForm 
            onSubmit={(g) => {
              addGoal(g);
              setIsOpen(false);
            }}
            onCancel={() => setIsOpen(false)}
          />
        </DialogPanel>
      </Dialog>
    </div>
  );
};
