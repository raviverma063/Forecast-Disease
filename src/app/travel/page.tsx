import PageHeader from '@/components/page-header';
import TravelForm from '@/components/travel/travel-form';

export default function TravelPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader title="Travel Insights" />
      <div className="max-w-2xl mx-auto w-full">
        <TravelForm />
      </div>
    </div>
  );
}
