# Custom Tailor Frontend - UI Implementation Guide

## ✅ Đã hoàn thành

### 1. API Service Layer

- ✅ `lib/api.ts` - Axios configuration with interceptors
- ✅ `services/products.ts` - Product API services
- ✅ `services/appointments.ts` - Appointment API services

### 2. UI Components

- ✅ `components/ui/LoadingSpinner.tsx` - Loading states & skeletons
- ✅ `components/ui/ErrorMessage.tsx` - Error & empty states
- ✅ `components/ui/ProductCard.tsx` - Product card component

### 3. Dependencies

- ✅ Installed `axios` for API calls

## 🔧 Cấu hình cần thiết

### Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 Các trang cần implement

### 1. Products List Page (`/products`)

**File:** `app/products/page.tsx`

**Features cần có:**

- ✅ Fetch products từ API với `getProducts()`
- ✅ Search bar với debounce
- ✅ Filters: Category, Price range
- ✅ Sorting: Name, Price, Date
- ✅ Pagination
- ✅ Loading skeleton
- ✅ Error handling
- ✅ Empty state

**Component structure:**

```tsx
"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/services/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/LoadingSpinner";
import { ErrorMessage, EmptyState } from "@/components/ui/ErrorMessage";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getProducts({
          page: currentPage,
          limit: 12,
          search: searchQuery,
          category: selectedCategory,
        });
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Header */}
      {/* Filter Bar */}
      {/* Products Grid */}
      {loading ? (
        <ProductCardSkeleton count={12} />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {/* Pagination */}
    </div>
  );
}
```

### 2. Product Detail Page (`/products/[id]`)

**File:** `app/products/[id]/page.tsx`

**Features cần có:**

- Image gallery with thumbnails
- Product info (name, description, base price)
- Fabric selector (grid of fabric cards)
- Style options selector (checkboxes/radio buttons)
- Price calculator (real-time)
- Measurement form or selector
- Add to cart button
- Related products

**Components cần tạo:**

#### `components/ProductImageGallery.tsx`

```tsx
"use client";
import { useState } from "react";
import Image from "next/image";

export const ProductImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div>
      {/* Main image */}
      <div className="aspect-square relative">
        <Image src={images[selectedImage]} fill />
      </div>
      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        {images.map((img, idx) => (
          <button key={idx} onClick={() => setSelectedImage(idx)}>
            <Image src={img} width={100} height={100} />
          </button>
        ))}
      </div>
    </div>
  );
};
```

#### `components/FabricSelector.tsx`

```tsx
"use client";
import { GlassCard } from "./ui/GlassCard";

export const FabricSelector = ({ fabrics, selected, onSelect }) => {
  return (
    <div>
      <h3 className="text-xl mb-4">Chọn Vải</h3>
      <div className="grid grid-cols-3 gap-4">
        {fabrics.map((fabric) => (
          <GlassCard
            key={fabric.id}
            className={`cursor-pointer ${
              selected === fabric.id ? "ring-2 ring-gold" : ""
            }`}
            onClick={() => onSelect(fabric.id)}
          >
            <Image src={fabric.image} width={100} height={100} />
            <p>{fabric.name}</p>
            <p>+{fabric.price.toLocaleString()}₫</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
```

#### `components/StyleSelector.tsx`

```tsx
"use client";

export const StyleSelector = ({ styles, selected, onSelect }) => {
  return (
    <div>
      <h3 className="text-xl mb-4">Tùy Chọn Kiểu Dáng</h3>
      {styles.map((style) => (
        <label key={style.id} className="flex items-center gap-3 p-4">
          <input
            type="checkbox"
            checked={selected.includes(style.id)}
            onChange={() => onSelect(style.id)}
          />
          <span>{style.name}</span>
          <span>+{style.priceModifier.toLocaleString()}₫</span>
        </label>
      ))}
    </div>
  );
};
```

#### `components/PriceCalculator.tsx`

```tsx
"use client";

export const PriceCalculator = ({ basePrice, fabricPrice, stylePrice }) => {
  const total = basePrice + fabricPrice + stylePrice;

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl mb-4">Chi Tiết Giá</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Giá cơ bản:</span>
          <span>{basePrice.toLocaleString()}₫</span>
        </div>
        <div className="flex justify-between">
          <span>Vải:</span>
          <span>{fabricPrice.toLocaleString()}₫</span>
        </div>
        <div className="flex justify-between">
          <span>Kiểu dáng:</span>
          <span>{stylePrice.toLocaleString()}₫</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold text-lg">
          <span>Tổng cộng:</span>
          <span className="text-luxury">{total.toLocaleString()}₫</span>
        </div>
      </div>
    </GlassCard>
  );
};
```

**Main Page Structure:**

