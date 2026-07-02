import { buildMonthGrid, endOfMonth, startOfMonth } from '@/lib/reservations';
import type { ReservationCalendarEvent } from '@/types';
import { useEffect, useState } from 'react';

export function useReservationCalendar(initialMonth: string, events: ReservationCalendarEvent[]) {
    const [month, setMonth] = useState(initialMonth);

    useEffect(() => {
        setMonth(initialMonth);
    }, [initialMonth]);

    const goToPreviousMonth = () => {
        const current = new Date(`${month}-01T00:00:00`);
        current.setMonth(current.getMonth() - 1);
        setMonth(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
    };

    const goToNextMonth = () => {
        const current = new Date(`${month}-01T00:00:00`);
        current.setMonth(current.getMonth() + 1);
        setMonth(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
    };

    const goToToday = () => {
        const today = new Date();
        setMonth(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);
    };

    return {
        month,
        monthLabel: new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
        monthStart: startOfMonth(month).toISOString(),
        monthEnd: endOfMonth(month).toISOString(),
        days: buildMonthGrid(month, events),
        goToPreviousMonth,
        goToNextMonth,
        goToToday,
    };
}
