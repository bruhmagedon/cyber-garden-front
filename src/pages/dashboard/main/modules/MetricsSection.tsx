import { MetricCircle } from '../ui/MetricCircle';
import type { UploadResponse } from '@/shared/api/api';

type MetricsSectionProps = {
  metrics: UploadResponse['metrics'] | null;
};

export const MetricsSection = ({ metrics }: MetricsSectionProps) => {
  if (!metrics) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <MetricCircle
        value={metrics.accuracy ?? 0}
        label="Accuracy"
        sublabel="Общая точность"
        theme="success"
        index={0}
      />
      <MetricCircle
        value={metrics.macro_f1 ?? 0}
        label="Macro F1"
        sublabel="Среднее F1"
        theme="info"
        index={1}
      />
      <MetricCircle
        value={metrics.balanced_accuracy ?? 0}
        label="Balanced Acc."
        sublabel="Сбалансированная"
        theme="orange"
        index={2}
      />
    </div>
  );
};
