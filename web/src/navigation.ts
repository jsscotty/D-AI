import {createLocalizedPathnamesNavigation, createSharedPathnamesNavigation, Pathnames} from 'next-intl/navigation';
 
export const locales = ['en', 'de'] as const;
export const localePrefix = 'always'; // Default

export const pathnames = {
    '/': '/',
    '/search': {
        en: '/search',
        de: '/suchen'
    },
    
    '/chat': '/chat'
} satisfies Pathnames<typeof locales>;
 
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createLocalizedPathnamesNavigation({locales, localePrefix, pathnames});