```tsx
"use client";
import { useState, useEffect } from "react";
import { getProductById } from "@/services/products";
import { calculatePrice } from "@/services/products";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { FabricSelector } from "@/components/FabricSelector";
import { StyleSelector } from "@/components/StyleSelector";
import { PriceCalculator } from "@/components/PriceCalculator";

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [selectedStyles, setSelectedStyles] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(params.id);
      setProduct(data);
    };
    fetchProduct();
  }, [params.id]);

  const priceData =
    product && calculatePrice(product, selectedFabric, selectedStyles);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <ProductImageGallery images={product?.images} />

          {/* Right: Product Info */}
          <div>
            <h1 className="text-4xl font-light mb-4">{product?.name}</h1>
            <p className="text-lg mb-8">{product?.description}</p>

            <FabricSelector
              fabrics={product?.availableFabrics}
              selected={selectedFabric}
              onSelect={setSelectedFabric}
            />

            <StyleSelector
              styles={product?.availableStyles}
              selected={selectedStyles}
              onSelect={(id) => {
                setSelectedStyles((prev) =>
                  prev.includes(id)
                    ? prev.filter((x) => x !== id)
                    : [...prev, id]
                );
              }}
            />

            <PriceCalculator {...priceData} />

            <Button variant="luxury" size="lg" className="w-full mt-6">
              Thêm Vào Giỏ Hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. Booking Page (`/booking`)

**File:** `app/booking/page.tsx`

**Features cần có:**

- Calendar để chọn ngày
- Hiển thị time slots available từ API
- Form: type (consultation/fitting), notes
- Validation
- Confirmation dialog
- Success/error messages

**Components cần tạo:**

#### `components/Calendar.tsx`

```tsx
"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Calendar = ({ selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Logic hiển thị calendar grid
  // ...

  return (
    <div className="glass-luxury p-6 rounded-lg">
      {/* Header với tháng/năm và nút prev/next */}
      {/* Grid 7x6 của các ngày */}
    </div>
  );
};
```

#### `components/TimeSlotPicker.tsx`

```tsx
"use client";
import { useEffect, useState } from "react";
import { getAvailableSlots } from "@/services/appointments";

export const TimeSlotPicker = ({ date, selectedSlot, onSelect }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      const data = await getAvailableSlots(date);
      setSlots(data);
      setLoading(false);
    };
    if (date) fetchSlots();
  }, [date]);

  return (
    <div>
      <h3 className="text-xl mb-4">Chọn Giờ</h3>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {slots.map((slot) => (
            <button
              key={slot.id}
              disabled={!slot.available}
              className={`p-4 rounded ${
                slot.available
                  ? "bg-white hover:bg-gold"
                  : "bg-gray-200 cursor-not-allowed"
              }`}
              onClick={() => onSelect(slot)}
            >
              {slot.startTime}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

**Main Booking Page:**

```tsx
"use client";
import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { TimeSlotPicker } from "@/components/TimeSlotPicker";
import { createAppointment } from "@/services/appointments";

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [type, setType] = useState("CONSULTATION");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await createAppointment({
        type,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes,
      });
      // Show success message
      alert("Đặt lịch thành công!");
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-5xl font-light text-center mb-12">
          Đặt Lịch Tư Vấn
        </h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Date & Time */}
          <div>
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            {selectedDate && (
              <TimeSlotPicker
                date={selectedDate}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
              />
            )}
          </div>

          {/* Right: Form */}
          <div>
            <GlassCard className="p-6">
              <h3 className="text-xl mb-4">Thông Tin</h3>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Loại lịch hẹn</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 border rounded"
                  >
                    <option value="CONSULTATION">Tư vấn</option>
                    <option value="FITTING">Thử đồ</option>
                    <option value="PICKUP">Nhận hàng</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Ghi chú (tùy chọn)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full p-3 border rounded"
                  />
                </div>

                <Button
                  variant="luxury"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={!selectedDate || !selectedSlot || submitting}
                >
                  {submitting ? "Đang xử lý..." : "Xác Nhận Đặt Lịch"}
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 🎨 Style Guidelines

### Colors

```css
--color-gold: #d4af37
--color-charcoal: #1a1a1a
--color-cream: #faf7f2
```

### Components

- Use `GlassCard` for panels
- Use `Button` với variant="luxury" cho primary actions
- Use `AnimatedSection` để wrap sections với animation
- Use `LoadingSpinner` và `ProductCardSkeleton` cho loading states
- Use `ErrorMessage` và `EmptyState` cho error/empty states

### Responsive

- Mobile first approach
- Grid: `grid md:grid-cols-2 lg:grid-cols-3`
- Padding: `px-6 lg:px-12`
- Text: `text-base md:text-lg lg:text-xl`

## 🚀 Development Workflow

1. **Start backend:**

```bash
cd custom-tailor-server
pnpm run start:dev
```

2. **Start frontend:**

```bash
cd custom-tailor-next
npm run dev
```

3. **Check API:**

- Swagger: http://localhost:3001/api/docs
- Frontend: http://localhost:3000

## 📦 Additional Dependencies (if needed)

```bash
# Date picker
npm install react-datepicker @types/react-datepicker

# Form validation
npm install react-hook-form zod @hookform/resolvers

# Toast notifications
npm install react-hot-toast

# Image lightbox
npm install yet-another-react-lightbox
```

## ✨ Enhancement Ideas

1. **Shopping Cart**

   - Context/Zustand for cart state
   - Cart drawer component
   - Persistent storage (localStorage)

2. **Authentication**

   - Sign in/sign up pages
   - Protected routes
   - User profile page

3. **Order Management**

   - My orders page
   - Order detail/tracking
   - Order cancellation

4. **Measurement Management**
   - Save measurements
   - Measurement templates
   - Measurement history

## 🐛 Debugging Tips

1. **API Connection Issues:**

   - Check `.env.local` exists with correct `NEXT_PUBLIC_API_URL`
   - Check backend is running on port 3001
   - Check CORS settings in backend

2. **Type Errors:**

   - Make sure types in `types/index.ts` match backend DTOs
   - Use `as` keyword for type assertion if needed

3. **Rendering Issues:**
   - Use `"use client"` directive for client components
   - Check console for hydration errors
   - Verify data is loaded before rendering

---

**Happy Coding! 🎉**
