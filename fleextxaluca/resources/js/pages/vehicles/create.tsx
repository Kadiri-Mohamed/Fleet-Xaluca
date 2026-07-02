import { VehicleFormFields, type VehicleFormValues } from '@/components/fleet/vehicle-form-fields';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Agency } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vehicles', href: '/vehicles' },
    { title: 'Create', href: '/vehicles/create' },
];

interface VehicleCreateProps {
    agencies: Pick<Agency, 'id' | 'name'>[];
}

const emptyForm: VehicleFormValues = {
    agency_id: '',
    unit_number: '',
    plate_number: '',
    vin: '',
    make: '',
    model: '',
    year: '',
    color: '',
    vehicle_type: '',
    fuel_type: '',
    status: 'available',
    odometer: '0',
    acquisition_date: '',
    disposal_date: '',
    notes: '',
};

export default function Create({ agencies }: VehicleCreateProps) {
    const form = useForm<VehicleFormValues>(emptyForm);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create vehicle" />

            <div className="p-4">
                <div className="mb-6 space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Create vehicle</h1>
                    <p className="text-sm text-muted-foreground">Add a new asset to the fleet.</p>
                </div>

                <VehicleFormFields
                    data={form.data}
                    errors={form.errors}
                    agencies={agencies}
                    processing={form.processing}
                    submitLabel="Create vehicle"
                    cancelHref="/vehicles"
                    setData={form.setData}
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post(route('vehicles.store'));
                    }}
                />
            </div>
        </AppLayout>
    );
}
