import { SideMenuButton } from '@/components/ui/sidebar'; // Or whatever the real name is

type PageHeaderProps = {
  title: string;
};

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
    </div>
  );
}
