'use client';

import { useCallback } from 'react';
import BlurFade from '@/shared/ui/magic/blur-fade';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/Tabs/Tabs';
import {
  useMainDashboardModel,
  DashboardTab,
} from '@/pages/dashboard/main/model/useMainDashboardModel';
import { OverviewSection } from '@/pages/dashboard/main/modules/OverviewSection';
import { TransactionsSection } from '@/pages/dashboard/main/modules/TransactionsSection';
import { GoalsSection } from '@/pages/dashboard/main/modules/GoalsSection';
import { MLDetailsSection } from '@/pages/dashboard/main/modules/MLDetailsSection';
import { MetricsSection } from '@/pages/dashboard/main/modules/MetricsSection';
import { MetaStatsGrid } from '@/pages/dashboard/main/modules/MetaStatsGrid';
import { TrendsSection } from '@/pages/dashboard/main/modules/TrendsSection';
import { UploadPlaceholder } from '@/pages/dashboard/main/modules/UploadPlaceholder';
import { AIChatWidget } from '@/features/ai-chat/AIChatWidget';

const MainPageAsync = () => {
  const {

    isRealData,
    activeTab,
    setActiveTab,
    activeSegmentLabel,
    setActiveSegmentLabel,
    hoveredLegendLabel,
    setHoveredLegendLabel,
    chartData,
    totalBudget,
    activeChartItem,
    centerDisplayValue,
    centerDisplayLabel,
    filteredTransactions,
    currentTransactions,
    apiData,
    txSearch,
    overviewYear,
    setOverviewYear,
    overviewMonth,
    setOverviewMonth,
    availableYears,
    availableMonths,
  } = useMainDashboardModel();

  const handleTabChange = useCallback(
    (value: string) => setActiveTab(value as DashboardTab),
    [setActiveTab],
  );

  return (
    <>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 relative z-10">
        {isRealData ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
            <BlurFade delay={0.2}>
              <TabsList className="w-full md:w-auto bg-fill-secondary/50 p-1 border border-fill-quaternary/50 backdrop-blur-sm overflow-x-auto">
                <TabsTrigger value="overview" className="flex-1 md:flex-none min-w-[120px]">
                  Обзор
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex-1 md:flex-none min-w-[120px]">
                  История
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex-1 md:flex-none min-w-[120px]">
                  Цели
                </TabsTrigger>
                {apiData && (
                  <TabsTrigger value="ml_details" className="flex-1 md:flex-none min-w-[120px]">
                    ML Детализация
                  </TabsTrigger>
                )}
                {apiData && (
                  <TabsTrigger value="metrics" className="flex-1 md:flex-none min-w-[120px]">
                    ML Метрики
                  </TabsTrigger>
                )}
              </TabsList>
            </BlurFade>

            <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
              {isRealData ? (
                <OverviewSection
                  chartData={chartData}
                  totalBudget={totalBudget}
                  activeSegmentLabel={activeSegmentLabel}
                  hoveredLegendLabel={hoveredLegendLabel}
                  onSegmentHover={setActiveSegmentLabel}
                  onLegendHover={setHoveredLegendLabel}
                  activeChartItem={activeChartItem}
                  centerDisplayValue={centerDisplayValue}
                  centerDisplayLabel={centerDisplayLabel}
                  selectedYear={overviewYear}
                  onYearChange={setOverviewYear}
                  selectedMonth={overviewMonth}
                  onMonthChange={setOverviewMonth}
                  years={availableYears}
                  months={availableMonths}
                />
              ) : (
                <UploadPlaceholder />
              )}
              {isRealData && <TrendsSection transactions={apiData!.rows} />}
            </TabsContent>
            <TabsContent
              value="transactions"
              className="space-y-6 focus-visible:outline-none relative z-10"
            >
              {isRealData ? (
                <TransactionsSection transactions={filteredTransactions} filterTitle={txSearch} />
              ) : (
                <UploadPlaceholder />
              )}
            </TabsContent>
            <TabsContent
              value="goals"
              className="space-y-6 focus-visible:outline-none bg-background/60 backdrop-blur"
            >
              {isRealData ? <GoalsSection hasData /> : <UploadPlaceholder />}
            </TabsContent>
            {isRealData && (
              <TabsContent value="ml_details" className="space-y-6 focus-visible:outline-none">
                <MetaStatsGrid meta={apiData!.meta} />
                <MLDetailsSection transactions={currentTransactions} />
              </TabsContent>
            )}
            {apiData?.metrics && (
              <TabsContent value="metrics" className="space-y-6 focus-visible:outline-none">
                <MetaStatsGrid meta={apiData.meta} />
                <MetricsSection metrics={apiData.metrics} />
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <BlurFade delay={0.2} className="w-full">
            <UploadPlaceholder />
          </BlurFade>
        )}
      </div>
      <AIChatWidget />
    </>
  );
};

export default MainPageAsync;
