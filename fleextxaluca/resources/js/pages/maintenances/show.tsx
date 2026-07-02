import { ConfirmDialog } from '@/components/fleet/confirm-dialog';
import { MaintenanceStatusBadge } from '@/components/fleet/maintenance-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Maintenance } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Maintenances', href: '/maintenances' },
];

interface MaintenanceShowProps {
    maintenance: Maintenance;
    canManage: boolean;
}

export default function Show({ maintenance, canManage }: MaintenanceShowProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={maintenance.maintenance_number} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">{maintenance.maintenance_number}</h1>
                        <p className="text-sm text-muted-foreground">{maintenance.description ?? 'Maintenance details'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {canManage ? (
                            <>
                                <Button asChild variant="outline">
                                    <Link href={route('maintenances.edit', maintenance.id)}>Edit</Link>
                                </Button>
                                <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                                    Delete
                                </Button>
                            </>
                        ) : null}
                        <Button asChild>
                            <Link href="/maintenances">Back</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Core details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm">
                                <Detail label="Vehicle" value={maintenance.vehicle?.unit_number ?? 'Unknown'} />
                                <Detail label="Plate" value={maintenance.vehicle?.plate_number ?? '-'} />
                                <Detail label="Agency" value={maintenance.vehicle?.agency?.name ?? 'Unknown'} />
                                <Detail label="Status" value={<MaintenanceStatusBadge status={maintenance.status as 'scheduled' | 'in_progress' | 'completed' | 'cancelled'} />} />
                                <Detail label="Created by" value={maintenance.createdBy?.name ?? 'System'} />
                                <Detail
                                    label="Cost"
                                    value={new Intl.NumberFormat(undefined, {
                                        style: 'currency',
                                        currency: maintenance.currency,
                                    }).format(Number(maintenance.cost))}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Service details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm">
                                <Detail label="Date" value={maintenance.scheduled_at ? new Date(maintenance.scheduled_at).toLocaleDateString() : '-'} />
                                <Detail label="Vendor" value={maintenance.vendor_name ?? '-'} />
                                <Detail label="Description" value={maintenance.description ?? '-'} />
                                <Detail label="Notes" value={maintenance.notes ?? '-'} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vehicle context</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm">
                                <Detail label="Unit" value={maintenance.vehicle?.unit_number ?? '-'} />
                                <Detail label="Plate" value={maintenance.vehicle?.plate_number ?? '-'} />
                                <Detail label="Current status" value={maintenance.vehicle?.status ?? '-'} />
                                <Button asChild variant="outline" className="w-full">
                                    <Link href={route('vehicles.show', maintenance.vehicle_id)}>Open vehicle profile</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>

            <ConfirmDialog
                open={deleteOpen}
                title="Delete maintenance"
                description={`Remove ${maintenance.maintenance_number} from the log?`}
                confirmLabel="Delete"
                onOpenChange={setDeleteOpen}
                onConfirm={() => router.delete(route('maintenances.destroy', maintenance.id))}
            />
        </AppLayout>
    );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid gap-1">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
