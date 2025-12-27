import { Metadata } from "next";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Liên Hệ - Custom Tailor",
  description: "Liên hệ với chúng tôi để được tư vấn và hỗ trợ",
};

export default function ContactPage() {
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
              Liên Hệ
              <br />
              <span className="text-luxury italic">Với Chúng Tôi</span>
            </h1>
            <p className="text-lg md:text-xl text-(--color-charcoal-lighter) font-light">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatedSection>
                <h2 className="text-3xl md:text-4xl font-light mb-8">
                  Thông Tin <span className="text-luxury italic">Liên Hệ</span>
                </h2>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <GlassCard className="p-6">
                  <MapPin className="w-8 h-8 text-(--color-gold) mb-4" />
                  <h3 className="text-xl font-light mb-2">Địa Chỉ</h3>
                  <p className="text-gray-600 font-light">
                    123 Đường Lê Lợi, Quận 1
                    <br />
                    TP. Hồ Chí Minh, Việt Nam
                  </p>
                </GlassCard>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <GlassCard className="p-6">
                  <Phone className="w-8 h-8 text-(--color-gold) mb-4" />
                  <h3 className="text-xl font-light mb-2">Điện Thoại</h3>
                  <p className="text-gray-600 font-light">
                    Hotline: +84 123 456 789
                    <br />
                    Tel: (028) 1234 5678
                  </p>
                </GlassCard>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <GlassCard className="p-6">
                  <Mail className="w-8 h-8 text-(--color-gold) mb-4" />
                  <h3 className="text-xl font-light mb-2">Email</h3>
                  <p className="text-gray-600 font-light">
                    contact@customtailor.vn
                    <br />
                    support@customtailor.vn
                  </p>
                </GlassCard>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <GlassCard className="p-6">
                  <Clock className="w-8 h-8 text-(--color-gold) mb-4" />
                  <h3 className="text-xl font-light mb-2">Giờ Làm Việc</h3>
                  <p className="text-gray-600 font-light">
                    Thứ 2 - Thứ 6: 9:00 - 21:00
                    <br />
                    Thứ 7 - CN: 10:00 - 20:00
                  </p>
                </GlassCard>
              </AnimatedSection>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <AnimatedSection delay={0.2}>
                <GlassCard className="p-8">
                  <h3 className="text-2xl md:text-3xl font-light mb-8">
                    Gửi <span className="text-luxury italic">Tin Nhắn</span>
                  </h3>

                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Họ và Tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Số Điện Thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                          placeholder="+84 123 456 789"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Chủ Đề
                      </label>
                      <select className="w-full px-4 py-3 bg-gray-800 text-white border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors">
                        <option>Tư vấn may đo</option>
                        <option>Đặt lịch hẹn</option>
                        <option>Hỏi về sản phẩm</option>
                        <option>Khiếu nại/Góp ý</option>
                        <option>Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nội Dung <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-white/10 text-white placeholder-gray-500 border border-white/20 rounded-lg focus:outline-none focus:border-(--color-gold) transition-colors resize-none"
                        placeholder="Nhập nội dung tin nhắn của bạn..."
                      />
                    </div>

                    <Button variant="luxury" size="lg" className="w-full">
                      Gửi Tin Nhắn
                    </Button>
                  </form>
                </GlassCard>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <GlassCard className="p-4">
              <div className="aspect-video bg-linear-to-br from-(--color-cream-dark) to-(--color-gold-light) rounded-lg flex items-center justify-center">
                <MapPin className="w-16 h-16 text-(--color-gold) opacity-50" />
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
