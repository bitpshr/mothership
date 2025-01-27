import { ArrowDownRight, DollarSign, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import type { Unit } from "@/db/schema";

type PropertyFinancialsProps = {
  units: Unit[];
};

export function PropertyFinancials({ units }: PropertyFinancialsProps) {
  const occupiedUnits = units.filter((u) => u.status === "occupied");
  const grossRevenue = occupiedUnits.reduce((sum, u) => sum + u.monthlyRent, 0);
  // Estimate expenses at 35% of gross — useful approximation for a demo
  const estimatedExpenses = Math.round(grossRevenue * 0.35);
  const noi = grossRevenue - estimatedExpenses;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Gross Revenue"
        value={grossRevenue}
        icon={DollarSign}
        format="currency"
        color="emerald"
        description={`From ${occupiedUnits.length} occupied units · /mo`}
      />
      <StatCard
        label="Est. Expenses"
        value={estimatedExpenses}
        icon={ArrowDownRight}
        format="currency"
        color="rose"
        description="~35% of gross revenue · /mo"
      />
      <StatCard
        label="Net Operating Income"
        value={noi}
        icon={TrendingUp}
        format="currency"
        color={noi >= 0 ? "violet" : "amber"}
        description="Revenue minus expenses · /mo"
      />
    </div>
  );
}
