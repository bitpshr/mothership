import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="px-5">
        <Skeleton className="h-7 w-7 rounded" />
        <Skeleton className="mt-3 h-4 w-24" />
        <Skeleton className="mt-1.5 h-7 w-32" />
        <Skeleton className="mt-1 h-3 w-20" />
      </CardContent>
    </Card>
  );
}

export function StatCardSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
