import {
  Home,
  User,
  Briefcase,
  BookOpen,
  Mail,
  Building2,
  Heart,
  TrendingUp,
  HandHeart,
  type LucideIcon,
} from "lucide-react";

export type NavAction = "home" | "toggle" | "navigate";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  action: NavAction;
}

// Patience Fero's personal navigation items
export const patienceNavItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home, action: "home" },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: Briefcase,
    action: "navigate",
  },
  {
    name: "About",
    href: "/portfolio/about",
    icon: User,
    action: "navigate",
  },
];

// Her Promise Fulfilled organization navigation items
export const organizationNavItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home, action: "home" },
  {
    name: "About",
    href: "/about",
    icon: Building2,
    action: "navigate",
  },
  {
    name: "Programs",
    href: "/programs",
    icon: Heart,
    action: "navigate",
  },
  {
    name: "Impact",
    href: "/impact",
    icon: TrendingUp,
    action: "navigate",
  },
  {
    name: "Donate",
    href: "/donate",
    icon: HandHeart,
    action: "navigate",
  },
  {
    name: "Blog",
    href: "/blog",
    icon: BookOpen,
    action: "navigate",
  },
  {
    name: "Contact",
    href: "/contact",
    icon: Mail,
    action: "navigate",
  },
];
