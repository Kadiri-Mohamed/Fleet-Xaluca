import { ConfirmDialog } from '@/components/fleet/confirm-dialog';
import { EmptyState } from '@/components/fleet/empty-state';
import { PaginationLinks } from '@/components/fleet/pagination-links';
import { ReservationCalendar } from '@/components/fleet/reservation-calendar';
import { ReservationFilters, type ReservationFiltersState } from '@/components/fleet/reservation-filters';
import { ReservationTable } from '@/components/fleet/reservation-table';
import { ReservationCalendarSkeleton } from '@/components/fleet/reservation-calendar-skeleton';
import { ReservationTableSkeleton } from '@/components/fleet/reservation-table-skeleton';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type PaginationLink, type Reservation, type ReservationCalendarEvent, type ReservationVehicle, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reservations', href: '/reservations' },
];

interface ReservationsIndexProps {
    reservations: {
        data: Reservation[];
        links: PaginationLink[];
        meta: {
            from: number | null;
            to: number | null;
            total: number;
        };
    };
    filters: Partial<ReservationFiltersState>;
    vehicles: ReservationVehicle[];
    calendarMonth: string;
    calendarEvents: ReservationCalendarEvent[];
    canCreate: boolean;
    canManage: boolean;
}

export default function Index({ reservations, filters, vehicles, calendarMonth, calendarEvents, canCreate, canManage }: ReservationsIndexProps) {
    const [loading, setLoading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null);
    const [currentFilters, setCurrentFilters] = useState<ReservationFiltersState>({
        search: filters.search ?? '',
        status: filters.status ?? 'all',
        vehicle_id: filters.vehicle_id ?? 'all',
        month: filters.month ?? calendarMonth,
    });

    const submitFilters = (value: ReservationFiltersState) => {
        router.get(
            route('reservations.index'),
            {
                search: value.search || undefined,
                status: value.status === 'all' ? undefined : value.status,
                vehicle_id: value.vehicle_id === 'all' ? undefined : value.vehicle_id,
                month: value.month || undefined,
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

    const handleMonthChange = (month: string) => {
        const next = { ...currentFilters, month };
        setCurrentFilters(next);
        submitFilters(next);
    };

    const resetFilters = () => {
        const next = { search: '', status: 'all', vehicle_id: 'all', month: calendarMonth };
        setCurrentFilters(next);
        submitFilters(next);
    };

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setLoading(true);

        router.delete(route('reservations.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reservations" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Reservations</h1>
                        <p className="text-sm text-muted-foreground">Plan fleet usage and avoid double booking.</p>
                    </div>
                    {canCreate ? (
                        <Button asChild>
                            <Link href={route('reservations.create')}>New reservation</Link>
                        </Button>
                    ) : null}
                </div>

                <ReservationFilters value={currentFilters} vehicles={vehicles} onChange={setCurrentFilters} onSubmit={submitFilters} onReset={resetFilters} />

                <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
                    <div className="space-y-4">
                        {loading ? (
                            <ReservationTableSkeleton />
                        ) : reservations.data.length > 0 ? (
                            <>
                                <ReservationTable reservations={reservations.data} canManage={canManage} onDelete={setDeleteTarget} />
                                <PaginationLinks links={reservations.links} />
                            </>
                        ) : (
                            <EmptyState
                                title="No reservations found"
                                description="Try a different filter or create the first reservation for this fleet."
                                actionLabel={canCreate ? 'Add reservation' : undefined}
                                actionHref={canCreate ? route('reservations.create') : undefined}
                            />
                        )}
                    </div>

                    {loading ? (
                        <ReservationCalendarSkeleton />
                    ) : (
                        <ReservationCalendar
                            month={currentFilters.month}
                            events={calendarEvents}
                            onMonthChange={(month) => handleMonthChange(month)}
                        />
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={deleteTarget !== null}
                title="Delete reservation"
                description={`Remove ${deleteTarget?.reservation_number ?? 'this reservation'} from the schedule?`}
                confirmLabel="Delete"
                processing={loading}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </AppLayout>
    );
}
