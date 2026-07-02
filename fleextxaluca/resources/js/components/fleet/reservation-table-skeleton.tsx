import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ReservationTableSkeleton() {
    return (
        <Card>
            <CardContent className="space-y-3 p-0">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="grid gap-3 border-b p-4 md:grid-cols-5">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-8 w-20 justify-self-end" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
