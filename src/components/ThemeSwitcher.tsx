'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        // Check for saved theme preference or default to DARK
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        // Default to dark mode if no preference is saved
        const initialTheme = savedTheme || 'dark';

        setTheme(initialTheme);
        if (initialTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5 text-zinc-700" />
            ) : (
                <Sun className="w-5 h-5 text-zinc-300" />
            )}
        </button>
    );
}
