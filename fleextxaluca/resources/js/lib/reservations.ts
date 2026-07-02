import type { ReservationCalendarEvent } from '@/types';

export type ReservationStatusValue = 'pending' | 'approved' | 'checked_out' | 'completed' | 'cancelled';

export interface MonthDay {
    date: Date;
    isoDate: string;
    inCurrentMonth: boolean;
    events: ReservationCalendarEvent[];
}

export const reservationStatusLabels: Record<ReservationStatusValue, string> = {
    pending: 'Pending',
    approved: 'Approved',
    checked_out: 'Checked out',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

export const reservationStatusTone: Record<ReservationStatusValue, string> = {
    pending: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    approved: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300',
    checked_out: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300',
    completed: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    cancelled: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300',
};

export const reservationStatusOptions = Object.entries(reservationStatusLabels).map(([value, label]) => ({
    value: value as ReservationStatusValue,
    label,
}));

const pad = (value: number) => String(value).padStart(2, '0');

export const toDateInputValue = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const toMonthValue = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
};

export const overlaps = (startA: string | Date, endA: string | Date, startB: string | Date, endB: string | Date) => {
    const aStart = new Date(startA).getTime();
    const aEnd = new Date(endA).getTime();
    const bStart = new Date(startB).getTime();
    const bEnd = new Date(endB).getTime();

    return aStart < bEnd && aEnd > bStart;
};

export const startOfMonth = (month: string | Date) => {
    const date = month instanceof Date ? new Date(month) : new Date(`${month}-01T00:00:00`);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
};

export const endOfMonth = (month: string | Date) => {
    const date = startOfMonth(month);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    date.setHours(23, 59, 59, 999);
    return date;
};

export const buildMonthGrid = (month: string | Date, events: ReservationCalendarEvent[]): MonthDay[] => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const firstGridDay = new Date(start);
    firstGridDay.setDate(firstGridDay.getDate() - firstGridDay.getDay());

    const lastGridDay = new Date(end);
    lastGridDay.setDate(lastGridDay.getDate() + (6 - lastGridDay.getDay()));

    const days: MonthDay[] = [];
    const cursor = new Date(firstGridDay);

    while (cursor <= lastGridDay) {
        const isoDate = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(cursor.getDate())}`;
        const currentDayStart = new Date(cursor);
        currentDayStart.setHours(0, 0, 0, 0);
        const currentDayEnd = new Date(cursor);
        currentDayEnd.setHours(23, 59, 59, 999);

        days.push({
            date: new Date(cursor),
            isoDate,
            inCurrentMonth: cursor.getMonth() === start.getMonth(),
            events: events.filter((event) => overlaps(event.start_at, event.end_at, currentDayStart, currentDayEnd)),
        });

        cursor.setDate(cursor.getDate() + 1);
    }

    return days;
};
