import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { MaintenanceStatusBadge } from './maintenance-status-badge';
import type { Maintenance } from '@/types';
import { Button } from '@/components/ui/button';

interface MaintenanceHistoryProps {
    maintenances: Maintenance[];
    vehicleId: number;
}

export function MaintenanceHistory({ maintenances, vehicleId }: MaintenanceHistoryProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                    <CardTitle>Maintenance history</CardTitle>
                    <p className="text-sm text-muted-foreground">Recent maintenance work logged for this vehicle.</p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href={route('maintenances.create', { vehicle_id: vehicleId })}>Log maintenance</Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {maintenances.length > 0 ? (
                    maintenances.map((maintenance) => (
                        <div key={maintenance.id} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-medium">{maintenance.maintenance_number}</span>
                                    <MaintenanceStatusBadge status={maintenance.status as 'scheduled' | 'in_progress' | 'completed' | 'cancelled'} />
                                </div>
                                <p className="text-sm text-muted-foreground">{maintenance.description ?? 'No description provided.'}</p>
                                <p className="text-xs text-muted-foreground">
                                    {maintenance.scheduled_at ? new Date(maintenance.scheduled_at).toLocaleDateString() : 'No date'} ·{' '}
                                    {maintenance.vendor_name ?? 'Internal workshop'}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-sm font-medium">
                                        {new Intl.NumberFormat(undefined, {
                                            style: 'currency',
                                            currency: maintenance.currency,
                                            maximumFractionDigits: 2,
                                        }).format(Number(maintenance.cost))}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Cost</div>
                                </div>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={route('maintenances.show', maintenance.id)}>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                        <p className="text-sm font-medium">No maintenance history yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">This vehicle has not had any maintenance records logged yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
