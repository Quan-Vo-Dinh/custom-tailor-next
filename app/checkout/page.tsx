"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  MapPin,
  Ruler,
  Package,
  AlertCircle,
  ZoomIn,
  X,
  HelpCircle,
} from "lucide-react";
import { PaymentMethod } from "@/lib/mockData";
import { getMeasurements, createMeasurement } from "@/services/users";
import { getAddresses, createAddress } from "@/services/users";
import { Measurement, Address } from "@/types";
import { createOrder } from "@/services/orders";
import { getProductById } from "@/services/products";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type CheckoutStep = "cart" | "measurement" | "shipping" | "payment" | "confirm";

// Cart item type (from localStorage or URL)
type CartItem = {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    images: string[];
    basePrice: number;
  };
  fabricId: string;
  fabric: {
    id: string;
    name: string;
    color: string;
    price: number;
  };
  styleOptionIds: string[];
  styles: Array<{
    id: string;
    name: string;
    priceModifier: number;
  }>;
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [formData, setFormData] = useState({
    // Measurement
    measurementId: "",
    customMeasurement: {
      chest: "",
      waist: "",
      hips: "",
      shoulders: "",
      sleeveLength: "",
      inseam: "",
      neck: "",
      notes: "",
    },
    // Shipping
    addressId: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    notes: "",
    // Payment
    paymentMethod: PaymentMethod.COD,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const persistCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  // Load cart, measurements, and addresses on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load cart from localStorage
        const cartData = localStorage.getItem("cart");
        let validCartItems: CartItem[] = [];

        if (cartData) {
          const parsedCart = JSON.parse(cartData);
          const cartArray = Array.isArray(parsedCart) ? parsedCart : [];

          // Validate each cart item - check if product still exists
          const validationPromises = cartArray.map(async (item: CartItem) => {
            try {
              await getProductById(item.productId);
              return item; // Product exists, keep item
            } catch {
              console.warn(
                `Product ${item.productId} no longer exists, removing from cart`
              );
              return null; // Product doesn't exist, remove item
            }
          });

          const validationResults = await Promise.all(validationPromises);
          validCartItems = validationResults.filter(
            (item): item is CartItem => item !== null
          );

          // If some items were removed, update localStorage and notify user
          if (validCartItems.length < cartArray.length) {
            localStorage.setItem("cart", JSON.stringify(validCartItems));
            const removedCount = cartArray.length - validCartItems.length;
            toast.error(
              `${removedCount} sản phẩm đã bị xóa khỏi giỏ hàng do không còn tồn tại`
            );
          }

          setCartItems(validCartItems);
        }

        // Load measurements and addresses from API
        const [measurementsData, addressesData] = await Promise.all([
          getMeasurements().catch(() => []),
          getAddresses().catch(() => []),
        ]);

        setMeasurements(measurementsData);
        setAddresses(addressesData);

        // Set default address if available
        const defaultAddress = addressesData.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setFormData((prev) => ({
            ...prev,
            addressId: defaultAddress.id,
            fullName: defaultAddress.street.split(",")[0] || "",
            address: defaultAddress.street,
            city: defaultAddress.city,
          }));
        }
      } catch (error) {
        console.error("Failed to load checkout data:", error);
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const steps: {
    key: CheckoutStep;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: "cart", label: "Giỏ hàng", icon: ShoppingCart },
    { key: "measurement", label: "Số đo", icon: Ruler },
    { key: "shipping", label: "Giao hàng", icon: MapPin },
    { key: "payment", label: "Thanh toán", icon: CreditCard },
    { key: "confirm", label: "Xác nhận", icon: Package },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const itemBase =
        item.product.basePrice +
        item.fabric.price +
        item.styles.reduce((s, style) => s + style.priceModifier, 0);
      return sum + itemBase * item.quantity;
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Validation on blur
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "fullName":
        if (!value.trim()) {
          newErrors.fullName = "Vui lòng nhập họ tên";
        } else {
          delete newErrors.fullName;
        }
        break;
      case "phone":
        if (!value.trim()) {
          newErrors.phone = "Vui lòng nhập số điện thoại";
        } else if (!/^[0-9]{10,11}$/.test(value.replace(/\s/g, ""))) {
          newErrors.phone = "Số điện thoại không hợp lệ";
        } else {
          delete newErrors.phone;
        }
        break;
      case "email":
        if (!value.trim()) {
          newErrors.email = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Email không hợp lệ";
        } else {
          delete newErrors.email;
        }
        break;
      case "address":
        if (!value.trim()) {
          newErrors.address = "Vui lòng nhập địa chỉ";
        } else {
          delete newErrors.address;
        }
        break;
      case "city":
        if (!value.trim()) {
          newErrors.city = "Vui lòng chọn tỉnh/thành phố";
        } else {
          delete newErrors.city;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputBlur = (field: string, value: string) => {
    validateField(field, value);
  };

  const canProceed = () => {
    switch (currentStep) {
      case "cart":
        return cartItems.length > 0;
      case "measurement":
        return (
          formData.measurementId ||
          (formData.customMeasurement.chest &&
            formData.customMeasurement.waist &&
            formData.customMeasurement.shoulders)
        );
      case "shipping":
        if (formData.addressId) {
          // Đã chọn địa chỉ lưu sẵn: cho phép qua bước mà không cần nhập lại thông tin
          return true;
        }
        return (
          formData.fullName &&
          formData.address &&
          formData.city &&
          formData.phone &&
          formData.email &&
          !errors.fullName &&
          !errors.phone &&
          !errors.email &&
          !errors.address &&
          !errors.city
        );
      case "payment":
        return formData.paymentMethod;
      case "confirm":
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems((prev) => {
      const next = prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      );
      persistCart(next);
      return next;
    });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persistCart(next);
      return next;
    });
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleSubmitOrder = async () => {
    if (!canProceed() || cartItems.length === 0) {
      toast.error("Vui lòng kiểm tra lại thông tin đơn hàng");
      return;
    }

    setIsSubmitting(true);
    try {
      // Handle measurement - create new if custom, otherwise use existing
      let measurementId: string | undefined = formData.measurementId;
      if (!measurementId && formData.customMeasurement.chest) {
        // Create new measurement from custom data
        try {
          const newMeasurement = await createMeasurement({
            name: "Số đo đơn hàng",
            details: {
              chest: Number(formData.customMeasurement.chest),
              waist: Number(formData.customMeasurement.waist),
              hips: formData.customMeasurement.hips
                ? Number(formData.customMeasurement.hips)
                : undefined,
              shoulders: Number(formData.customMeasurement.shoulders),
              sleeveLength: formData.customMeasurement.sleeveLength
                ? Number(formData.customMeasurement.sleeveLength)
                : undefined,
              inseam: formData.customMeasurement.inseam
                ? Number(formData.customMeasurement.inseam)
                : undefined,
              neck: formData.customMeasurement.neck
                ? Number(formData.customMeasurement.neck)
                : undefined,
              notes: formData.customMeasurement.notes || undefined,
            },
          });
          measurementId = newMeasurement.id;
        } catch (error) {
          console.error("Failed to create measurement:", error);
          // Continue without measurementId if creation fails
        }
      }

      // Handle address - create new if not using saved address
      let addressId: string | undefined = formData.addressId;
      if (!addressId && formData.address && formData.city) {
        // Create new address from form data
        try {
          const newAddress = await createAddress({
            street: `${formData.address}${
              formData.ward ? `, ${formData.ward}` : ""
            }${formData.district ? `, ${formData.district}` : ""}`,
            city: formData.city,
            country: "Vietnam",
            isDefault: addresses.length === 0, // Set as default if first address
          });
          addressId = newAddress.id;
        } catch (error) {
          console.error("Failed to create address:", error);
          throw new Error("Không thể tạo địa chỉ. Vui lòng thử lại.");
        }
      }

      // Create order items - send ALL style option IDs
      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        fabricId: item.fabricId,
        quantity: item.quantity,
        // Send all style option IDs for correct price calculation
        styleOptionIds: item.styles?.map((s) => s.id) || [],
        measurementId: formData.measurementId || undefined,
      }));

      // Create order
      const order = await createOrder({
        addressId,
        measurementId,
        items: orderItems,
        paymentMethod:
          formData.paymentMethod === PaymentMethod.SEPAY
            ? "SEPAY"
            : formData.paymentMethod === PaymentMethod.STRIPE
            ? "STRIPE"
            : "COD",
        notes: formData.notes || undefined,
      });

      // Clear cart
      localStorage.removeItem("cart");

      setCreatedOrderId(order.id);
      setOrderComplete(true);
      toast.success("Đặt hàng thành công!");
    } catch (error: any) {
      console.error("Failed to create order:", error);
      toast.error(error.message || "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-6 lg:px-12">
          <GlassCard className="p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-light mb-4 text-white">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-400 mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
            </p>
            <Button
              variant="luxury"
              size="lg"
              onClick={() => router.push("/products")}
            >
              Mua sắm ngay
            </Button>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <GlassCard className="p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-light mb-4 text-white">
                Đặt Hàng{" "}
                <span className="text-yellow-600 italic">Thành Công!</span>
              </h2>
              <p className="text-gray-300 mb-2">
                Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.
              </p>
              {createdOrderId && (
                <p className="text-gray-400 text-sm mb-8">
                  Mã đơn hàng:{" "}
                  <span className="font-medium">{createdOrderId}</span>
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="luxury"
                  size="lg"
                  onClick={() => router.push("/orders")}
                >
                  Xem đơn hàng
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/")}
                >
                  Về trang chủ
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-black" />
        </div>

        <div className="container mx-auto px-6 lg:px-12">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-light mb-6 text-white">
              Thanh Toán
              <br />
              <span className="text-yellow-600 italic">Đơn Hàng</span>
            </h1>
            <p className="text-lg text-gray-300 font-light">
              Hoàn tất đơn hàng của bạn trong vài bước đơn giản
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-green-600"
                            : isActive
                            ? "bg-yellow-600"
                            : "bg-gray-700"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <StepIcon
                            className={`w-6 h-6 ${
                              isActive ? "text-white" : "text-gray-400"
                            }`}
                          />
                        )}
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          isActive || isCompleted
                            ? "text-gray-100"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 transition-colors ${
                          index < currentStepIndex
                            ? "bg-green-600"
                            : "bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-8">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard className="p-8">
                    {/* Cart Step */}
                    {currentStep === "cart" && (
                      <div>
                        <h2 className="text-2xl font-light mb-6 text-white">
                          Giỏ Hàng{" "}
                          <span className="text-yellow-600 italic">
                            Của Bạn
                          </span>
                        </h2>
                        <div className="space-y-4">
                          {cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-4 p-4 bg-gray-800/30 rounded-lg"
                            >
                              <div className="relative w-24 h-24 shrink-0">
                                <Image
                                  src={
                                    item.product.images[0] ||
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f3f4f6' width='300' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EProduct%3C/text%3E%3C/svg%3E"
                                  }
                                  alt={item.product.name}
                                  fill
                                  className="object-cover rounded"
                                  unoptimized
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-white mb-2">
                                  {item.product.name}
                                </h3>
                                <div className="text-sm text-gray-400 space-y-1">
                                  <p>
                                    Vải: {item.fabric.name} -{" "}
                                    {item.fabric.color}
                                  </p>
                                  <p>
                                    Phong cách:{" "}
                                    {item.styles.map((s) => s.name).join(", ")}
                                  </p>
                                  <div className="flex items-center gap-3">
                                    <span>Số lượng:</span>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleQuantityChange(item.id, -1)
                                        }
                                        disabled={item.quantity <= 1}
                                        className="px-2"
                                      >
                                        -
                                      </Button>
                                      <span className="w-8 text-center text-white">
                                        {item.quantity}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleQuantityChange(item.id, 1)
                                        }
                                        className="px-2"
                                      >
                                        +
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-medium text-yellow-600">
                                  {formatPrice(
                                    (item.product.basePrice +
                                      item.fabric.price +
                                      item.styles.reduce(
                                        (sum, s) => sum + s.priceModifier,
                                        0
                                      )) *
                                      item.quantity
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-3 text-red-400 hover:text-red-300"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  Xóa
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Measurement Step */}
                    {currentStep === "measurement" && (
                      <div>
                        <h2 className="text-2xl font-light mb-6 text-white">
                          Chọn{" "}
                          <span className="text-yellow-600 italic">Số Đo</span>
                        </h2>

                        {/* Size Guide Section */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-600/10 to-transparent border border-yellow-600/20 rounded-lg">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-yellow-600/20 rounded-lg">
                              <HelpCircle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-white mb-2">
                                Hướng dẫn đo số đo
                              </h3>
                              <p className="text-sm text-gray-400 mb-3">
                                Xem hướng dẫn chi tiết cách đo các số đo để đảm
                                bảo trang phục vừa vặn nhất.
                              </p>
                              <button
                                onClick={() => setShowSizeGuide(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-600 rounded-lg transition-colors text-sm font-medium cursor-pointer"
                              >
                                <ZoomIn className="w-4 h-4" />
                                Xem hướng dẫn đo size
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Saved Measurements */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-3 text-gray-100">
                            Số đo đã lưu
                          </label>
                          <div className="grid gap-3">
                            {measurements.length === 0 && (
                              <p className="text-gray-400 text-sm">
                                Bạn chưa có số đo nào. Vui lòng nhập số đo mới.
                              </p>
                            )}
                            {measurements.map((measurement) => (
                              <label
                                key={measurement.id}
                                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  formData.measurementId === measurement.id
                                    ? "border-yellow-600 bg-yellow-600/10"
                                    : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="measurement"
                                  value={measurement.id}
                                  checked={
                                    formData.measurementId === measurement.id
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      "measurementId",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-white mb-1">
                                    {measurement.name}
                                  </div>
                                  <div className="text-sm text-gray-400 grid grid-cols-4 gap-2">
                                    {measurement.chest && (
                                      <span>Ngực: {measurement.chest}cm</span>
                                    )}
                                    {measurement.waist && (
                                      <span>Eo: {measurement.waist}cm</span>
                                    )}
                                    {measurement.shoulders && (
                                      <span>
                                        Vai: {measurement.shoulders}cm
                                      </span>
                                    )}
                                    {measurement.sleeveLength && (
                                      <span>
                                        Tay: {measurement.sleeveLength}cm
                                      </span>
                                    )}
                                  </div>
                                  {measurement.notes && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {measurement.notes}
                                    </p>
                                  )}
                                  {measurement.isDefault && (
                                    <span className="text-xs text-yellow-600 mt-1">
                                      Mặc định
                                    </span>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Custom Measurement */}
                        <div>
                          <label className="flex items-center gap-2 mb-3">
                            <input
                              type="radio"
                              name="measurement"
                              checked={!formData.measurementId}
                              onChange={() =>
                                handleInputChange("measurementId", "")
                              }
                            />
                            <span className="text-sm font-medium text-gray-100">
                              Nhập số đo mới
                            </span>
                          </label>
                          {!formData.measurementId && (
                            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-800/30 rounded-lg">
                              <div>
                                <label
                                  htmlFor="chest"
                                  className="block text-sm font-medium mb-2 text-gray-200"
                                >
                                  Vòng ngực (cm) *
                                </label>
                                <input
                                  id="chest"
                                  type="number"
                                  value={formData.customMeasurement.chest}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      customMeasurement: {
                                        ...prev.customMeasurement,
                                        chest: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                                  placeholder="96"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="waist"
                                  className="block text-sm font-medium mb-2 text-gray-200"
                                >
                                  Vòng eo (cm) *
                                </label>
                                <input
                                  id="waist"
                                  type="number"
                                  value={formData.customMeasurement.waist}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      customMeasurement: {
                                        ...prev.customMeasurement,
                                        waist: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                                  placeholder="82"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="shoulders"
                                  className="block text-sm font-medium mb-2 text-gray-200"
                                >
                                  Vai (cm) *
                                </label>
                                <input
                                  id="shoulders"
                                  type="number"
                                  value={formData.customMeasurement.shoulders}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      customMeasurement: {
                                        ...prev.customMeasurement,
                                        shoulders: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                                  placeholder="44"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="sleeveLength"
                                  className="block text-sm font-medium mb-2 text-gray-200"
                                >
                                  Dài tay (cm)
                                </label>
                                <input
                                  id="sleeveLength"
                                  type="number"
                                  value={
                                    formData.customMeasurement.sleeveLength
                                  }
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      customMeasurement: {
                                        ...prev.customMeasurement,
                                        sleeveLength: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                                  placeholder="62"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Shipping Step */}
                    {currentStep === "shipping" && (
                      <div>
                        <h2 className="text-2xl font-light mb-6 text-white">
                          Thông Tin{" "}
                          <span className="text-yellow-600 italic">
                            Giao Hàng
                          </span>
                        </h2>

                        {/* Saved Addresses */}
                        {addresses.length > 0 && (
                          <div className="mb-6">
                            <label className="block text-sm font-medium mb-3 text-gray-100">
                              Địa chỉ đã lưu
                            </label>
                            <div className="grid gap-3">
                              {addresses.map((address) => (
                                <label
                                  key={address.id}
                                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    formData.addressId === address.id
                                      ? "border-yellow-600 bg-yellow-600/10"
                                      : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="address"
                                    value={address.id}
                                    checked={formData.addressId === address.id}
                                    onChange={(e) => {
                                      const selectedAddress = addresses.find(
                                        (a) => a.id === e.target.value
                                      );
                                      if (selectedAddress) {
                                        setFormData((prev) => ({
                                          ...prev,
                                          addressId: e.target.value,
                                          fullName:
                                            selectedAddress.street.split(
                                              ","
                                            )[0] || "",
                                          address: selectedAddress.street,
                                          city: selectedAddress.city,
                                        }));
                                      }
                                    }}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="font-medium text-white mb-1">
                                      {address.street}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {address.city}, {address.country}
                                    </div>
                                    {address.isDefault && (
                                      <span className="text-xs text-yellow-600 mt-1 inline-block">
                                        Mặc định
                                      </span>
                                    )}
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* New Address Form */}
                        <div>
                          <label className="flex items-center gap-2 mb-3">
                            <input
                              type="radio"
                              name="address"
                              checked={!formData.addressId}
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  addressId: "",
                                }))
                              }
                            />
                            <span className="text-sm font-medium text-gray-100">
                              {addresses.length > 0
                                ? "Nhập địa chỉ mới"
                                : "Nhập địa chỉ"}
                            </span>
                          </label>
                        </div>

                        {!formData.addressId && (
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label
                                  htmlFor="fullName"
                                  className="block text-sm font-medium mb-2 text-gray-200"
                                >
                                  Họ và tên *
                                </label>
                                <input
                                  id="fullName"
                                  type="text"
                                  value={formData.fullName}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "fullName",
                                      e.target.value
                                    )
                                  }
                                  onBlur={(e) =>
                                    handleInputBlur("fullName", e.target.value)
                                  }
                                  className={`w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors ${
                                    errors.fullName
                                      ? "border-red-500"
                                      : "border-white/20"
                                  }`}
                                  placeholder="Nguyễn Văn A"
                                />
                                {errors.fullName && (
                                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.fullName}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label
                                  htmlFor="phone"
                                  className="block text-sm font-medium mb-2 text-gray-200"
                                >
                                  Số điện thoại *
                                </label>
                                <input
                                  id="phone"
                                  type="tel"
                                  value={formData.phone}
                                  onChange={(e) =>
                                    handleInputChange("phone", e.target.value)
                                  }
                                  onBlur={(e) =>
                                    handleInputBlur("phone", e.target.value)
                                  }
                                  className={`w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors ${
                                    errors.phone
                                      ? "border-red-500"
                                      : "border-white/20"
                                  }`}
                                  placeholder="0901234567"
                                />
                                {errors.phone && (
                                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-2 text-gray-200"
                              >
                                Email *
                              </label>
                              <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                  handleInputChange("email", e.target.value)
                                }
                                onBlur={(e) =>
                                  handleInputBlur("email", e.target.value)
                                }
                                className={`w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors ${
                                  errors.email
                                    ? "border-red-500"
                                    : "border-white/20"
                                }`}
                                placeholder="email@example.com"
                              />
                              {errors.email && (
                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" />
                                  {errors.email}
                                </p>
                              )}
                            </div>
                            <div>
                              <label
                                htmlFor="address"
                                className="block text-sm font-medium mb-2 text-gray-200"
                              >
                                Địa chỉ *
                              </label>
                              <input
                                id="address"
                                type="text"
                                value={formData.address}
                                onChange={(e) =>
                                  handleInputChange("address", e.target.value)
                                }
                                onBlur={(e) =>
                                  handleInputBlur("address", e.target.value)
                                }
                                className={`w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors ${
                                  errors.address
                                    ? "border-red-500"
                                    : "border-white/20"
                                }`}
                                placeholder="123 Đường Lê Lợi"
                              />
                              {errors.address && (
                                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                  <AlertCircle className="w-4 h-4" />
                                  {errors.address}
                                </p>
                              )}
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                <label
                                  htmlFor="city"
                                  className="block text-sm font-medium mb-2 text-gray-200"
                                >
                                  Tỉnh/Thành phố *
                                </label>
                                <select
                                  id="city"
                                  value={formData.city}
                                  onChange={(e) =>
                                    handleInputChange("city", e.target.value)
                                  }
                                  onBlur={(e) =>
                                    handleInputBlur("city", e.target.value)
                                  }
                                  className={`w-full px-4 py-2 bg-white/10 text-white border rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors ${
                                    errors.city
                                      ? "border-red-500"
                                      : "border-white/20"
                                  }`}
                                >
                                  <option value="">Chọn tỉnh/thành</option>
                                  <option value="HCM">TP. Hồ Chí Minh</option>
                                  <option value="HN">Hà Nội</option>
                                  <option value="DN">Đà Nẵng</option>
                                </select>
                                {errors.city && (
                                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.city}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label
                                  htmlFor="district"
                                  className="block text-sm font-medium mb-2 text-gray-200"
                                >
                                  Quận/Huyện
                                </label>
                                <input
                                  id="district"
                                  type="text"
                                  value={formData.district}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "district",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                                  placeholder="Quận 1"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="ward"
                                  className="block text-sm font-medium mb-2 text-gray-200"
                                >
                                  Phường/Xã
                                </label>
                                <input
                                  id="ward"
                                  type="text"
                                  value={formData.ward}
                                  onChange={(e) =>
                                    handleInputChange("ward", e.target.value)
                                  }
                                  className="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                                  placeholder="Phường Bến Nghé"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="shippingNotes"
                                className="block text-sm font-medium mb-2 text-gray-200"
                              >
                                Ghi chú
                              </label>
                              <textarea
                                id="shippingNotes"
                                value={formData.notes}
                                onChange={(e) =>
                                  handleInputChange("notes", e.target.value)
                                }
                                rows={3}
                                className="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-500 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors resize-none"
                                placeholder="Ghi chú đặc biệt cho đơn hàng..."
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Payment Step */}
                    {currentStep === "payment" && (
                      <div>
                        <h2 className="text-2xl font-light mb-6 text-white">
                          Phương Thức{" "}
                          <span className="text-yellow-600 italic">
                            Thanh Toán
                          </span>
                        </h2>
                        <div className="space-y-3">
                          <label
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.paymentMethod === PaymentMethod.COD
                                ? "border-yellow-600 bg-yellow-600/10"
                                : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={PaymentMethod.COD}
                              checked={
                                formData.paymentMethod === PaymentMethod.COD
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "paymentMethod",
                                  e.target.value
                                )
                              }
                            />
                            <CreditCard className="w-6 h-6 text-gray-400" />
                            <div className="flex-1">
                              <div className="font-medium text-white">
                                Thanh toán khi nhận hàng (COD)
                              </div>
                              <div className="text-sm text-gray-400">
                                Thanh toán bằng tiền mặt khi nhận hàng
                              </div>
                            </div>
                          </label>
                          <label
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.paymentMethod === PaymentMethod.STRIPE
                                ? "border-yellow-600 bg-yellow-600/10"
                                : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={PaymentMethod.STRIPE}
                              checked={
                                formData.paymentMethod === PaymentMethod.STRIPE
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "paymentMethod",
                                  e.target.value
                                )
                              }
                            />
                            <CreditCard className="w-6 h-6 text-gray-400" />
                            <div className="flex-1">
                              <div className="font-medium text-white">
                                Thẻ tín dụng / Thẻ ghi nợ (Stripe)
                              </div>
                              <div className="text-sm text-gray-400">
                                Thanh toán an toàn qua Stripe
                              </div>
                            </div>
                          </label>
                          <label
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.paymentMethod === PaymentMethod.SEPAY
                                ? "border-yellow-600 bg-yellow-600/10"
                                : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={PaymentMethod.SEPAY}
                              checked={
                                formData.paymentMethod === PaymentMethod.SEPAY
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "paymentMethod",
                                  e.target.value
                                )
                              }
                            />
                            <CreditCard className="w-6 h-6 text-gray-400" />
                            <div className="flex-1">
                              <div className="font-medium text-white">
                                Chuyển khoản ngân hàng (Sepay)
                              </div>
                              <div className="text-sm text-gray-400">
                                Thanh toán qua chuyển khoản
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Confirm Step */}
                    {currentStep === "confirm" && (
                      <div>
                        <h2 className="text-2xl font-light mb-6 text-white">
                          Xác Nhận{" "}
                          <span className="text-yellow-600 italic">
                            Đơn Hàng
                          </span>
                        </h2>
                        <div className="space-y-6">
                          {/* Order Items */}
                          <div>
                            <h3 className="text-lg font-medium text-gray-200 mb-3">
                              Sản phẩm
                            </h3>
                            <div className="space-y-3">
                              {cartItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex gap-4 p-3 bg-gray-800/30 rounded-lg"
                                >
                                  <div className="relative w-16 h-16 shrink-0">
                                    <Image
                                      src={
                                        item.product.images[0] ||
                                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EProduct%3C/text%3E%3C/svg%3E"
                                      }
                                      alt={item.product.name}
                                      fill
                                      className="object-cover rounded"
                                      unoptimized
                                    />
                                  </div>
                                  <div className="flex-1 text-sm">
                                    <div className="font-medium text-white">
                                      {item.product.name}
                                    </div>
                                    <div className="text-gray-400">
                                      {item.fabric.name} • {item.styles.length}{" "}
                                      phong cách
                                    </div>
                                  </div>
                                  <div className="text-yellow-600 font-medium">
                                    {formatPrice(
                                      (item.product.basePrice +
                                        item.fabric.price +
                                        item.styles.reduce(
                                          (sum, s) => sum + s.priceModifier,
                                          0
                                        )) *
                                        item.quantity
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Info */}
                          <div>
                            <h3 className="text-lg font-medium text-gray-200 mb-3">
                              Thông tin giao hàng
                            </h3>
                            <div className="p-4 bg-gray-800/30 rounded-lg text-sm space-y-1">
                              <p className="text-white font-medium">
                                {formData.fullName}
                              </p>
                              <p className="text-gray-400">{formData.phone}</p>
                              <p className="text-gray-400">{formData.email}</p>
                              <p className="text-gray-400">
                                {formData.address}
                                {formData.ward && `, ${formData.ward}`}
                                {formData.district && `, ${formData.district}`}
                                {formData.city && `, ${formData.city}`}
                              </p>
                            </div>
                          </div>

                          {/* Payment Method */}
                          <div>
                            <h3 className="text-lg font-medium text-gray-200 mb-3">
                              Phương thức thanh toán
                            </h3>
                            <div className="p-4 bg-gray-800/30 rounded-lg text-sm">
                              <p className="text-white">
                                {formData.paymentMethod === PaymentMethod.COD &&
                                  "Thanh toán khi nhận hàng (COD)"}
                                {formData.paymentMethod ===
                                  PaymentMethod.STRIPE &&
                                  "Thẻ tín dụng / Thẻ ghi nợ (Stripe)"}
                                {formData.paymentMethod ===
                                  PaymentMethod.SEPAY &&
                                  "Chuyển khoản ngân hàng (Sepay)"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
                      {currentStepIndex > 0 && (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleBack}
                          className="flex-1"
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Quay lại
                        </Button>
                      )}
                      {currentStepIndex < steps.length - 1 ? (
                        <Button
                          variant="luxury"
                          size="lg"
                          onClick={handleNext}
                          disabled={!canProceed()}
                          className="flex-1"
                        >
                          Tiếp tục
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          variant="luxury"
                          size="lg"
                          onClick={handleSubmitOrder}
                          disabled={isSubmitting || !canProceed()}
                          className="flex-1"
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Đặt hàng
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-medium mb-4 text-white">
                    Tổng Đơn Hàng
                  </h3>
                  <div className="space-y-3 pb-4 border-b border-gray-700">
                    {cartItems.map((item) => {
                      const itemTotal =
                        (item.product.basePrice +
                          item.fabric.price +
                          item.styles.reduce(
                            (sum, s) => sum + s.priceModifier,
                            0
                          )) *
                        item.quantity;
                      return (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-300">
                            {item.product.name} x{item.quantity}
                          </span>
                          <span className="text-gray-100">
                            {formatPrice(itemTotal)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="space-y-2 py-4 border-b border-gray-700 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Tạm tính</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Phí vận chuyển</span>
                      <span className="text-green-500">Miễn phí</span>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4 text-lg font-medium">
                    <span className="text-white">Tổng cộng</span>
                    <span className="text-yellow-600 text-2xl">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gray-900 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-xl font-medium text-white">
                  Hướng dẫn đo số đo
                </h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Size Guide Image */}
                <div className="relative w-full bg-gray-800 rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/images/size-guide.svg"
                    alt="Hướng dẫn đo số đo"
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>

                {/* Measurement Instructions */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-yellow-600 text-lg">
                      Hướng dẫn cho Nữ (Áo dài)
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">1.</span>
                        <span>
                          <strong>Chiều dài áo:</strong> Đo từ cổ đến chân
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">2.</span>
                        <span>
                          <strong>Vòng cổ:</strong> Đo hết vòng cổ
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">3.</span>
                        <span>
                          <strong>Ngực trên:</strong> Đo phía trên ngực
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">
                          4a/4b.
                        </span>
                        <span>
                          <strong>Vòng ngực:</strong> Đo ngang qua đầu ngực
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">5.</span>
                        <span>
                          <strong>Vòng eo:</strong> Đo vòng eo tự nhiên
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">6.</span>
                        <span>
                          <strong>Vòng mông:</strong> Đo ngang mông
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">7.</span>
                        <span>
                          <strong>Chiều dài tay:</strong> Từ vai đến cửa tay
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-yellow-600 text-lg">
                      Hướng dẫn cho Nam (Áo dài)
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">1.</span>
                        <span>
                          <strong>Chiều dài áo:</strong> Đo từ cổ đến chân
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">2.</span>
                        <span>
                          <strong>Vòng cổ:</strong> Đo hết vòng cổ
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">3.</span>
                        <span>
                          <strong>Vai:</strong> Đo chiều rộng vai
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">4.</span>
                        <span>
                          <strong>Vòng nách:</strong> Đo vòng nách
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">9.</span>
                        <span>
                          <strong>Vòng ngực:</strong> Đo ngang qua đầu ngực
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">10.</span>
                        <span>
                          <strong>Vòng eo:</strong> Đo vòng eo tự nhiên
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 font-medium">8.</span>
                        <span>
                          <strong>Chiều dài tay:</strong> Từ vai đến cửa tay
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Tips */}
                <div className="mt-6 p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                  <h4 className="font-medium text-yellow-600 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Lưu ý khi đo
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Đo khi mặc quần áo mỏng hoặc đồ lót</li>
                    <li>• Giữ thước đo song song với mặt đất</li>
                    <li>• Không kéo căng thước đo quá chặt</li>
                    <li>• Nên nhờ người khác đo để kết quả chính xác hơn</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
