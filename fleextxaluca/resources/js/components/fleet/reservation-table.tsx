import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type ReservationStatusValue } from '@/lib/reservations';
import { type Reservation } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowRight, Edit, Trash2 } from 'lucide-react';
import { ReservationStatusBadge } from './reservation-status-badge';

interface ReservationTableProps {
    reservations: Reservation[];
    canManage: boolean;
    onDelete: (reservation: Reservation) => void;
}

export function ReservationTable({ reservations, canManage, onDelete }: ReservationTableProps) {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/40 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Reservation</th>
                                <th className="px-6 py-4 font-medium">Vehicle</th>
                                <th className="px-6 py-4 font-medium">Time</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id} className="border-b last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="font-medium text-foreground">{reservation.reservation_number}</div>
                                            <div className="text-muted-foreground">{reservation.purpose ?? 'No purpose provided'}</div>
                                            <div className="text-xs text-muted-foreground">By {reservation.requestedBy?.name ?? 'System'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        <div className="space-y-1">
                                            <div>{reservation.vehicle?.unit_number ?? 'Vehicle'}</div>
                                            <div className="text-xs">
                                                {reservation.vehicle?.plate_number ?? '-'}
                                                {reservation.vehicle?.agency?.name ? ` · ${reservation.vehicle.agency.name}` : ''}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        <div className="space-y-1">
                                            <div>{new Date(reservation.start_at).toLocaleString()}</div>
                                            <div className="text-xs">to {new Date(reservation.end_at).toLocaleString()}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <ReservationStatusBadge status={reservation.status as ReservationStatusValue} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={route('reservations.show', reservation.id)}>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            {canManage ? (
                                                <>
                                                    <Button asChild variant="ghost" size="sm">
                                                        <Link href={route('reservations.edit', reservation.id)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(reservation)}>
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
