// src/components/page-header.tsx

// This import now works because SidebarTrigger is a named export
import { SidebarTrigger } from '@/components/ui/sidebar';

type PageHeaderProps = {
  title: string;
};

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      {/* This will now correctly display only the button */}
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
    </div>
  );
}
