import { useState, useEffect } from 'react';

export interface Goal {
  id: string;
  title: string;
  targetDate: string;
  currentAmount: number;
  targetAmount: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

const STORAGE_KEY = 'cyber_garden_goals';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load goals from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Failed to save goals to localStorage', error);
    }
  }, [goals]);

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const updateGoal = (id: string, updates: Partial<Omit<Goal, 'id'>>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  };

  return {
    goals,
    addGoal,
    deleteGoal,
    updateGoal,
  };
};
