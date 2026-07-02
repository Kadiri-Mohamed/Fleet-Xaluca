import { ReservationCalendar } from '@/components/fleet/reservation-calendar';
import { ReservationFormFields, type ReservationFormValues } from '@/components/fleet/reservation-form-fields';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { useReservationConflict } from '@/hooks/use-reservation-conflict';
import { toDateInputValue, toMonthValue } from '@/lib/reservations';
import { type BreadcrumbItem, type ReservationCalendarEvent, type ReservationVehicle } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reservations', href: '/reservations' },
    { title: 'Create', href: '/reservations/create' },
];

interface ReservationCreateProps {
    vehicles: ReservationVehicle[];
    calendarMonth: string;
    calendarEvents: ReservationCalendarEvent[];
}

const now = new Date();
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

const createInitialValues = (vehicles: ReservationVehicle[]): ReservationFormValues => {
    const firstVehicle = vehicles[0] ?? null;

    return {
        agency_id: firstVehicle ? String(firstVehicle.agency_id) : '',
        vehicle_id: firstVehicle ? String(firstVehicle.id) : '',
        status: 'pending',
        start_at: toDateInputValue(now),
        end_at: toDateInputValue(oneHourLater),
        purpose: '',
        notes: '',
    };
};

export default function Create({ vehicles, calendarMonth, calendarEvents }: ReservationCreateProps) {
    const form = useForm<ReservationFormValues>(createInitialValues(vehicles));
    const conflictPreview = useReservationConflict(calendarEvents, form.data.vehicle_id, form.data.start_at, form.data.end_at);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create reservation" />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Create reservation</h1>
                        <p className="text-sm text-muted-foreground">Reserve a vehicle without risking overlap.</p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/reservations">Back to reservations</Link>
                    </Button>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
                    <ReservationFormFields
                        data={form.data}
                        errors={form.errors}
                        vehicles={vehicles}
                        processing={form.processing}
                        submitLabel="Create reservation"
                        cancelHref="/reservations"
                        setData={form.setData}
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.post(route('reservations.store'));
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
