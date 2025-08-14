import PageHeader from '@/components/page-header';
import RiskSummary from '@/components/dashboard/risk-summary';
import InteractiveVisualization from '@/components/dashboard/interactive-visualization';

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader title="Dashboard" />
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RiskSummary />
        </div>
        <div className="lg:col-span-2 xl:col-span-1">
          <InteractiveVisualization />
        </div>
      </div>
    </div>
  );
}
