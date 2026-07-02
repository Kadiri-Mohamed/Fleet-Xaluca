import { ReservationCalendar } from '@/components/fleet/reservation-calendar';
import { ReservationFormFields, type ReservationFormValues } from '@/components/fleet/reservation-form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { useReservationConflict } from '@/hooks/use-reservation-conflict';
import { toDateInputValue, toMonthValue } from '@/lib/reservations';
import { type BreadcrumbItem, type Reservation, type ReservationCalendarEvent, type ReservationVehicle } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reservations', href: '/reservations' },
    { title: 'Edit', href: '/reservations' },
];

interface ReservationEditProps {
    reservation: Reservation;
    vehicles: ReservationVehicle[];
    calendarMonth: string;
    calendarEvents: ReservationCalendarEvent[];
}

export default function Edit({ reservation, vehicles, calendarMonth, calendarEvents }: ReservationEditProps) {
    const form = useForm<ReservationFormValues>({
        agency_id: String(reservation.agency_id),
        vehicle_id: String(reservation.vehicle_id),
        status: reservation.status,
        start_at: toDateInputValue(reservation.start_at),
        end_at: toDateInputValue(reservation.end_at),
        purpose: reservation.purpose ?? '',
        notes: reservation.notes ?? '',
    });

    const conflictPreview = useReservationConflict(calendarEvents, form.data.vehicle_id, form.data.start_at, form.data.end_at, reservation.id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${reservation.reservation_number}`} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Edit reservation</h1>
                        <p className="text-sm text-muted-foreground">Update the schedule while keeping the booking safe.</p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={route('reservations.show', reservation.id)}>Back to details</Link>
                    </Button>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
                    <ReservationFormFields
                        data={form.data}
                        errors={form.errors}
                        vehicles={vehicles}
                        processing={form.processing}
                        submitLabel="Save changes"
                        cancelHref={route('reservations.show', reservation.id)}
                        setData={form.setData}
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.put(route('reservations.update', reservation.id));
                        }}
                    />

                    <div className="space-y-4">
                        <Card className={conflictPreview.hasConflict ? 'border-destructive/50' : ''}>
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold">Conflict preview</h3>
                                    {conflictPreview.hasConflict ? (
                                        <p className="text-sm text-destructive">
                                            This time range overlaps with {conflictPreview.conflict?.reservation_number}. The server will block submission.
                                        </p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No overlap detected for the selected vehicle and time range.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <ReservationCalendar month={toMonthValue(calendarMonth)} events={calendarEvents} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
