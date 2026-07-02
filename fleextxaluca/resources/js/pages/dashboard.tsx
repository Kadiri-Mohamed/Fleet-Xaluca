import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type DashboardMetric, type DashboardReservationItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { CalendarDays, CarFront, DollarSign, Wrench } from 'lucide-react';
import { type ComponentType, type ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface DashboardProps {
    metrics: DashboardMetric[];
    reservationsPerMonth: Array<{ month: string; reservations: number }>;
    financeSeries: Array<{ month: string; revenue: number; maintenance_cost: number }>;
    todayReservations: DashboardReservationItem[];
}

const metricIcons: Record<string, ComponentType<{ className?: string }>> = {
    'Total Vehicles': CarFront,
    Available: CarFront,
    Reserved: CalendarDays,
    Maintenance: Wrench,
    Revenue: DollarSign,
    Expenses: DollarSign,
    Profit: DollarSign,
    "Today's Reservations": CalendarDays,
};

export default function Dashboard({ metrics, reservationsPerMonth, financeSeries, todayReservations }: DashboardProps) {
    const currencyFormatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4">
                <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-lg dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_28%)]" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-2">
                            <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/15">Fleet Overview</Badge>
                            <div className="space-y-1">
                                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Operations dashboard</h1>
                                <p className="max-w-2xl text-sm text-white/70">
                                    A compact view of fleet health, reservations, revenue, and maintenance activity.
                                </p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur">
                            Live operational snapshot
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric, index) => {
                        const Icon = metricIcons[metric.label] ?? DollarSign;
                        const accentClass =
                            metric.accent === 'positive'
                                ? 'from-emerald-500/15 to-emerald-500/5 border-emerald-200/70 dark:border-emerald-900/60'
                                : metric.accent === 'negative'
                                    ? 'from-rose-500/15 to-rose-500/5 border-rose-200/70 dark:border-rose-900/60'
                                    : 'from-background to-muted/30';

                        return (
                            <Card
                                key={metric.label}
                                className={`overflow-hidden border bg-gradient-to-br ${accentClass} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                                style={{ animationDelay: `${index * 60}ms` }}
                            >
                                <CardContent className="flex items-start justify-between gap-4 p-5">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                                        <div className="text-3xl font-semibold tracking-tight">{metric.value}</div>
                                        <p className="text-xs text-muted-foreground">{metric.trend}</p>
                                    </div>
                                    <div className="rounded-2xl border bg-background/80 p-3 shadow-sm">
                                        <Icon className="h-5 w-5 text-foreground" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <ChartCard title="Reservations per month" description="Scheduling volume across the last six months">
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={reservationsPerMonth}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 16,
                                        border: '1px solid hsl(var(--border))',
                                        background: 'hsl(var(--background))',
                                    }}
                                />
                                <Bar dataKey="reservations" radius={[10, 10, 0, 0]} fill="hsl(var(--chart-1))">
                                    {reservationsPerMonth.map((_, index) => (
                                        <Cell key={index} fill={index % 2 === 0 ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <Card className="border-muted/60 bg-gradient-to-br from-background to-muted/30">
                        <CardHeader>
                            <CardTitle>Today's reservations</CardTitle>
                            <p className="text-sm text-muted-foreground">Trips and bookings active right now.</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {todayReservations.length > 0 ? (
                                todayReservations.map((reservation) => (
                                    <div key={reservation.id} className="rounded-2xl border bg-background/80 p-4 transition-transform duration-300 hover:-translate-y-0.5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="font-medium">{reservation.reservation_number}</div>
                                                <p className="text-sm text-muted-foreground">
                                                    {reservation.vehicle?.unit_number ?? 'Vehicle'} · {reservation.vehicle?.plate_number ?? '-'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(reservation.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                                                    {new Date(reservation.end_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <Badge variant="outline">{reservation.status.replace(/_/g, ' ')}</Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                    No reservations are active today.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-2">
                    <ChartCard title="Revenue and maintenance cost" description="Current trend comparison across the last six months">
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={financeSeries}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} />
                                <Tooltip
                                    formatter={(value: number) => currencyFormatter.format(value)}
                                    contentStyle={{
                                        borderRadius: 16,
                                        border: '1px solid hsl(var(--border))',
                                        background: 'hsl(var(--background))',
                                    }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="maintenance_cost" stroke="hsl(var(--chart-3))" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <Card className="border-muted/60 bg-gradient-to-br from-background to-muted/30">
                        <CardHeader>
                            <CardTitle>Quick insight</CardTitle>
                            <p className="text-sm text-muted-foreground">What the numbers are telling us right now.</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InsightRow label="Revenue" value={metricValue(metrics, 'Revenue')} />
                            <InsightRow label="Expenses" value={metricValue(metrics, 'Expenses')} />
                            <InsightRow label="Profit" value={metricValue(metrics, 'Profit')} />
                            <InsightRow label="Today's reservations" value={String(todayReservations.length)} />
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}

function metricValue(metrics: DashboardMetric[], label: string): string {
    return String(metrics.find((metric) => metric.label === label)?.value ?? '0.00');
}

function ChartCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return (
        <Card className="overflow-hidden border-muted/60 bg-gradient-to-br from-background to-muted/20 shadow-sm">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function InsightRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-2xl border bg-background/80 px-4 py-3 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
