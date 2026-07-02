import { VehicleFormFields, type VehicleFormValues } from '@/components/fleet/vehicle-form-fields';
import AppLayout from '@/layouts/app-layout';
import { type Agency, type BreadcrumbItem, type Vehicle } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vehicles', href: '/vehicles' },
    { title: 'Edit', href: '/vehicles' },
];

interface VehicleEditProps {
    vehicle: Vehicle;
    agencies: Pick<Agency, 'id' | 'name'>[];
}

const toFormValue = (value: unknown) => (value === null || value === undefined ? '' : String(value));

export default function Edit({ vehicle, agencies }: VehicleEditProps) {
    const form = useForm<VehicleFormValues>({
        agency_id: String(vehicle.agency_id),
        unit_number: vehicle.unit_number,
        plate_number: vehicle.plate_number,
        vin: vehicle.vin ?? '',
        make: vehicle.make,
        model: vehicle.model,
        year: toFormValue(vehicle.year),
        color: vehicle.color ?? '',
        vehicle_type: vehicle.vehicle_type ?? '',
        fuel_type: vehicle.fuel_type ?? '',
        status: vehicle.status,
        odometer: String(vehicle.odometer),
        acquisition_date: vehicle.acquisition_date ?? '',
        disposal_date: vehicle.disposal_date ?? '',
        notes: vehicle.notes ?? '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${vehicle.unit_number}`} />

            <div className="p-4">
                <div className="mb-6 space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Edit vehicle</h1>
                    <p className="text-sm text-muted-foreground">Update the vehicle record and status.</p>
                </div>

                <VehicleFormFields
                    data={form.data}
                    errors={form.errors}
                    agencies={agencies}
                    processing={form.processing}
                    submitLabel="Save changes"
                    cancelHref={route('vehicles.show', vehicle.id)}
                    setData={form.setData}
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.put(route('vehicles.update', vehicle.id));
                    }}
                />
            </div>
        </AppLayout>
    );
}
