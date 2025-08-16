import PageHeader from '@/components/page-header';
import LiveRiskRadar from '@/components/LiveRiskRadar';
import DiseaseTrendChart from '@/components/dashboard/disease-trend-chart';
import HospitalLocator from '@/components/HospitalLocator';

export default function DashboardPage() {
  return (
    <div className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader title="Dashboard" />
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2 xl:col-span-3">
          <LiveRiskRadar />
        </div>
        <div className="lg:col-span-2 xl:col-span-3">
          <DiseaseTrendChart />
        </div>
        <div className="lg:col-span-2 xl:col-span-3">
          <HospitalLocator />
        </div>
      </div>
    </div>
  );
}
