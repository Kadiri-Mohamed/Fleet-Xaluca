export type VehicleStatusValue = 'available' | 'reserved' | 'maintenance' | 'inactive';

export interface Option {
    value: string;
    label: string;
}

export const vehicleStatusOptions: Option[] = [
    { value: 'available', label: 'Available' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inactive', label: 'Inactive' },
];

export const vehicleStatusLabels: Record<VehicleStatusValue, string> = {
    available: 'Available',
    reserved: 'Reserved',
    maintenance: 'Maintenance',
    inactive: 'Inactive',
};

export const vehicleStatusTone: Record<VehicleStatusValue, string> = {
    available: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    reserved: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    maintenance: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300',
    inactive: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300',
};
