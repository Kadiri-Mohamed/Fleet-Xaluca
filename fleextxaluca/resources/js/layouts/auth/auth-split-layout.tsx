import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center overflow-hidden bg-background px-6 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col overflow-hidden border-r border-border/60 p-10 text-white lg:flex">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(221_83%_53%_/_0.35),transparent_32%),linear-gradient(160deg,hsl(240_10%_10%),hsl(240_10%_4%))]" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,transparent_49%,hsl(255_100%_100%/_0.05)_50%,transparent_51%,transparent_100%)] bg-[length:18px_18px] opacity-40" />
                <Link href={route('home')} className="relative z-20 flex items-center text-lg font-medium">
                    <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                    {name}
                </Link>
                <div className="relative z-20 mt-auto max-w-sm space-y-2 text-sm text-neutral-300">
                    <p>Fleet operations, reservations, maintenance, and financial tracking in one place.</p>
                </div>
            </div>
            <div className="w-full bg-[radial-gradient(circle_at_top,hsl(221_83%_53%_/_0.05),transparent_28%)] lg:p-10">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-muted-foreground text-sm text-balance">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
