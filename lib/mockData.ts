import { Fabric, TimeSlot, ProductCategory } from "@/types";

// Simple product type for mock data
interface MockProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  basePrice: number;
  images: string[];
  featured?: boolean;
  inStock?: boolean;
  createdAt: Date;
}

// Enum definitions for mock data (to avoid unused imports)
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

// Mock Products Data
export const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "Vest Công Sở Cao Cấp",
    slug: "vest-cong-so-cao-cap",
    description:
      "Vest công sở may đo cao cấp, form dáng chuẩn châu Âu, phù hợp cho các sự kiện trang trọng và công việc",
    category: ProductCategory.VEST,
    basePrice: 4500000,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80",
    ],
    featured: true,
    inStock: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Áo Sơ Mi Trắng Luxury",
    slug: "ao-so-mi-trang-luxury",
    description:
      "Áo sơ mi trắng cao cấp, vải cotton Ai Cập, thiết kế tinh tế cho người đàn ông thành đạt",
    category: ProductCategory.SHIRT,
    basePrice: 1800000,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    ],
    featured: true,
    inStock: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Quần Âu Dáng Slim",
    slug: "quan-au-dang-slim",
    description:
      "Quần âu dáng slim fit, tôn dáng, phù hợp cho môi trường công sở hiện đại",
    category: ProductCategory.PANTS,
    basePrice: 1500000,
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    ],
    featured: false,
    inStock: true,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    name: "Vest Cưới Sang Trọng",
    slug: "vest-cuoi-sang-trong",
    description:
      "Vest cưới may đo cao cấp, thiết kế độc quyền, tạo nên vẻ ngoài hoàn hảo trong ngày trọng đại",
    category: ProductCategory.VEST,
    basePrice: 8500000,
    images: [
      "https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    ],
    featured: true,
    inStock: true,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "5",
    name: "Áo Sơ Mi Họa Tiết",
    slug: "ao-so-mi-hoa-tiet",
    description: "Áo sơ mi họa tiết tinh tế, phong cách năng động và hiện đại",
    category: ProductCategory.SHIRT,
    basePrice: 1200000,
    images: [
      "https://images.unsplash.com/photo-1603252110971-b8a57087be18?w=800&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80",
    ],
    featured: false,
    inStock: true,
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "6",
    name: "Vest Dạ Hội Premium",
    slug: "vest-da-hoi-premium",
    description:
      "Vest dạ hội cao cấp, vải nhập khẩu Italia, thiết kế sang trọng cho các sự kiện đặc biệt",
    category: ProductCategory.VEST,
    basePrice: 12000000,
    images: [
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
      "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80",
      "https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?w=800&q=80",
    ],
    featured: true,
    inStock: true,
    createdAt: new Date("2024-02-20"),
  },
];

// Mock Fabrics Data
export const mockFabrics: Fabric[] = [
  {
    id: "fab-1",
    name: "Wool Luxury",
    material: "100% Wool",
    color: "Xanh Navy",
    price: 500000,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&q=80",
  },
  {
    id: "fab-2",
    name: "Cotton Ai Cập",
    material: "100% Cotton",
    color: "Trắng",
    price: 300000,
    stock: 40,
    image:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&q=80",
  },
  {
    id: "fab-3",
    name: "Linen Premium",
    material: "100% Linen",
    color: "Be",
    price: 400000,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80",
  },
  {
    id: "fab-4",
    name: "Wool Cashmere Blend",
    material: "70% Wool, 30% Cashmere",
    color: "Xám Than",
    price: 800000,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea3c501b?w=400&q=80",
  },
  {
    id: "fab-5",
    name: "Silk Cotton",
    material: "60% Cotton, 40% Silk",
    color: "Xanh Nhạt",
    price: 600000,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
  },
  {
    id: "fab-6",
    name: "Mohair Blend",
    material: "55% Mohair, 45% Wool",
    color: "Đen",
    price: 900000,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1558769132-92e717d613cd?w=400&q=80",
  },
];

