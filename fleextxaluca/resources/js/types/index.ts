import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    [key: string]: unknown;
}

export interface Role {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_system: boolean;
    created_at: string;
    updated_at: string;
}

export interface Agency {
    id: number;
    name: string;
    code: string;
    external_source: string | null;
    external_id: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    address: string | null;
    timezone: string;
    status: string;
    metadata: Record<string, unknown> | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar?: string;
    role_id: number | null;
    agency_id: number | null;
    external_source: string | null;
    external_id: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    role?: Role | null;
    agency?: Agency | null;
    [key: string]: unknown;
}

export interface Vehicle {
    id: number;
    agency_id: number;
    agency?: Agency | null;
    unit_number: string;
    plate_number: string;
    vin: string | null;
    make: string;
    model: string;
    year: number | null;
    color: string | null;
    vehicle_type: string | null;
    fuel_type: string | null;
    status: string;
    odometer: number;
    acquisition_date: string | null;
    disposal_date: string | null;
    external_source: string | null;
    external_id: string | null;
    metadata: Record<string, unknown> | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface MaintenanceVehicle {
    id: number;
    agency_id: number;
    unit_number: string;
    plate_number: string;
    status: string;
    agency?: Agency | null;
}

export interface ReservationVehicle {
    id: number;
    agency_id: number;
    unit_number: string;
    plate_number: string;
    status: string;
    agency?: Agency | null;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DashboardMetric {
    label: string;
    value: string | number;
    trend: string;
    accent?: 'positive' | 'negative' | 'neutral';
}

export interface DashboardReservationItem {
    id: number;
    vehicle_id: number;
    reservation_number: string;
    status: string;
    start_at: string;
    end_at: string;
    purpose: string | null;
    vehicle?: ReservationVehicle | null;
}

export interface DashboardMonthPoint {
    month: string;
    reservations: number;
    revenue: number;
    maintenance_cost: number;
}

export interface FinancialTransactionVehicle {
    id: number;
    agency_id: number;
    unit_number: string;
    plate_number: string;
    status: string;
    agency?: Agency | null;
}

export interface Reservation {
    id: number;
    agency_id: number;
    vehicle_id: number;
    vehicle?: ReservationVehicle | null;
    requested_by_user_id: number | null;
    approved_by_user_id: number | null;
    requestedBy?: User | null;
    approvedBy?: User | null;
    reservation_number: string;
    status: string;
    start_at: string;
    end_at: string;
    purpose: string | null;
    notes: string | null;
    checked_out_at: string | null;
    checked_in_at: string | null;
    external_source: string | null;
    external_id: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface ReservationCalendarEvent {
    id: number;
    vehicle_id: number;
    vehicle_label: string;
    title: string;
    status: string;
    start_at: string;
    end_at: string;
    reservation_number: string;
}

export interface Maintenance {
    id: number;
    agency_id: number;
    vehicle_id: number;
    vehicle?: MaintenanceVehicle | null;
    created_by_user_id: number | null;
    createdBy?: User | null;
    maintenance_number: string;
    type: string;
    status: string;
    scheduled_at: string | null;
    completed_at: string | null;
    odometer: number | null;
    vendor_name: string | null;
    cost: string;
    currency: string;
    description: string | null;
    next_due_at: string | null;
    next_due_odometer: number | null;
    external_source: string | null;
    external_id: string | null;
    metadata: Record<string, unknown> | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface FinancialTransaction {
    id: number;
    agency_id: number;
    vehicle_id: number | null;
    vehicle?: FinancialTransactionVehicle | null;
    reservation_id: number | null;
    maintenance_id: number | null;
    created_by_user_id: number | null;
    createdBy?: User | null;
    transaction_number: string;
    transaction_date: string;
    direction: string;
    category: string;
    status: string;
    amount: string;
    currency: string;
    description: string | null;
    reference: string | null;
    external_source: string | null;
    external_id: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface FinancialTransactionSummary {
    revenue: number;
    fuel_cost: number;
    insurance: number;
    maintenance_cost: number;
    other_expenses: number;
    expenses: number;
    profit: number;
    roi: number;
}

export interface FinancialTransactionCategoryBreakdownPoint {
    category: string;
    total: number;
}

export interface FinancialTransactionSeriesPoint {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
}
