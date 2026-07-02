import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SummaryRow } from '@/components/fleet/summary-row';
import { reservationStatusOptions } from '@/lib/reservations';
import type { ReservationVehicle } from '@/types';
import { Link } from '@inertiajs/react';

export interface ReservationFormValues {
    agency_id: string;
    vehicle_id: string;
    status: string;
    start_at: string;
    end_at: string;
    purpose: string;
    notes: string;
}

interface ReservationFormFieldsProps {
    data: ReservationFormValues;
    errors: Partial<Record<keyof ReservationFormValues, string>>;
    vehicles: ReservationVehicle[];
    processing: boolean;
    submitLabel: string;
    cancelHref: string;
    onSubmit: (event: React.FormEvent) => void;
    setData: <K extends keyof ReservationFormValues>(key: K, value: ReservationFormValues[K]) => void;
}

export function ReservationFormFields({ data, errors, vehicles, processing, submitLabel, cancelHref, onSubmit, setData }: ReservationFormFieldsProps) {
    const selectedVehicle = vehicles.find((vehicle) => String(vehicle.id) === data.vehicle_id) ?? null;

    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <Card>
                    <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label>Vehicle</Label>
                            <Select
                                value={data.vehicle_id}
                                onValueChange={(value) => {
                                    const nextVehicle = vehicles.find((vehicle) => String(vehicle.id) === value);
                                    setData('vehicle_id', value);
                                    setData('agency_id', nextVehicle ? String(nextVehicle.agency_id) : '');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a vehicle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehicles.map((vehicle) => (
                                        <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                                            {vehicle.unit_number} - {vehicle.plate_number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.vehicle_id ? <p className="text-sm text-destructive">{errors.vehicle_id}</p> : null}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Agency</Label>
                            <Input value={selectedVehicle?.agency?.name ?? 'Select a vehicle'} readOnly />
                            <input type="hidden" value={data.agency_id} />
                            {errors.agency_id ? <p className="text-sm text-destructive">{errors.agency_id}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reservationStatusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status ? <p className="text-sm text-destructive">{errors.status}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purpose">Purpose</Label>
                            <Input id="purpose" value={data.purpose} onChange={(event) => setData('purpose', event.target.value)} placeholder="Airport transfer, site visit..." />
                            {errors.purpose ? <p className="text-sm text-destructive">{errors.purpose}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start_at">Start</Label>
                            <Input id="start_at" type="datetime-local" value={data.start_at} onChange={(event) => setData('start_at', event.target.value)} />
                            {errors.start_at ? <p className="text-sm text-destructive">{errors.start_at}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_at">End</Label>
                            <Input id="end_at" type="datetime-local" value={data.end_at} onChange={(event) => setData('end_at', event.target.value)} />
                            {errors.end_at ? <p className="text-sm text-destructive">{errors.end_at}</p> : null}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" rows={4} value={data.notes} onChange={(event) => setData('notes', event.target.value)} />
                            {errors.notes ? <p className="text-sm text-destructive">{errors.notes}</p> : null}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-dashed">
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-1">
                            <h3 className="text-base font-semibold">Booking summary</h3>
                            <p className="text-sm text-muted-foreground">This panel updates as the reservation changes.</p>
                        </div>

                        <div className="grid gap-3 text-sm">
                            <SummaryRow label="Vehicle" value={selectedVehicle ? `${selectedVehicle.unit_number} - ${selectedVehicle.plate_number}` : 'Not selected'} />
                            <SummaryRow label="Agency" value={selectedVehicle?.agency?.name ?? 'Not selected'} />
                            <SummaryRow label="Status" value={data.status || 'Not selected'} />
                            <SummaryRow label="Start" value={data.start_at ? new Date(data.start_at).toLocaleString() : 'Not selected'} />
                            <SummaryRow label="End" value={data.end_at ? new Date(data.end_at).toLocaleString() : 'Not selected'} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between">
                <Button asChild variant="outline" type="button">
                    <Link href={cancelHref}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
