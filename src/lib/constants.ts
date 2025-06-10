import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, School, ClipboardPlus, ListChecks, BookOpenCheck } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Alumnos',
    href: '/alumnos',
    icon: Users,
  },
  {
    label: 'Colegios',
    href: '/colegios',
    icon: School,
  },
  {
    label: 'Asignaciones',
    href: '/asignaciones',
    icon: ClipboardPlus,
  },
  {
    label: 'Seguimiento',
    href: '/seguimiento',
    icon: ListChecks,
  },
];

export const APP_NAME = "Prácticas Conectadas";
export const APP_LOGO_ICON = BookOpenCheck;
