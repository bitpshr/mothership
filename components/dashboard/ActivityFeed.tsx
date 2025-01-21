import Link from "next/link";
import { Building2, FileText, Users, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItem } from "@/db/schema";
import { formatRelativeTime } from "@/lib/formatters";

const ACTIVITY_CONFIG = {
  lease_signed: {
    icon: Users,
    container: "bg-emerald-500/12 dark:bg-emerald-500/18",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    label: "Lease Signed",
  },
  payment_received: {
    icon: FileText,
    container: "bg-blue-500/12 dark:bg-blue-500/18",
    iconClass: "text-blue-600 dark:text-blue-400",
    label: "Payment",
  },
  maintenance_opened: {
    icon: Wrench,
    container: "bg-amber-500/12 dark:bg-amber-500/18",
    iconClass: "text-amber-600 dark:text-amber-400",
    label: "Maintenance",
  },
  tenant_moved_out: {
    icon: Building2,
    container: "bg-rose-500/12 dark:bg-rose-500/18",
    iconClass: "text-rose-600 dark:text-rose-400",
    label: "Moved Out",
  },
} satisfies Record<ActivityItem["type"], { icon: React.ElementType; container: string; iconClass: string; label: string }>;

type ActivityFeedProps = {
  items: ActivityItem[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          <ul>
            {items.map((item, index) => {
              const config = ACTIVITY_CONFIG[item.type];
              const Icon = config.icon;
              const isLast = index === items.length - 1;
              return (
                <li key={item.id} className="relative">
                  <Link
                    href={item.href}
                    className="flex gap-3 rounded-md -mx-2 px-2 py-1 transition-colors hover:bg-muted/60"
                  >
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${config.container}`}
                      >
                        <Icon className={`size-3.5 ${config.iconClass}`} />
                      </div>
                      {!isLast && <div className="w-px flex-1 bg-border/60 my-1" />}
                    </div>

                    {/* Content */}
                    <div className={`min-w-0 ${isLast ? "pb-0" : "pb-3"}`}>
                      <p className="text-sm leading-tight font-medium">{item.description}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-xs text-muted-foreground">{item.propertyName}</p>
                        <span className="text-muted-foreground/40 text-xs">·</span>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(item.timestamp)}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
