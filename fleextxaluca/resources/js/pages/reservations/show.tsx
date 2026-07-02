import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReservationCalendar } from '@/components/fleet/reservation-calendar';
import { ReservationStatusBadge } from '@/components/fleet/reservation-status-badge';
import AppLayout from '@/layouts/app-layout';
import { type ReservationStatusValue } from '@/lib/reservations';
import { type BreadcrumbItem, type Reservation, type ReservationCalendarEvent } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/fleet/confirm-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reservations', href: '/reservations' },
];

interface ReservationShowProps {
    reservation: Reservation;
    calendarEvents: ReservationCalendarEvent[];
    canManage: boolean;
}

export default function Show({ reservation, calendarEvents, canManage }: ReservationShowProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={reservation.reservation_number} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">{reservation.reservation_number}</h1>
                        <p className="text-sm text-muted-foreground">{reservation.purpose ?? 'Reservation details'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {canManage ? (
                            <>
                                <Button asChild variant="outline">
                                    <Link href={route('reservations.edit', reservation.id)}>Edit</Link>
                                </Button>
                                <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                                    Delete
                                </Button>
                            </>
                        ) : null}
                        <Button asChild>
                            <Link href="/reservations">Back</Link>
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
                                <Detail label="Vehicle" value={reservation.vehicle?.unit_number ?? 'Unknown'} />
                                <Detail label="Plate" value={reservation.vehicle?.plate_number ?? '-'} />
                                <Detail label="Agency" value={reservation.vehicle?.agency?.name ?? 'Unknown'} />
                                <Detail label="Status" value={<ReservationStatusBadge status={reservation.status as ReservationStatusValue} />} />
                                <Detail label="Requested by" value={reservation.requestedBy?.name ?? 'System'} />
                                <Detail label="Approved by" value={reservation.approvedBy?.name ?? '-'} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm">
                                <Detail label="Start" value={new Date(reservation.start_at).toLocaleString()} />
                                <Detail label="End" value={new Date(reservation.end_at).toLocaleString()} />
                                <Detail label="Checked out" value={reservation.checked_out_at ? new Date(reservation.checked_out_at).toLocaleString() : '-'} />
                                <Detail label="Checked in" value={reservation.checked_in_at ? new Date(reservation.checked_in_at).toLocaleString() : '-'} />
                                <Detail label="Notes" value={reservation.notes ?? '-'} />
                            </CardContent>
                        </Card>
                    </div>

                    <ReservationCalendar month={new Date(reservation.start_at).toISOString().slice(0, 7)} events={calendarEvents} />
                </div>
            </div>

            <ConfirmDialog
                open={deleteOpen}
                title="Delete reservation"
                description={`Remove ${reservation.reservation_number} from the schedule?`}
                confirmLabel="Delete"
                onOpenChange={setDeleteOpen}
                onConfirm={() => router.delete(route('reservations.destroy', reservation.id))}
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
