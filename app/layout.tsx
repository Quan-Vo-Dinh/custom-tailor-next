import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Custom Tailor - May Đo Cao Cấp",
  description:
    "Nghệ thuật may đo tinh tế - Thời trang may đo cao cấp với phong cách sang trọng, thanh lịch",
  keywords:
    "may đo, áo vest, sơ mi, thời trang cao cấp, custom tailor, tailor việt nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${montserrat.variable}`}
        suppressHydrationWarning
      >
        <AuthProvider>
        <Header />
        {children}
        <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3200,
              style: { background: "#111827", color: "#f9fafb", border: "1px solid #374151" },
              success: { iconTheme: { primary: "#f59e0b", secondary: "#111827" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
