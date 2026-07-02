import { overlaps } from '@/lib/reservations';
import type { ReservationCalendarEvent } from '@/types';

export function useReservationConflict(
    events: ReservationCalendarEvent[],
    vehicleId: string,
    startAt: string,
    endAt: string,
    ignoreReservationId?: number,
) {
    const conflicting = events.filter((event) => {
        if (String(event.vehicle_id) !== vehicleId) {
            return false;
        }

        if (ignoreReservationId && event.id === ignoreReservationId) {
            return false;
        }

        return overlaps(event.start_at, event.end_at, startAt, endAt);
    });

    return {
        conflict: conflicting[0] ?? null,
        hasConflict: conflicting.length > 0,
        conflicting,
    };
}
