import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Agency } from '@/types';
import { vehicleStatusOptions } from '@/lib/fleet';
import { Link } from '@inertiajs/react';

export interface VehicleFormValues {
    agency_id: string;
    unit_number: string;
    plate_number: string;
    vin: string;
    make: string;
    model: string;
    year: string;
    color: string;
    vehicle_type: string;
    fuel_type: string;
    status: string;
    odometer: string;
    acquisition_date: string;
    disposal_date: string;
    notes: string;
}

interface VehicleFormFieldsProps {
    data: VehicleFormValues;
    errors: Partial<Record<keyof VehicleFormValues, string>>;
    agencies: Pick<Agency, 'id' | 'name'>[];
    processing: boolean;
    submitLabel: string;
    cancelHref: string;
    onSubmit: (event: React.FormEvent) => void;
    setData: <K extends keyof VehicleFormValues>(key: K, value: VehicleFormValues[K]) => void;
}

export function VehicleFormFields({ data, errors, agencies, processing, submitLabel, cancelHref, onSubmit, setData }: VehicleFormFieldsProps) {
    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            <Card>
                <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                        <Label>Agency</Label>
                        <Select value={data.agency_id} onValueChange={(value) => setData('agency_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an agency" />
                            </SelectTrigger>
                            <SelectContent>
                                {agencies.map((agency) => (
                                    <SelectItem key={agency.id} value={String(agency.id)}>
                                        {agency.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.agency_id ? <p className="text-sm text-destructive">{errors.agency_id}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="unit_number">Unit number</Label>
                        <Input id="unit_number" value={data.unit_number} onChange={(event) => setData('unit_number', event.target.value)} />
                        {errors.unit_number ? <p className="text-sm text-destructive">{errors.unit_number}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="plate_number">Plate number</Label>
                        <Input id="plate_number" value={data.plate_number} onChange={(event) => setData('plate_number', event.target.value)} />
                        {errors.plate_number ? <p className="text-sm text-destructive">{errors.plate_number}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="make">Make</Label>
                        <Input id="make" value={data.make} onChange={(event) => setData('make', event.target.value)} />
                        {errors.make ? <p className="text-sm text-destructive">{errors.make}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input id="model" value={data.model} onChange={(event) => setData('model', event.target.value)} />
                        {errors.model ? <p className="text-sm text-destructive">{errors.model}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vin">VIN</Label>
                        <Input id="vin" value={data.vin} onChange={(event) => setData('vin', event.target.value)} />
                        {errors.vin ? <p className="text-sm text-destructive">{errors.vin}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" type="number" value={data.year} onChange={(event) => setData('year', event.target.value)} />
                        {errors.year ? <p className="text-sm text-destructive">{errors.year}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input id="color" value={data.color} onChange={(event) => setData('color', event.target.value)} />
                        {errors.color ? <p className="text-sm text-destructive">{errors.color}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label>Vehicle type</Label>
                        <Input value={data.vehicle_type} onChange={(event) => setData('vehicle_type', event.target.value)} placeholder="SUV, Sedan, Van..." />
                        {errors.vehicle_type ? <p className="text-sm text-destructive">{errors.vehicle_type}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label>Fuel type</Label>
                        <Input value={data.fuel_type} onChange={(event) => setData('fuel_type', event.target.value)} placeholder="Diesel, Petrol, Hybrid..." />
                        {errors.fuel_type ? <p className="text-sm text-destructive">{errors.fuel_type}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {vehicleStatusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.status ? <p className="text-sm text-destructive">{errors.status}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="odometer">Odometer</Label>
                        <Input id="odometer" type="number" value={data.odometer} onChange={(event) => setData('odometer', event.target.value)} />
                        {errors.odometer ? <p className="text-sm text-destructive">{errors.odometer}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="acquisition_date">Acquisition date</Label>
                        <Input
                            id="acquisition_date"
                            type="date"
                            value={data.acquisition_date}
                            onChange={(event) => setData('acquisition_date', event.target.value)}
                        />
                        {errors.acquisition_date ? <p className="text-sm text-destructive">{errors.acquisition_date}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="disposal_date">Disposal date</Label>
                        <Input
                            id="disposal_date"
                            type="date"
                            value={data.disposal_date}
                            onChange={(event) => setData('disposal_date', event.target.value)}
                        />
                        {errors.disposal_date ? <p className="text-sm text-destructive">{errors.disposal_date}</p> : null}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" rows={4} value={data.notes} onChange={(event) => setData('notes', event.target.value)} />
                        {errors.notes ? <p className="text-sm text-destructive">{errors.notes}</p> : null}
                    </div>
                </CardContent>
            </Card>

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
