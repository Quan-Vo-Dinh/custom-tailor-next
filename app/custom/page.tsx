import { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Check, Ruler, Scissors, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "May Đo Theo Yêu Cầu - Custom Tailor",
  description:
    "Dịch vụ may đo trang phục theo yêu cầu với quy trình chuyên nghiệp",
};

const steps = [
  {
    number: "01",
    title: "Tư Vấn & Chọn Mẫu",
    description:
      "Gặp gỡ stylist, thảo luận về phong cách và lựa chọn mẫu thiết kế phù hợp",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Chọn Vải & Phụ Kiện",
    description:
      "Lựa chọn từ hàng trăm loại vải cao cấp và phụ kiện sang trọng",
    icon: Scissors,
  },
  {
    number: "03",
    title: "Đo Lường Chính Xác",
    description: "Đo đạc tỉ mỉ với hơn 20 số đo để đảm bảo sự vừa vặn hoàn hảo",
    icon: Ruler,
  },
  {
    number: "04",
    title: "Hoàn Thiện & Bàn Giao",
    description:
      "May đo thủ công, kiểm tra chất lượng và bàn giao sản phẩm hoàn hảo",
    icon: Check,
  },
];

const features = [
  "Đo lường chính xác 100%",
  "Vải nhập khẩu cao cấp",
  "Thợ may 15+ năm kinh nghiệm",
  "Bảo hành trọn đời",
  "Sửa chữa miễn phí trong 1 năm",
  "Giao hàng tận nơi",
];

export default function CustomPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-(--color-cream) to-(--color-gold-light)" />
        </div>

        <div className="container mx-auto px-6 lg:px-12">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6">
              May Đo
              <br />
              <span className="text-luxury italic">Theo Yêu Cầu</span>
            </h1>
            <p className="text-lg md:text-xl text-(--color-charcoal-lighter) mb-8 font-light">
              Tạo nên trang phục độc nhất vô nhị, phản ánh hoàn hảo phong cách
              và cá tính của bạn
            </p>
            <Link href="/booking">
              <Button variant="luxury" size="lg">
                Đặt Lịch Tư Vấn Ngay
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4">
              Quy Trình <span className="text-luxury italic">May Đo</span>
            </h2>
            <p className="text-gray-600 font-light">
              4 bước đơn giản để có được bộ trang phục hoàn hảo
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <AnimatedSection key={step.number} delay={index * 0.1}>
                <GlassCard className="text-center h-full hover:shadow-xl transition-all duration-500">
                  <div className="mb-6">
                    <div className="text-6xl font-light text-luxury mb-4">
                      {step.number}
                    </div>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-(--color-gold) mb-4">
                      <step.icon className="w-8 h-8 text-(--color-charcoal)" />
                    </div>
                  </div>
                  <h3 className="text-xl font-light mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">
                    {step.description}
                  </p>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-linear-to-b from-(--color-charcoal) to-(--color-charcoal-light)">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
                Cam Kết <span className="text-luxury italic">Chất Lượng</span>
              </h2>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 text-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-(--color-gold) flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-(--color-charcoal)" />
                    </div>
                    <span className="text-lg font-light">{feature}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <GlassCard variant="dark" className="p-12">
                <h3 className="text-3xl font-light text-white mb-6">
                  Đặt Lịch <span className="text-luxury italic">Ngay</span>
                </h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--color-gold) transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--color-gold) transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--color-gold) transition-colors"
                  />
                  <textarea
                    placeholder="Ghi chú (tùy chọn)"
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--color-gold) transition-colors resize-none"
                  />
                  <Button variant="luxury" size="lg" className="w-full">
                    Gửi Yêu Cầu
                  </Button>
                </form>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