// Mock Style Options Data - using priceModifier instead of price
interface MockStyle {
  id: string;
  category: string;
  name: string;
  description: string;
  priceModifier: number;
}

export const mockStyleOptions: MockStyle[] = [
  // Cổ áo
  {
    id: "style-1",
    category: "Cổ áo",
    name: "Cổ Vest Thanh Mảnh",
    description: "Cổ vest thanh mảnh, phong cách cổ điển",
    priceModifier: 0,
  },
  {
    id: "style-2",
    category: "Cổ áo",
    name: "Cổ Vest Rộng",
    description: "Cổ vest rộng, phong cách hiện đại",
    priceModifier: 100000,
  },
  {
    id: "style-3",
    category: "Cổ áo",
    name: "Cổ Shawl",
    description: "Cổ shawl sang trọng cho dạ hội",
    priceModifier: 200000,
  },

  // Tay áo
  {
    id: "style-4",
    category: "Tay áo",
    name: "Tay Dài Cơ Bản",
    description: "Tay dài kiểu cơ bản",
    priceModifier: 0,
  },
  {
    id: "style-5",
    category: "Tay áo",
    name: "Tay Dài Có Gấu",
    description: "Tay dài có gấu điều chỉnh được",
    priceModifier: 150000,
  },

  // Nút áo
  {
    id: "style-6",
    category: "Nút áo",
    name: "Nút Sừng Tự Nhiên",
    description: "Nút làm từ sừng tự nhiên",
    priceModifier: 50000,
  },
  {
    id: "style-7",
    category: "Nút áo",
    name: "Nút Kim Loại Cao Cấp",
    description: "Nút kim loại mạ vàng",
    priceModifier: 100000,
  },

  // Túi áo
  {
    id: "style-8",
    category: "Túi áo",
    name: "Túi Nắp Vát",
    description: "Túi có nắp vát góc",
    priceModifier: 0,
  },
  {
    id: "style-9",
    category: "Túi áo",
    name: "Túi Vuông",
    description: "Túi vuông phong cách công sở",
    priceModifier: 50000,
  },
  {
    id: "style-10",
    category: "Túi áo",
    name: "Túi Có Nắp",
    description: "Túi có nắp gài khuy",
    priceModifier: 80000,
  },

  // Lót trong
  {
    id: "style-11",
    category: "Lót trong",
    name: "Lót Viscose Cơ Bản",
    description: "Lót viscose tiêu chuẩn",
    priceModifier: 0,
  },
  {
    id: "style-12",
    category: "Lót trong",
    name: "Lót Cupro Cao Cấp",
    description: "Lót cupro mềm mại, sang trọng",
    priceModifier: 300000,
  },

  // Xẻ tà
  {
    id: "style-13",
    category: "Xẻ tà",
    name: "Không Xẻ Tà",
    description: "Không có xẻ tà",
    priceModifier: 0,
  },
  {
    id: "style-14",
    category: "Xẻ tà",
    name: "Xẻ Tà Giữa",
    description: "Xẻ tà ở giữa phía sau",
    priceModifier: 50000,
  },
  {
    id: "style-15",
    category: "Xẻ tà",
    name: "Xẻ Tà Hai Bên",
    description: "Xẻ tà hai bên phong cách Anh",
    priceModifier: 80000,
  },
];

