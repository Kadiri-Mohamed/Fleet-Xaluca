import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function VehicleTableSkeleton() {
    return (
        <Card>
            <CardContent className="space-y-3 pt-6">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="grid gap-3 rounded-lg border p-4 md:grid-cols-6">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
