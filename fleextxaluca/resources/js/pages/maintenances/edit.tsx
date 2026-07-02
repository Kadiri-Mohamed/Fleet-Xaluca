import { MaintenanceFormFields, type MaintenanceFormValues } from '@/components/fleet/maintenance-form-fields';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Maintenance, MaintenanceVehicle } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Maintenances', href: '/maintenances' },
];

interface MaintenanceEditProps {
    maintenance: Maintenance;
    vehicles: MaintenanceVehicle[];
    statusOptions: { value: string; label: string }[];
}

export default function Edit({ maintenance, vehicles }: MaintenanceEditProps) {
    const form = useForm<MaintenanceFormValues>({
        agency_id: String(maintenance.agency_id),
        vehicle_id: String(maintenance.vehicle_id),
        description: maintenance.description ?? '',
        scheduled_at: maintenance.scheduled_at ? maintenance.scheduled_at.slice(0, 10) : '',
        cost: maintenance.cost,
        status: maintenance.status,
        type: maintenance.type,
        vendor_name: maintenance.vendor_name ?? '',
        notes: maintenance.notes ?? '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${maintenance.maintenance_number}`} />

            <div className="p-4">
                <div className="mb-6 space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Edit maintenance</h1>
                    <p className="text-sm text-muted-foreground">Update the service record and keep the history accurate.</p>
                </div>

                <MaintenanceFormFields
                    data={form.data}
                    errors={form.errors}
                    vehicles={vehicles}
                    processing={form.processing}
                    submitLabel="Update maintenance"
                    cancelHref={route('maintenances.show', maintenance.id)}
                    setData={form.setData}
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.put(route('maintenances.update', maintenance.id));
                    }}
                />
            </div>
        </AppLayout>
    );
}
