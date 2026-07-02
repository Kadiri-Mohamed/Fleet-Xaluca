import { Badge } from '@/components/ui/badge';
import { maintenanceStatusLabels, maintenanceStatusTone, type MaintenanceStatusValue } from '@/lib/maintenances';

interface MaintenanceStatusBadgeProps {
    status: MaintenanceStatusValue;
}

export function MaintenanceStatusBadge({ status }: MaintenanceStatusBadgeProps) {
    return <Badge className={maintenanceStatusTone[status]}>{maintenanceStatusLabels[status]}</Badge>;
}
