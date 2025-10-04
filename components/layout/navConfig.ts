import {
  Home,
  User,
  Briefcase,
  BookOpen,
  Mail,
  Heart,
  Building2,
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
  { name: "Her Promise", href: "#herpromise", icon: Heart, action: "toggle" },
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
  { name: "Patience", href: "#patience", icon: User, action: "toggle" },
];