// Mock Time Slots Data
export const generateMockTimeSlots = (date: string): TimeSlot[] => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPastDate = selectedDate < today;
  const isToday = selectedDate.toDateString() === today.toDateString();

  const timeSlots = [
    { startTime: "09:00", endTime: "10:00" },
    { startTime: "10:00", endTime: "11:00" },
    { startTime: "11:00", endTime: "12:00" },
    { startTime: "13:00", endTime: "14:00" },
    { startTime: "14:00", endTime: "15:00" },
    { startTime: "15:00", endTime: "16:00" },
    { startTime: "16:00", endTime: "17:00" },
    { startTime: "17:00", endTime: "18:00" },
  ];

  return timeSlots.map((slot, index) => {
    let available = true;

    // Past dates are all unavailable
    if (isPastDate) {
      available = false;
    }

    // For today, slots before current time are unavailable
    if (isToday) {
      const currentHour = new Date().getHours();
      const slotHour = parseInt(slot.startTime.split(":")[0]);
      if (slotHour <= currentHour) {
        available = false;
      }
    }

    // Randomly make some future slots unavailable (30% chance)
    if (available && Math.random() < 0.3) {
      available = false;
    }

    return {
      id: `slot-${date}-${index}`,
      date: date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      available,
    };
  });
};

// Mock Categories
export const mockCategories = [
  { id: "cat-1", name: "Vest", count: 12 },
  { id: "cat-2", name: "Sơ Mi", count: 18 },
  { id: "cat-3", name: "Quần", count: 15 },
  { id: "cat-4", name: "Áo Khoác", count: 8 },
];

// Helper Functions
export const getMockProductById = (id: string): MockProduct | null => {
  return mockProducts.find((p) => p.id === id) || null;
};

