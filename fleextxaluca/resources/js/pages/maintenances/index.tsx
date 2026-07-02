import { ConfirmDialog } from '@/components/fleet/confirm-dialog';
import { EmptyState } from '@/components/fleet/empty-state';
import { MaintenanceFilters, type MaintenanceFiltersState } from '@/components/fleet/maintenance-filters';
import { MaintenanceTable } from '@/components/fleet/maintenance-table';
import { MaintenanceTableSkeleton } from '@/components/fleet/maintenance-table-skeleton';
import { PaginationLinks } from '@/components/fleet/pagination-links';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Maintenance, MaintenanceVehicle, PaginationLink } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Maintenances', href: '/maintenances' },
];

interface MaintenancesIndexProps {
    maintenances: {
        data: Maintenance[];
        links: PaginationLink[];
        meta: {
            from: number | null;
            to: number | null;
            total: number;
        };
    };
    filters: Partial<MaintenanceFiltersState>;
    vehicles: MaintenanceVehicle[];
    statusOptions: { value: string; label: string }[];
    canCreate: boolean;
    canManage: boolean;
}

export default function Index({ maintenances, filters, vehicles, canCreate, canManage }: MaintenancesIndexProps) {
    const [loading, setLoading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Maintenance | null>(null);
    const [currentFilters, setCurrentFilters] = useState<MaintenanceFiltersState>({
        search: filters.search ?? '',
        status: filters.status ?? 'all',
        vehicle_id: filters.vehicle_id ?? 'all',
    });

    const submitFilters = (value: MaintenanceFiltersState) => {
        router.get(
            route('maintenances.index'),
            {
                search: value.search || undefined,
                status: value.status === 'all' ? undefined : value.status,
                vehicle_id: value.vehicle_id === 'all' ? undefined : value.vehicle_id,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    };

    const resetFilters = () => {
        const next = { search: '', status: 'all', vehicle_id: 'all' };
        setCurrentFilters(next);
        submitFilters(next);
    };

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setLoading(true);

        router.delete(route('maintenances.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Maintenances" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Maintenances</h1>
                        <p className="text-sm text-muted-foreground">Track service work, repairs, and upkeep across the fleet.</p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={route('maintenances.create')}>Log maintenance</Link>
                        </Button>
                    ) : null}
                </div>

                <MaintenanceFilters value={currentFilters} vehicles={vehicles} onChange={setCurrentFilters} onSubmit={submitFilters} onReset={resetFilters} />

                {loading ? (
                    <MaintenanceTableSkeleton />
                ) : maintenances.data.length > 0 ? (
                    <>
                        <MaintenanceTable maintenances={maintenances.data} canManage={canManage} onDelete={setDeleteTarget} />
                        <PaginationLinks links={maintenances.links} />
                    </>
                ) : (
                    <EmptyState
                        title="No maintenance records found"
                        description="Try a different filter or log the first maintenance record for the fleet."
                        actionLabel={canCreate ? 'Log maintenance' : undefined}
                        actionHref={canCreate ? route('maintenances.create') : undefined}
                    />
                )}
            </div>

            <ConfirmDialog
                open={deleteTarget !== null}
                title="Delete maintenance"
                description={`Remove ${deleteTarget?.maintenance_number ?? 'this maintenance record'} from the log?`}
                confirmLabel="Delete"
                processing={loading}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    );
}
