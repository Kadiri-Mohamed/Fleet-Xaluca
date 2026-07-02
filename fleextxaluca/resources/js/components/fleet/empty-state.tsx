import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="rounded-full border bg-muted p-3 text-muted-foreground">
                    <Inbox className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="max-w-md text-sm text-muted-foreground">{description}</p>
                </div>
                {actionHref && actionLabel ? (
                    <Button asChild>
                        <Link href={actionHref}>{actionLabel}</Link>
                    </Button>
                ) : null}
            </CardContent>
        </Card>
    );
}
