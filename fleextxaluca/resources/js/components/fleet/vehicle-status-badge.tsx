import { Badge } from '@/components/ui/badge';
import { vehicleStatusLabels, vehicleStatusTone, type VehicleStatusValue } from '@/lib/fleet';

interface VehicleStatusBadgeProps {
    status: VehicleStatusValue;
}

export function VehicleStatusBadge({ status }: VehicleStatusBadgeProps) {
    return <Badge className={vehicleStatusTone[status]}>{vehicleStatusLabels[status]}</Badge>;
}
