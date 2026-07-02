import { Card, CardContent } from '@/components/ui/card';

export function MaintenanceTableSkeleton() {
    return (
        <Card>
            <CardContent className="space-y-3 p-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="grid gap-3 rounded-lg border p-4 md:grid-cols-6">
                        {Array.from({ length: 6 }).map((__, cell) => (
                            <div key={cell} className="h-4 rounded bg-muted animate-pulse" />
                        ))}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
