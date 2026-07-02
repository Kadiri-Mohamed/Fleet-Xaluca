import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ReservationCalendarSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <Skeleton key={index} className="h-8" />
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }).map((_, index) => (
                        <Skeleton key={index} className="h-24" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
