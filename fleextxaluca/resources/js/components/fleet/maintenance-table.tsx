import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type Maintenance } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowRight, Edit, Trash2 } from 'lucide-react';
import { MaintenanceStatusBadge } from './maintenance-status-badge';

interface MaintenanceTableProps {
    maintenances: Maintenance[];
    canManage: boolean;
    onDelete: (maintenance: Maintenance) => void;
}

export function MaintenanceTable({ maintenances, canManage, onDelete }: MaintenanceTableProps) {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/40 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Maintenance</th>
                                <th className="px-6 py-4 font-medium">Vehicle</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Cost</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {maintenances.map((maintenance) => (
                                <tr key={maintenance.id} className="border-b last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="font-medium text-foreground">{maintenance.maintenance_number}</div>
                                            <div className="text-muted-foreground">{maintenance.description ?? '-'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        <div className="space-y-1">
                                            <div className="font-medium text-foreground">{maintenance.vehicle?.unit_number ?? 'Unknown vehicle'}</div>
                                            <div>{maintenance.vehicle?.plate_number ?? '-'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {maintenance.scheduled_at ? new Date(maintenance.scheduled_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {new Intl.NumberFormat(undefined, {
                                            style: 'currency',
                                            currency: maintenance.currency,
                                            maximumFractionDigits: 2,
                                        }).format(Number(maintenance.cost))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <MaintenanceStatusBadge status={maintenance.status as 'scheduled' | 'in_progress' | 'completed' | 'cancelled'} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={route('maintenances.show', maintenance.id)}>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            {canManage ? (
                                                <>
                                                    <Button asChild variant="ghost" size="sm">
                                                        <Link href={route('maintenances.edit', maintenance.id)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(maintenance)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
