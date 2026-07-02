import { Badge } from '@/components/ui/badge';
import { reservationStatusLabels, reservationStatusTone, type ReservationStatusValue } from '@/lib/reservations';

interface ReservationStatusBadgeProps {
    status: ReservationStatusValue;
}

export function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
    return <Badge className={reservationStatusTone[status]}>{reservationStatusLabels[status]}</Badge>;
}
