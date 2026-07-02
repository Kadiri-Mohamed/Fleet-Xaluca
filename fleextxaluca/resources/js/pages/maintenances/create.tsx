import { MaintenanceFormFields, type MaintenanceFormValues } from '@/components/fleet/maintenance-form-fields';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, MaintenanceVehicle } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Maintenances', href: '/maintenances' },
    { title: 'Create', href: '/maintenances/create' },
];

interface MaintenanceCreateProps {
    vehicles: MaintenanceVehicle[];
    selectedVehicleId: number | null;
    selectedAgencyId: number | null;
    selectedDate: string;
    statusOptions: { value: string; label: string }[];
}

export default function Create({ vehicles, selectedVehicleId, selectedAgencyId, selectedDate }: MaintenanceCreateProps) {
    const form = useForm<MaintenanceFormValues>({
        agency_id: selectedAgencyId ? String(selectedAgencyId) : '',
        vehicle_id: selectedVehicleId ? String(selectedVehicleId) : '',
        description: '',
        scheduled_at: selectedDate,
        cost: '0',
        status: 'scheduled',
        type: 'general',
        vendor_name: '',
        notes: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Log maintenance" />

            <div className="p-4">
                <div className="mb-6 space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Log maintenance</h1>
                    <p className="text-sm text-muted-foreground">Capture service records and keep the fleet history current.</p>
                </div>

                <MaintenanceFormFields
                    data={form.data}
                    errors={form.errors}
                    vehicles={vehicles}
                    processing={form.processing}
                    submitLabel="Save maintenance"
                    cancelHref="/maintenances"
                    setData={form.setData}
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post(route('maintenances.store'));
                    }}
                />
            </div>
        </AppLayout>
    );
}
