import { useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const isBrowser = () => typeof window !== 'undefined';

const getMediaQuery = () => {
    if (!isBrowser()) {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const prefersDark = () => getMediaQuery()?.matches ?? false;

const applyTheme = (appearance: Appearance) => {
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
};

const handleSystemThemeChange = () => {
    if (!isBrowser()) {
        return;
    }

    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    applyTheme(currentAppearance || 'system');
};

export function initializeTheme() {
    if (!isBrowser()) {
        return;
    }

    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';

    applyTheme(savedAppearance);

    getMediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('system');

    const updateAppearance = (mode: Appearance) => {
        if (!isBrowser()) {
            setAppearance(mode);
            return;
        }

        setAppearance(mode);
        localStorage.setItem('appearance', mode);
        applyTheme(mode);
    };

    useEffect(() => {
        if (!isBrowser()) {
            return;
        }

        const savedAppearance = localStorage.getItem('appearance') as Appearance | null;
        updateAppearance(savedAppearance || 'system');

        return () => getMediaQuery()?.removeEventListener('change', handleSystemThemeChange);
    }, []);

    return { appearance, updateAppearance };
}
