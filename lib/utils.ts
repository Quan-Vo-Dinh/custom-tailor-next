import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format ID dài thành mã ngắn gọn cho customer
 * Ví dụ: "cmjinxn3z002t9sqgz7xushan" -> "DH-002T9S"
 */
export function formatOrderCode(id: string): string {
  if (!id) return "N/A";
  // Lấy 6 ký tự cuối và uppercase
  const shortCode = id.slice(-6).toUpperCase();
  return `DH-${shortCode}`;
}

export function formatAppointmentCode(id: string): string {
  if (!id) return "N/A";
  // Lấy 6 ký tự cuối và uppercase
  const shortCode = id.slice(-6).toUpperCase();
  return `LH-${shortCode}`;
}

/**
 * Format giá tiền VND
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

/**
 * Format ngày tiếng Việt
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * Format datetime tiếng Việt
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
