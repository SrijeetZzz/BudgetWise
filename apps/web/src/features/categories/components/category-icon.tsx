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
  Heart,
  HeartPulse,
  Home,
  House,
  Landmark,
  Laptop,
  LineChart,
  MonitorPlay,
  Music,
  Package,
  Palette,
  ParkingCircle,
  PawPrint,
  Percent,
  PenTool,
  Pencil,
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
  type LucideIcon,
} from 'lucide-react';

export const categoryIcons: Record<
  string,
  LucideIcon
> = {
  activity: Activity,

  award: Award,

  'badge-check': BadgeCheck,
  'badge-dollar-sign': BadgeDollarSign,
  'badge-percent': BadgePercent,

  banknote: Banknote,

  bike: Bike,

  bolt: Bolt,

  'book-open': BookOpen,

  briefcase: Briefcase,
  'briefcase-business': BriefcaseBusiness,

  'building-2': Building2,

  bus: Bus,

  car: Car,
  'car-front': CarFront,

  'chart-column': ChartColumn,

  'check-circle': CheckCircle,

  circle: Circle,

  clapperboard: Clapperboard,

  code: Code,

  coffee: Coffee,

  coins: Coins,

  'credit-card': CreditCard,

  droplets: Droplets,

  dumbbell: Dumbbell,

  'file-text': FileText,

  film: Film,

  flame: Flame,

  fuel: Fuel,

  'gamepad-2': Gamepad2,

  gift: Gift,

  'graduation-cap': GraduationCap,

  hammer: Hammer,

  heart: Heart,
  'heart-pulse': HeartPulse,

  home: Home,
  house: House,

  landmark: Landmark,

  laptop: Laptop,

  'line-chart': LineChart,

  'monitor-play': MonitorPlay,

  music: Music,

  package: Package,

  palette: Palette,

  'parking-circle': ParkingCircle,

  'paw-print': PawPrint,
  paw: PawPrint,

  percent: Percent,

  'pen-tool': PenTool,

  pencil: Pencil,

  plane: Plane,

  receipt: Receipt,

  school: School,

  'shield-plus': ShieldPlus,

  shirt: Shirt,

  'shopping-bag': ShoppingBag,
  'shopping-cart': ShoppingCart,

  smartphone: Smartphone,

  sofa: Sofa,

  sparkles: Sparkles,

  stethoscope: Stethoscope,

  'test-tube': TestTube,

  ticket: Ticket,

  'trending-up': TrendingUp,

  tv: Tv,

  utensils: Utensils,
  'utensils-crossed': UtensilsCrossed,

  users: Users,

  wallet: Wallet,

  watch: Watch,

  wifi: Wifi,

  wrench: Wrench,

  zap: Zap,
};

interface CategoryIconProps {
  name: string;
  className?: string;
}

export function CategoryIcon({
  name,
  className,
}: CategoryIconProps) {
  const normalizedName = name
    .trim()
    .toLowerCase();

  const Icon =
    categoryIcons[normalizedName] ?? Receipt;

  return <Icon className={className} />;
}

export const CATEGORY_ICON_OPTIONS =
  Object.keys(categoryIcons);