export const getMockProducts = (params?: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: string;
}): {
  products: MockProduct[];
  total: number;
  page: number;
  totalPages: number;
} => {
  let filtered = [...mockProducts];

  // Search filter
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (params?.category && params.category !== "all") {
    filtered = filtered.filter((p) => p.category === params.category);
  }

  // Price filter
  if (params?.minPrice) {
    filtered = filtered.filter((p) => p.basePrice >= params.minPrice!);
  }
  if (params?.maxPrice) {
    filtered = filtered.filter((p) => p.basePrice <= params.maxPrice!);
  }

  // Sorting
  if (params?.sort) {
    switch (params.sort) {
      case "price-asc":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
  }

  const total = filtered.length;
  const page = params?.page || 1;
  const limit = params?.limit || 12;
  const totalPages = Math.ceil(total / limit);

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const products = filtered.slice(startIndex, endIndex);

  return { products, total, page, totalPages };
};

export const calculateMockPrice = (
  basePrice: number,
  fabricId?: string,
  styleIds?: string[]
): {
  basePrice: number;
  fabricPrice: number;
  stylePrice: number;
  subtotal: number;
} => {
  const fabric = mockFabrics.find((f) => f.id === fabricId);
  const fabricPrice = fabric?.price || 0;

  let stylePrice = 0;
  if (styleIds && styleIds.length > 0) {
    styleIds.forEach((styleId) => {
      const style = mockStyleOptions.find((s) => s.id === styleId);
      if (style) {
        stylePrice += style.priceModifier;
      }
    });
  }

  const subtotal = basePrice + fabricPrice + stylePrice;

  return {
    basePrice,
    fabricPrice,
    stylePrice,
    subtotal,
  };
};

// Mock Measurements
export interface MockMeasurement {
  id: string;
  name: string;
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
}

export const mockMeasurements: MockMeasurement[] = [
  {
    id: "meas-1",
    name: "Số đo mặc định",
    chest: 96,
    waist: 82,
    hips: 98,
    shoulders: 44,
    sleeveLength: 62,
    inseam: 80,
    neck: 38,
    notes: "Số đo cơ bản, phù hợp cho vest công sở",
    isDefault: true,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "meas-2",
    name: "Số đo dự tiệc",
    chest: 98,
    waist: 84,
    hips: 100,
    shoulders: 45,
    sleeveLength: 63,
    inseam: 80,
    neck: 39,
    notes: "Form rộng hơn một chút, thoải mái hơn",
    isDefault: false,
    createdAt: new Date("2024-02-05"),
  },
];

// Mock Orders
export interface MockOrder {
  id: string;
  orderNumber: string;
  items: {
    id: string;
    productName: string;
    productImage: string;
    fabricName: string;
    styleNames: string[];
    measurementName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  shippingAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  estimatedDelivery?: Date;
}

export const mockOrders: MockOrder[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-2024-001",
    items: [
      {
        id: "item-1",
        productName: "Vest Công Sở Cao Cấp",
        productImage:
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
        fabricName: "Wool Luxury - Xanh Navy",
        styleNames: ["Hai khuy", "Hai túi hông"],
        measurementName: "Số đo mặc định",
        quantity: 1,
        unitPrice: 5000000,
        subtotal: 5000000,
      },
    ],
    status: OrderStatus.IN_PRODUCTION,
    paymentMethod: PaymentMethod.STRIPE,
    paymentStatus: PaymentStatus.PAID,
    totalAmount: 5000000,
    shippingAddress: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    notes: "Vui lòng hoàn thành trước ngày 15/3",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-05"),
    estimatedDelivery: new Date("2024-03-15"),
  },
  {
    id: "ord-2",
    orderNumber: "ORD-2024-002",
    items: [
      {
        id: "item-2",
        productName: "Áo Sơ Mi Trắng Luxury",
        productImage:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
        fabricName: "Cotton Ai Cập - Trắng",
        styleNames: ["Cổ Ý", "Tay dài"],
        measurementName: "Số đo mặc định",
        quantity: 2,
        unitPrice: 2100000,
        subtotal: 4200000,
      },
    ],
    status: OrderStatus.COMPLETED,
    paymentMethod: PaymentMethod.COD,
    paymentStatus: PaymentStatus.PAID,
    totalAmount: 4200000,
    shippingAddress: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-28"),
    completedAt: new Date("2024-02-28"),
  },
  {
    id: "ord-3",
    orderNumber: "ORD-2024-003",
    items: [
      {
        id: "item-3",
        productName: "Vest Cưới Sang Trọng",
        productImage:
          "https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=400&q=80",
        fabricName: "Cashmere Blend - Đen",
        styleNames: ["Ba khuy", "Hai túi hông", "Túi ngực có nắp"],
        measurementName: "Số đo dự tiệc",
        quantity: 1,
        unitPrice: 9000000,
        subtotal: 9000000,
      },
    ],
    status: OrderStatus.PENDING,
    paymentMethod: PaymentMethod.SEPAY,
    paymentStatus: PaymentStatus.PENDING,
    totalAmount: 9000000,
    notes: "Cần may gấp cho đám cưới ngày 20/3",
    createdAt: new Date("2024-03-08"),
    updatedAt: new Date("2024-03-08"),
    estimatedDelivery: new Date("2024-03-18"),
  },
  {
    id: "ord-4",
    orderNumber: "ORD-2024-004",
    items: [
      {
        id: "item-4",
        productName: "Quần Âu Dáng Slim",
        productImage:
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80",
        fabricName: "Silk Premium - Xám",
        styleNames: ["Dáng Slim fit"],
        measurementName: "Số đo mặc định",
        quantity: 3,
        unitPrice: 1900000,
        subtotal: 5700000,
      },
    ],
    status: OrderStatus.SHIPPING,
    paymentMethod: PaymentMethod.STRIPE,
    paymentStatus: PaymentStatus.PAID,
    totalAmount: 5700000,
    shippingAddress: "789 Đường Hai Bà Trưng, Quận 3, TP.HCM",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-03-07"),
    estimatedDelivery: new Date("2024-03-10"),
  },
];

export const getMockOrders = (params?: {
  status?: OrderStatus;
  sortBy?: string;
}): MockOrder[] => {
  let orders = [...mockOrders];

  // Status filter
  if (params?.status) {
    orders = orders.filter((o) => o.status === params.status);
  }

  // Sorting
  if (params?.sortBy) {
    switch (params.sortBy) {
      case "date-desc":
        orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "date-asc":
        orders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case "amount-desc":
        orders.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "amount-asc":
        orders.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
    }
  }

  return orders;
};
