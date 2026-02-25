import type { LucideIcon } from "lucide-react";
import { Home, Settings } from "lucide-react";

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
    label: "Overview",
    items: [{ label: "Home", to: "/", icon: Home }],
  },
  {
    label: "Administration",
    items: [{ label: "Settings", to: "/settings", icon: Settings }],
  },
];
