import { MonthProvider } from "@/lib/context/MonthContext";
import { DashboardLayout } from "@/components/layout";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MonthProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </MonthProvider>
  );
}
