import { PaginationLink } from '@/types';
import { Link } from '@inertiajs/react';

interface PaginationLinksProps {
    links: PaginationLink[];
}

export function PaginationLinks({ links }: PaginationLinksProps) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {links.map((link, index) => (
                <Link
                    key={`${link.label}-${index}`}
                    href={link.url ?? ''}
                    preserveScroll
                    className={[
                        'rounded-md border px-3 py-2 text-sm transition-colors',
                        link.active ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-foreground hover:bg-muted',
                        !link.url ? 'pointer-events-none opacity-50' : '',
                    ].join(' ')}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
