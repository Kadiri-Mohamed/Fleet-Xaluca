import { ConfirmDialog } from '@/components/fleet/confirm-dialog';
import { VehicleStatusBadge } from '@/components/fleet/vehicle-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Vehicle } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vehicles', href: '/vehicles' },
];

interface VehicleShowProps {
    vehicle: Vehicle;
    canManage: boolean;
}

export default function Show({ vehicle, canManage }: VehicleShowProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={vehicle.unit_number} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">{vehicle.unit_number}</h1>
                        <p className="text-sm text-muted-foreground">
                            {vehicle.make} {vehicle.model} - {vehicle.plate_number}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {canManage ? (
                            <>
                                <Button asChild variant="outline">
                                    <Link href={route('vehicles.edit', vehicle.id)}>Edit</Link>
                                </Button>
                                <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                                    Delete
                                </Button>
                            </>
                        ) : null}
                        <Button asChild>
                            <Link href="/vehicles">Back</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Core details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3 text-sm">
                            <Detail label="Agency" value={vehicle.agency?.name ?? 'Unassigned'} />
                            <Detail label="Status" value={<VehicleStatusBadge status={vehicle.status as 'available' | 'reserved' | 'maintenance' | 'inactive'} />} />
                            <Detail label="Odometer" value={`${vehicle.odometer.toLocaleString()} km`} />
                            <Detail label="Type" value={vehicle.vehicle_type ?? '-'} />
                            <Detail label="Fuel" value={vehicle.fuel_type ?? '-'} />
                            <Detail label="VIN" value={vehicle.vin ?? '-'} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Operational details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3 text-sm">
                            <Detail label="Acquisition date" value={vehicle.acquisition_date ?? '-'} />
                            <Detail label="Disposal date" value={vehicle.disposal_date ?? '-'} />
                            <Detail label="Color" value={vehicle.color ?? '-'} />
                            <Detail label="Notes" value={vehicle.notes ?? '-'} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ConfirmDialog
                open={deleteOpen}
                title="Delete vehicle"
                description={`Remove ${vehicle.unit_number} from the fleet?`}
                confirmLabel="Delete"
                onOpenChange={setDeleteOpen}
                onConfirm={() => router.delete(route('vehicles.destroy', vehicle.id))}
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
