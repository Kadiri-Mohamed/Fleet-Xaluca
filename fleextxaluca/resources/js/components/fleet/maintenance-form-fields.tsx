import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SummaryRow } from '@/components/fleet/summary-row';
import { maintenanceStatusOptions } from '@/lib/maintenances';
import type { MaintenanceVehicle } from '@/types';
import { Link } from '@inertiajs/react';

export interface MaintenanceFormValues {
    agency_id: string;
    vehicle_id: string;
    description: string;
    scheduled_at: string;
    cost: string;
    status: string;
    type: string;
    vendor_name: string;
    notes: string;
}

interface MaintenanceFormFieldsProps {
    data: MaintenanceFormValues;
    errors: Partial<Record<keyof MaintenanceFormValues, string>>;
    vehicles: MaintenanceVehicle[];
    processing: boolean;
    submitLabel: string;
    cancelHref: string;
    onSubmit: (event: React.FormEvent) => void;
    setData: <K extends keyof MaintenanceFormValues>(key: K, value: MaintenanceFormValues[K]) => void;
}

export function MaintenanceFormFields({ data, errors, vehicles, processing, submitLabel, cancelHref, onSubmit, setData }: MaintenanceFormFieldsProps) {
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
                            <Label htmlFor="scheduled_at">Date</Label>
                            <Input id="scheduled_at" type="date" value={data.scheduled_at} onChange={(event) => setData('scheduled_at', event.target.value)} />
                            {errors.scheduled_at ? <p className="text-sm text-destructive">{errors.scheduled_at}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cost">Cost</Label>
                            <Input id="cost" type="number" min="0" step="0.01" value={data.cost} onChange={(event) => setData('cost', event.target.value)} />
                            {errors.cost ? <p className="text-sm text-destructive">{errors.cost}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {maintenanceStatusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status ? <p className="text-sm text-destructive">{errors.status}</p> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="vendor_name">Vendor</Label>
                            <Input id="vendor_name" value={data.vendor_name} onChange={(event) => setData('vendor_name', event.target.value)} placeholder="Workshop or vendor name" />
                            {errors.vendor_name ? <p className="text-sm text-destructive">{errors.vendor_name}</p> : null}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" rows={4} value={data.description} onChange={(event) => setData('description', event.target.value)} placeholder="Brake service, oil change, inspection..." />
                            {errors.description ? <p className="text-sm text-destructive">{errors.description}</p> : null}
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
                            <h3 className="text-base font-semibold">Maintenance summary</h3>
                            <p className="text-sm text-muted-foreground">A quick view of the current record.</p>
                        </div>

                        <div className="grid gap-3 text-sm">
                            <SummaryRow label="Vehicle" value={selectedVehicle ? `${selectedVehicle.unit_number} - ${selectedVehicle.plate_number}` : 'Not selected'} />
                            <SummaryRow label="Agency" value={selectedVehicle?.agency?.name ?? 'Not selected'} />
                            <SummaryRow label="Date" value={data.scheduled_at ? new Date(data.scheduled_at).toLocaleDateString() : 'Not selected'} />
                            <SummaryRow label="Cost" value={data.cost ? `$${Number(data.cost).toFixed(2)}` : 'Not selected'} />
                            <SummaryRow label="Status" value={data.status || 'Not selected'} />
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
