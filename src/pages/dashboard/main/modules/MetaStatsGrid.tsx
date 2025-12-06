import NumberTicker from '@/shared/ui/magic/number-ticker';
import { cn } from '@/shared/utils';
import type { UploadResponse } from '@/shared/api/api';
import BlurFade from '@/shared/ui/magic/blur-fade';

type MetaStatsGridProps = {
  meta: UploadResponse['meta'];
};

export const MetaStatsGrid = ({ meta }: MetaStatsGridProps) => (
  <BlurFade delay={0.25} className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-background/60 backdrop-blur border rounded-xl p-4 flex flex-col">
      <span className="text-xs text-text-tertiary uppercase font-bold">Строк всего</span>
      <span className="text-2xl font-bold">
        <NumberTicker value={meta.total_rows} />
      </span>
    </div>
    <div className="bg-background/60 backdrop-blur border rounded-xl p-4 flex flex-col">
      <span className="text-xs text-text-tertiary uppercase font-bold">Обработано</span>
      <span className="text-2xl font-bold text-green-600">
        <NumberTicker value={meta.processed_rows} />
      </span>
    </div>
    <div className="bg-background/60 backdrop-blur border rounded-xl p-4 flex flex-col">
      <span className="text-xs text-text-tertiary uppercase font-bold">Ошибки</span>
      <span className={cn('text-2xl font-bold', meta.failed_rows > 0 ? 'text-red-500' : 'text-text-secondary')}>
        <NumberTicker value={meta.failed_rows} />
      </span>
    </div>
    <div className="bg-background/60 backdrop-blur border rounded-xl p-4 flex flex-col">
      <span className="text-xs text-text-tertiary uppercase font-bold">Версия Модели</span>
      <span className="text-sm font-medium truncate mt-1">{meta.model_type}</span>
    </div>
  </BlurFade>
);
