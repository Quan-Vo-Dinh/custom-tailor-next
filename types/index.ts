// User Types
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export enum ProductCategory {
  SUIT = "SUIT",
  SHIRT = "SHIRT",
  DRESS = "DRESS",
  COAT = "COAT",
  PANTS = "PANTS",
  VEST = "VEST",
}

export interface Fabric {
  id: string;
  name: string;
  material: string;
  color: string;
  price: number;
  image: string;
  stock: number;
  // API fields (mapping)
  imageUrl?: string;
  priceAdjustment?: string | number;
  description?: string;
}

export interface Style {
  id: string;
  name: string;
  category: string;
  description: string;
  priceModifier: number;
  // API fields (mapping)
  type?: string;
  imageUrl?: string;
  priceAdjustment?: string | number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  basePrice: number;
  description: string;
  images: string[];
  availableFabrics: Fabric[];
  availableStyles: Style[];
  featured?: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// Measurement Types
export interface Measurement {
  id: string;
  userId: string;
  name: string;
  details?: Record<string, any>;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulders?: number;
  sleeveLength?: number;
  inseam?: number;
  neck?: number;
  notes?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Address Types
export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PRODUCTION = "IN_PRODUCTION",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  SHIPPING = "SHIPPING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  COD = "COD",
  STRIPE = "STRIPE",
  SEPAY = "SEPAY",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  fabricId: string;
  fabric: Fabric;
  styleId: string;
  style: Style;
  measurementId: string;
  measurement: Measurement;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: User;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  shippingAddress?: string;
  notes?: string;
  assignedStaffId?: string;
  assignedStaff?: User;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Appointment Types
export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum AppointmentType {
  CONSULTATION = "CONSULTATION",
  FITTING = "FITTING",
  PICKUP = "PICKUP",
}

export interface Appointment {
  id: string;
  customerId: string;
  customer: User;
  type: AppointmentType;
  status: AppointmentStatus;
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
  assignedStaffId?: string;
  assignedStaff?: User;
  createdAt: Date;
  updatedAt: Date;
}

// Time Slot Types
export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  staffId?: string;
}
