

import {
  Activity,
  Award,
  BadgeCheck,
  BadgeDollarSign,
  BadgePercent,
  Banknote,
  Bike,
  Bolt,
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  Bus,
  Car,
  CarFront,
  ChartColumn,
  CheckCircle,
  Circle,
  Clapperboard,
  Code,
  Coffee,
  Coins,
  CreditCard,
  Droplets,
  Dumbbell,
  FileText,
  Film,
  Flame,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  Hammer,
  HandCoins,
  Heart,
  HeartPulse,
  Home,
  House,
  Landmark,
  Laptop,
  LineChart,
  MonitorPlay,
  MoreHorizontal,
  Music,
  Package,
  Palette,
  ParkingCircle,
  PawPrint,
  Percent,
  PenTool,
  Pencil,
  PiggyBank,
  Plane,
  Receipt,
  School,
  ShieldPlus,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
  Stethoscope,
  TestTube,
  Ticket,
  TrendingUp,
  Tv,
  Utensils,
  UtensilsCrossed,
  Users,
  Wallet,
  Watch,
  Wifi,
  Wrench,
  Zap,
  CircleDollarSign,
  Folder,
  FolderOpen,
  FolderPlus,
} from "lucide-react-native";

import type { LucideIcon } from "lucide-react-native";

interface CategoryIconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/*
 * =========================================================
 * CATEGORY ICON MAP
 * =========================================================
 *
 * Keep the names aligned with the category icon values
 * returned by the backend.
 */

const ICON_MAP: Record<string, LucideIcon> = {
  /*
   * Activity / General
   */

  activity: Activity,
  award: Award,

  "badge-check": BadgeCheck,
  "badge-dollar-sign": BadgeDollarSign,
  "badge-percent": BadgePercent,

  /*
   * Money / Finance
   */

  banknote: Banknote,
  cash: CircleDollarSign,
  coins: Coins,
  "hand-coins": HandCoins,
  percent: Percent,
  "piggy-bank": PiggyBank,
  wallet: Wallet,

  /*
   * Business / Work
   */

  briefcase: Briefcase,
  "briefcase-business": BriefcaseBusiness,
  "building-2": Building2,
  landmark: Landmark,

  /*
   * Transportation
   */

  bike: Bike,
  bus: Bus,
  car: Car,
  "car-front": CarFront,
  plane: Plane,
  fuel: Fuel,
  "parking-circle": ParkingCircle,

  /*
   * Shopping
   */

  "shopping-bag": ShoppingBag,
  "shopping-cart": ShoppingCart,
  package: Package,
  shirt: Shirt,

  /*
   * Food / Dining
   */

  coffee: Coffee,
  utensils: Utensils,
  "utensils-crossed": UtensilsCrossed,

  /*
   * Entertainment
   */

  clapperboard: Clapperboard,
  film: Film,
  gamepad: Gamepad2,
  "gamepad-2": Gamepad2,
  music: Music,
  "monitor-play": MonitorPlay,
  ticket: Ticket,
  tv: Tv,

  /*
   * Health / Fitness
   */

  dumbbell: Dumbbell,
  heart: Heart,
  "heart-pulse": HeartPulse,
  stethoscope: Stethoscope,
  "shield-plus": ShieldPlus,

  /*
   * Education
   */

  education: GraduationCap,
  "graduation-cap": GraduationCap,
  school: School,
  "book-open": BookOpen,

  /*
   * Technology
   */

  code: Code,
  laptop: Laptop,
  smartphone: Smartphone,
  wifi: Wifi,

  /*
   * Home / Lifestyle
   */

  home: Home,
  house: House,
  sofa: Sofa,

  /*
   * Tools / Work
   */

  hammer: Hammer,
  wrench: Wrench,
  "pen-tool": PenTool,
  pencil: Pencil,

  /*
   * Utilities
   */

  bolt: Bolt,
  droplets: Droplets,
  flame: Flame,
  zap: Zap,

  /*
   * Documents / Records
   */

  "file-text": FileText,
  receipt: Receipt,

  /*
   * Gifts / People
   */

  gift: Gift,
  users: Users,
  "paw-print": PawPrint,
  paw: PawPrint,

  /*
   * Charts / Analytics
   */

  "chart-column": ChartColumn,
  "line-chart": LineChart,
  "trending-up": TrendingUp,

  /*
   * Miscellaneous
   */

  circle: Circle,
  palette: Palette,
  sparkles: Sparkles,
  watch: Watch,

  /*
   * Folders
   */

  folder: Folder,
  "folder-open": FolderOpen,
  "folder-plus": FolderPlus,

  /*
   * Other
   */

  "credit-card": CreditCard,
  more: MoreHorizontal,
};

/*
 * =========================================================
 * CATEGORY ICON COMPONENT
 * =========================================================
 */

export function CategoryIcon({
  name,
  size = 20,
  color = "#111111",
  strokeWidth = 2,
}: CategoryIconProps) {
  const normalizedName = name
    .trim()
    .toLowerCase();

  const Icon =
    ICON_MAP[normalizedName] ?? Folder;

  return (
    <Icon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
}

/*
 * =========================================================
 * AVAILABLE ICON OPTIONS
 * =========================================================
 *
 * Useful later for Create/Edit Category screens.
 */

export const CATEGORY_ICON_OPTIONS =
  Object.keys(ICON_MAP);