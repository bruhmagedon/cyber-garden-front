import { useState } from 'react';
import { Button, Input, Label, Select } from '@/shared/ui';
import { 
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/shared/ui/Select/Select';
import { Goal } from '../../model/useGoals';

interface AddGoalFormProps {
  onSubmit: (goal: Omit<Goal, 'id'>) => void;
  onCancel: () => void;
}

export const AddGoalForm = ({ onSubmit, onCancel }: AddGoalFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    targetDate: '',
    currentAmount: '',
    targetAmount: '',
    priority: 'MEDIUM' as Goal['priority'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      targetDate: formData.targetDate,
      currentAmount: Number(formData.currentAmount),
      targetAmount: Number(formData.targetAmount),
      priority: formData.priority,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Название цели</Label>
        <Input
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Например: Поездка в Европу"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="targetDate">Дата выполнения</Label>
        <Input
          id="targetDate"
          type="date"
          required
          value={formData.targetDate}
          onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="currentAmount">Сейчас накоплено</Label>
          <Input
            id="currentAmount"
            type="number"
            min="0"
            required
            value={formData.currentAmount}
            onChange={(e) =>
              setFormData({ ...formData, currentAmount: e.target.value })
            }
            placeholder="0"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="targetAmount">Цель (сумма)</Label>
          <Input
            id="targetAmount"
            type="number"
            min="1"
            required
            value={formData.targetAmount}
            onChange={(e) =>
              setFormData({ ...formData, targetAmount: e.target.value })
            }
            placeholder="100000"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Приоритет</Label>
        <Select
          value={formData.priority}
          onValueChange={(value) =>
            setFormData({ ...formData, priority: value as Goal['priority'] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите приоритет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HIGH">Высокий</SelectItem>
            <SelectItem value="MEDIUM">Средний</SelectItem>
            <SelectItem value="LOW">Низкий</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" variant="primary">
          Добавить цель
        </Button>
      </div>
    </form>
  );
};
