import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginationLink, type Vehicle } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/fleet/empty-state';
import { PaginationLinks } from '@/components/fleet/pagination-links';
import { ConfirmDialog } from '@/components/fleet/confirm-dialog';
import { VehicleFilters, type VehicleFiltersState } from '@/components/fleet/vehicle-filters';
import { VehicleTable } from '@/components/fleet/vehicle-table';
import { VehicleTableSkeleton } from '@/components/fleet/vehicle-table-skeleton';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vehicles', href: '/vehicles' },
];

interface VehiclesIndexProps {
    vehicles: {
        data: Vehicle[];
        links: PaginationLink[];
        meta: {
            from: number | null;
            to: number | null;
            total: number;
        };
    };
    filters: Partial<VehicleFiltersState>;
    statusOptions: { value: string; label: string }[];
    vehicleTypes: string[];
    canCreate: boolean;
    canManage: boolean;
}

export default function Index({ vehicles, filters, vehicleTypes, canCreate, canManage }: VehiclesIndexProps) {
    const [loading, setLoading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
    const [currentFilters, setCurrentFilters] = useState<VehicleFiltersState>({
        search: filters.search ?? '',
        status: filters.status ?? 'all',
        vehicle_type: filters.vehicle_type ?? 'all',
    });

    const submitFilters = (value: VehicleFiltersState) => {
        const params = {
            search: value.search || undefined,
            status: value.status === 'all' ? undefined : value.status,
            vehicle_type: value.vehicle_type === 'all' ? undefined : value.vehicle_type,
        };

        router.get(route('vehicles.index'), params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    const resetFilters = () => {
        const next = { search: '', status: 'all', vehicle_type: 'all' };
        setCurrentFilters(next);
        submitFilters(next);
    };

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setLoading(true);

        router.delete(route('vehicles.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicles" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Vehicles</h1>
                        <p className="text-sm text-muted-foreground">Search, filter, and manage fleet assets.</p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={route('vehicles.create')}>New vehicle</Link>
                        </Button>
                    ) : null}
                </div>

                <VehicleFilters value={currentFilters} vehicleTypes={vehicleTypes} onChange={setCurrentFilters} onSubmit={submitFilters} onReset={resetFilters} />

                {loading ? (
                    <VehicleTableSkeleton />
                ) : vehicles.data.length > 0 ? (
                    <>
                        <VehicleTable vehicles={vehicles.data} canManage={canManage} onDelete={setDeleteTarget} />
                        <PaginationLinks links={vehicles.links} />
                    </>
                ) : (
                    <EmptyState
                        title="No vehicles found"
                        description="Try a different filter or add your first vehicle to start tracking the fleet."
                        actionLabel={canCreate ? 'Add vehicle' : undefined}
                        actionHref={canCreate ? route('vehicles.create') : undefined}
                    />
                )}
            </div>

            <ConfirmDialog
                open={deleteTarget !== null}
                title="Delete vehicle"
                description={`Remove ${deleteTarget?.unit_number ?? 'this vehicle'} from the fleet? This will archive the record.`}
                confirmLabel="Delete"
                processing={loading}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    );
}
