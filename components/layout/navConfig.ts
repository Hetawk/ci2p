import {
  Home,
  User,
  Briefcase,
  BookOpen,
  Mail,
  Heart,
  Building2,
  DollarSign,
  Users,
  FileText,
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
  { name: "About", href: "/about", icon: User, action: "navigate" },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: Briefcase,
    action: "navigate",
  },
  { name: "Blog", href: "/blog", icon: BookOpen, action: "navigate" },
  { name: "Contact", href: "/contact", icon: Mail, action: "navigate" },
  { name: "Her Promise", href: "#herpromise", icon: Heart, action: "toggle" },
];

// Her Promise Fulfilled organization navigation items
export const organizationNavItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home, action: "home" },
  {
    name: "About Us",
    href: "/herpromise/about",
    icon: Building2,
    action: "navigate",
  },
  {
    name: "Programs",
    href: "/herpromise/programs",
    icon: Users,
    action: "navigate",
  },
  {
    name: "Impact",
    href: "/herpromise/impact",
    icon: FileText,
    action: "navigate",
  },
  {
    name: "Donate",
    href: "/herpromise/donate",
    icon: DollarSign,
    action: "navigate",
  },
  { name: "Patience", href: "#patience", icon: User, action: "toggle" },
];
