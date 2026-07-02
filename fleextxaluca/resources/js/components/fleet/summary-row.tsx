interface SummaryRowProps {
    label: string;
    value: string;
}

export function SummaryRow({ label, value }: SummaryRowProps) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-lg border bg-background px-3 py-2">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
}
