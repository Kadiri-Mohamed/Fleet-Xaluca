import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type Vehicle } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowRight, Edit, Trash2 } from 'lucide-react';
import { VehicleStatusBadge } from './vehicle-status-badge';

interface VehicleTableProps {
    vehicles: Vehicle[];
    canManage: boolean;
    onDelete: (vehicle: Vehicle) => void;
}

export function VehicleTable({ vehicles, canManage, onDelete }: VehicleTableProps) {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/40 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Vehicle</th>
                                <th className="px-6 py-4 font-medium">Agency</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Odometer</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.id} className="border-b last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="font-medium text-foreground">{vehicle.unit_number}</div>
                                            <div className="text-muted-foreground">
                                                {vehicle.make} {vehicle.model}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Plate: {vehicle.plate_number}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{vehicle.agency?.name ?? 'Unassigned'}</td>
                                    <td className="px-6 py-4">
                                        <VehicleStatusBadge status={vehicle.status as 'available' | 'reserved' | 'maintenance' | 'inactive'} />
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{vehicle.odometer.toLocaleString()} km</td>
                                    <td className="px-6 py-4 text-muted-foreground">{vehicle.vehicle_type ?? '-'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={route('vehicles.show', vehicle.id)}>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            {canManage ? (
                                                <>
                                                    <Button asChild variant="ghost" size="sm">
                                                        <Link href={route('vehicles.edit', vehicle.id)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(vehicle)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
