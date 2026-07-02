import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { reservationStatusOptions } from '@/lib/reservations';
import type { ReservationVehicle } from '@/types';

export interface ReservationFiltersState {
    search: string;
    status: string;
    vehicle_id: string;
    month: string;
}

interface ReservationFiltersProps {
    value: ReservationFiltersState;
    vehicles: ReservationVehicle[];
    onChange: (value: ReservationFiltersState) => void;
    onSubmit: (value: ReservationFiltersState) => void;
    onReset: () => void;
}

export function ReservationFilters({ value, vehicles, onChange, onSubmit, onReset }: ReservationFiltersProps) {
    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(value);
    };

    return (
        <Card>
            <CardContent className="grid gap-4 pt-6 md:grid-cols-4">
                <form className="contents" onSubmit={submit}>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            value={value.search}
                            onChange={(event) => onChange({ ...value, search: event.target.value })}
                            placeholder="Reservation number or purpose"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={value.status} onValueChange={(next) => onChange({ ...value, status: next })}>
                            <SelectTrigger>
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                {reservationStatusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Vehicle</Label>
                        <Select value={value.vehicle_id} onValueChange={(next) => onChange({ ...value, vehicle_id: next })}>
                            <SelectTrigger>
                                <SelectValue placeholder="All vehicles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All vehicles</SelectItem>
                                {vehicles.map((vehicle) => (
                                    <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                                        {vehicle.unit_number} - {vehicle.plate_number}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="month">Month</Label>
                        <Input id="month" type="month" value={value.month} onChange={(event) => onChange({ ...value, month: event.target.value })} />
                    </div>

                    <div className="flex items-end gap-2 md:col-span-4">
                        <Button type="submit">Apply filters</Button>
                        <Button type="button" variant="outline" onClick={onReset}>
                            Reset
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
