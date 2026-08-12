import { CategoryLevel } from "../../../common/enums/category-level.enum";
import { CategoryType } from "../../../common/enums/category-type.enum";

export const SYSTEM_CATEGORIES = [
  // ===========================
  // EXPENSE
  // ===========================

  {
    name: "Food",
    type: CategoryType.EXPENSE,
    level: CategoryLevel.PARENT,
    icon: "utensils",
    color: "#F97316",
    subcategories: [
      { name: "Groceries", icon: "shopping-cart", color: "#F97316" },
      { name: "Restaurants", icon: "utensils-crossed", color: "#F97316" },
      { name: "Food Delivery", icon: "bike", color: "#F97316" },
      { name: "Snacks & Beverages", icon: "coffee", color: "#F97316" },
    ],
  },

  {
    name: "Transportation",
    type: CategoryType.EXPENSE,
    level: CategoryLevel.PARENT,
    icon: "car",
    color: "#3B82F6",
    subcategories: [
      { name: "Fuel", icon: "fuel", color: "#3B82F6" },
      { name: "Taxi/Cab", icon: "car-front", color: "#3B82F6" },
      { name: "Public Transport", icon: "bus", color: "#3B82F6" },
      { name: "Parking", icon: "parking-circle", color: "#3B82F6" },
      { name: "Vehicle Maintenance", icon: "wrench", color: "#3B82F6" },
    ],
  },

  {
    name: "Housing",
    type: CategoryType.EXPENSE,
    level: CategoryLevel.PARENT,
    icon: "house",
    color: "#10B981",
    subcategories: [
      { name: "Rent", icon: "home", color: "#10B981" },
      { name: "Home Loan (EMI)", icon: "landmark", color: "#10B981" },
      { name: "Maintenance", icon: "hammer", color: "#10B981" },
      { name: "Furniture", icon: "sofa", color: "#10B981" },
      { name: "Household Items", icon: "package", color: "#10B981" },
    ],
  },

  {
    name: "Utilities",
    type: CategoryType.EXPENSE,
    level: CategoryLevel.PARENT,
    icon: "bolt",
    color: "#FACC15",
    subcategories: [
      { name: "Electricity", icon: "zap", color: "#FACC15" },
      { name: "Water", icon: "droplets", color: "#FACC15" },
      { name: "Gas", icon: "flame", color: "#FACC15" },
      { name: "Internet", icon: "wifi", color: "#FACC15" },
      { name: "Mobile Recharge", icon: "smartphone", color: "#FACC15" },
    ],
  },

  {
    name: "Healthcare",
    type: CategoryType.EXPENSE,
    level: CategoryLevel.PARENT,
    icon: "heart-pulse",
    color: "#EF4444",
    subcategories: [
      { name: "Doctor Consultation", icon: "stethoscope", color: "#EF4444" },
      { name: "Medicines", icon: "pill", color: "#EF4444" },
      { name: "Health Insurance", icon: "shield-plus", color: "#EF4444" },
      { name: "Medical Tests", icon: "test-tube", color: "#EF4444" },
      { name: "Fitness", icon: "dumbbell", color: "#EF4444" },
    ],
  },

  {
    name: "Entertainment",
    type: CategoryType.EXPENSE,
    level: CategoryLevel.PARENT,
    icon: "film",
    color: "#8B5CF6",
    subcategories: [
      { name: "Movies", icon: "clapperboard", color: "#8B5CF6" },
      { name: "OTT Subscriptions", icon: "tv", color: "#8B5CF6" },
      { name: "Gaming", icon: "gamepad-2", color: "#8B5CF6" },
      { name: "Events", icon: "ticket", color: "#8B5CF6" },
      { name: "Hobbies", icon: "palette", color: "#8B5CF6" },
    ],
  },

  {
    name: "Shopping",
    type: CategoryType.EXPENSE,
    level: CategoryLevel.PARENT,
    icon: "shopping-bag",
    color: "#EC4899",
    subcategories: [
      { name: "Clothing", icon: "shirt", color: "#EC4899" },
      { name: "Electronics", icon: "laptop", color: "#EC4899" },
      { name: "Accessories", icon: "watch", color: "#EC4899" },
      { name: "Beauty & Personal Care", icon: "sparkles", color: "#EC4899" },
    ],
  },

  {
    name: "Education",
    type: CategoryType.EXPENSE,
    level: CategoryLevel.PARENT,
    icon: "graduation-cap",
    color: "#06B6D4",
    subcategories: [
      { name: "Tuition Fees", icon: "school", color: "#06B6D4" },
      { name: "Books", icon: "book-open", color: "#06B6D4" },
      { name: "Online Courses", icon: "monitor-play", color: "#06B6D4" },
      { name: "Certifications", icon: "badge-check", color: "#06B6D4" },
      { name: "Stationery", icon: "pencil", color: "#06B6D4" },
    ],
  },

  {
    name: "Others",
    type: CategoryType.EXPENSE,
    level: CategoryLevel.PARENT,
    icon: "circle",
    color: "#6B7280",
    subcategories: [
      { name: "Miscellaneous", icon: "circle", color: "#6B7280" },
    ],
  },

  // ===========================
  // INCOME
  // ===========================

  {
    name: "Salary",
    type: CategoryType.INCOME,
    level: CategoryLevel.PARENT,
    icon: "wallet",
    color: "#22C55E",
    subcategories: [
      { name: "Monthly Salary", icon: "wallet", color: "#22C55E" },
      { name: "Bonus", icon: "badge-dollar-sign", color: "#22C55E" },
      { name: "Overtime", icon: "clock", color: "#22C55E" },
    ],
  },

  {
    name: "Freelance",
    type: CategoryType.INCOME,
    level: CategoryLevel.PARENT,
    icon: "briefcase",
    color: "#3B82F6",
    subcategories: [
      { name: "Software Projects", icon: "code", color: "#3B82F6" },
      { name: "Consulting", icon: "briefcase-business", color: "#3B82F6" },
      { name: "Design", icon: "pen-tool", color: "#3B82F6" },
      { name: "Content Writing", icon: "file-text", color: "#3B82F6" },
    ],
  },

  {
    name: "Business",
    type: CategoryType.INCOME,
    level: CategoryLevel.PARENT,
    icon: "building-2",
    color: "#8B5CF6",
    subcategories: [
      { name: "Sales Revenue", icon: "receipt", color: "#8B5CF6" },
      { name: "Client Payments", icon: "credit-card", color: "#8B5CF6" },
      { name: "Profit Distribution", icon: "coins", color: "#8B5CF6" },
    ],
  },

  {
    name: "Investment",
    type: CategoryType.INCOME,
    level: CategoryLevel.PARENT,
    icon: "trending-up",
    color: "#F59E0B",
    subcategories: [
      { name: "Interest", icon: "percent", color: "#F59E0B" },
      { name: "Dividends", icon: "banknote", color: "#F59E0B" },
      { name: "Capital Gains", icon: "chart-column", color: "#F59E0B" },
      { name: "Mutual Funds", icon: "line-chart", color: "#F59E0B" },
    ],
  },

  {
    name: "Gift",
    type: CategoryType.INCOME,
    level: CategoryLevel.PARENT,
    icon: "gift",
    color: "#EC4899",
    subcategories: [
      { name: "Cash Gift", icon: "gift", color: "#EC4899" },
      { name: "Family Support", icon: "users", color: "#EC4899" },
      { name: "Rewards", icon: "award", color: "#EC4899" },
      { name: "Cashback", icon: "badge-percent", color: "#EC4899" },
    ],
  },

  {
    name: "Others",
    type: CategoryType.INCOME,
    level: CategoryLevel.PARENT,
    icon: "circle",
    color: "#6B7280",
    subcategories: [
      { name: "Miscellaneous", icon: "circle", color: "#6B7280" },
    ],
  },
];