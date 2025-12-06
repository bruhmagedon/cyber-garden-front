type GoalsSectionProps = {
  hasData: boolean;
};

export const GoalsSection = ({ hasData }: GoalsSectionProps) =>
  hasData ? (
    <div className="p-4 rounded-xl border border-dashed border-border text-center text-text-tertiary">
      Функционал целей доступен в расширенной версии.
    </div>
  ) : null;
