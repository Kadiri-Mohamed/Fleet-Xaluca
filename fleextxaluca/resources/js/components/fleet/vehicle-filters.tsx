import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { vehicleStatusOptions } from '@/lib/fleet';

export interface VehicleFiltersState {
    search: string;
    status: string;
    vehicle_type: string;
}

interface VehicleFiltersProps {
    value: VehicleFiltersState;
    vehicleTypes: string[];
    onChange: (value: VehicleFiltersState) => void;
    onReset: () => void;
    onSubmit: (value: VehicleFiltersState) => void;
}

export function VehicleFilters({ value, vehicleTypes, onChange, onReset, onSubmit }: VehicleFiltersProps) {
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
                            name="search"
                            placeholder="Unit, plate, VIN, make, model"
                            value={value.search}
                            onChange={(event) => onChange({ ...value, search: event.target.value })}
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
                                {vehicleStatusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={value.vehicle_type} onValueChange={(next) => onChange({ ...value, vehicle_type: next })}>
                            <SelectTrigger>
                                <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All types</SelectItem>
                                {vehicleTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end gap-2 md:col-span-4">
                        <Button type="submit">Apply filters</Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onReset();
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
