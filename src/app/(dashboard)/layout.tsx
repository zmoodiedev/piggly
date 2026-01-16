import { CurrencyProvider } from "@/lib/context/CurrencyContext";
import { MonthProvider } from "@/lib/context/MonthContext";
import { DashboardLayout } from "@/components/layout";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrencyProvider>
      <MonthProvider>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </MonthProvider>
    </CurrencyProvider>
  );
}
