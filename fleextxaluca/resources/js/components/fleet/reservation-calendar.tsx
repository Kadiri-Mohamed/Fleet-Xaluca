import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ReservationCalendarEvent } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReservationCalendar } from '@/hooks/use-reservation-calendar';
import { ReservationStatusBadge } from './reservation-status-badge';
import { type ReservationStatusValue } from '@/lib/reservations';

interface ReservationCalendarProps {
    month: string;
    events: ReservationCalendarEvent[];
    onMonthChange?: (month: string) => void;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const shiftMonth = (month: string, delta: number) => {
    const current = new Date(`${month}-01T00:00:00`);
    current.setMonth(current.getMonth() + delta);
    return `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
};

export function ReservationCalendar({ month, events, onMonthChange }: ReservationCalendarProps) {
    const calendar = useReservationCalendar(month, events);

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                    <CardTitle>Calendar</CardTitle>
                    <p className="text-sm text-muted-foreground">{calendar.monthLabel}</p>
                </div>
                {onMonthChange ? (
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" onClick={() => onMonthChange(shiftMonth(calendar.month, -1))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="outline" onClick={() => onMonthChange(new Date().toISOString().slice(0, 7))}>
                            Today
                        </Button>
                        <Button type="button" variant="outline" size="icon" onClick={() => onMonthChange(shiftMonth(calendar.month, 1))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                ) : null}
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="mt-2 grid grid-cols-7 gap-2">
                    {calendar.days.map((day) => (
                        <div
                            key={day.isoDate}
                            className={[
                                'min-h-28 rounded-lg border p-2 text-left',
                                day.inCurrentMonth ? 'bg-background' : 'bg-muted/30 text-muted-foreground',
                            ].join(' ')}
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium">{new Date(day.date).getDate()}</span>
                                {day.events.length > 0 ? <span className="text-[10px] text-muted-foreground">{day.events.length}</span> : null}
                            </div>

                            <div className="space-y-1">
                                {day.events.slice(0, 2).map((event) => (
                                    <div key={event.id} className="rounded-md border bg-muted/60 px-2 py-1 text-[11px]">
                                        <div className="truncate font-medium">{event.title}</div>
                                        <ReservationStatusBadge status={event.status as ReservationStatusValue} />
                                    </div>
                                ))}
                                {day.events.length > 2 ? <div className="text-[11px] text-muted-foreground">+{day.events.length - 2} more</div> : null}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
