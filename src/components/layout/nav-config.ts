import type { LucideIcon } from "lucide-react";
import { Car, Home, Settings } from "lucide-react";

export interface NavSubItem {
  label: string;
  to: string;
}

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  children?: NavSubItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navConfig: NavGroup[] = [
  {
    label: "General",
    items: [{ label: "Inicio", to: "/", icon: Home }],
  },
  {
    label: "Inspecciones",
    items: [{ label: "Veh\u00edculos", to: "/vehicles", icon: Car }],
  },
  {
    label: "Administraci\u00f3n",
    items: [{ label: "Configuraci\u00f3n", to: "/settings", icon: Settings }],
  },
];
