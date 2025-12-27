"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, RefreshCw, Clock, CheckCircle } from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <AnimatedSection className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            Chính Sách <span className="text-luxury italic">Đổi Trả</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Cam kết đảm bảo quyền lợi khách hàng với chính sách đổi trả minh bạch
          </p>
        </AnimatedSection>

        <div className="space-y-8">
          {/* Overview */}
          <AnimatedSection delay={0.1}>
            <GlassCard className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-(--color-gold)/10 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-(--color-gold)" />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-white mb-2">
                    Cam Kết Chất Lượng
                  </h2>
                  <p className="text-gray-400">
                    Chúng tôi cam kết mang đến sản phẩm chất lượng cao với dịch vụ
                    chăm sóc khách hàng tận tâm. Nếu sản phẩm không đáp ứng mong đợi,
                    chúng tôi sẽ hỗ trợ đổi trả hoặc hoàn tiền.
                  </p>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Return Conditions */}
          <AnimatedSection delay={0.2}>
            <GlassCard className="p-8">
              <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-(--color-gold)" />
                Điều Kiện Đổi Trả
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    1. Thời gian đổi trả
                  </h3>
                  <p className="text-gray-400">
                    Khách hàng có thể yêu cầu đổi trả trong vòng{" "}
                    <strong className="text-white">7 ngày</strong> kể từ ngày nhận
                    hàng.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    2. Điều kiện sản phẩm
                  </h3>
                  <p className="text-gray-400">
                    Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng, giặt ủi hoặc chỉnh
                    sửa. Còn đầy đủ nhãn mác, phụ kiện và hóa đơn mua hàng.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    3. Lý do đổi trả được chấp nhận
                  </h3>
                  <ul className="text-gray-400 space-y-2 list-disc list-inside">
                    <li>Sản phẩm bị lỗi sản xuất hoặc không đúng mô tả</li>
                    <li>Kích thước không phù hợp (chưa qua chỉnh sửa)</li>
                    <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
                    <li>Màu sắc hoặc chất liệu không đúng như cam kết</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Return Process */}
          <AnimatedSection delay={0.3}>
            <GlassCard className="p-8">
              <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-(--color-gold)" />
                Quy Trình Đổi Trả
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-(--color-gold) flex items-center justify-center shrink-0 text-charcoal font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Liên hệ hỗ trợ
                    </h3>
                    <p className="text-gray-400">
                      Gửi yêu cầu đổi trả qua email hoặc hotline trong vòng 7 ngày kể
                      từ ngày nhận hàng. Vui lòng cung cấp mã đơn hàng và lý do đổi
                      trả.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-(--color-gold) flex items-center justify-center shrink-0 text-charcoal font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Xác nhận yêu cầu
                    </h3>
                    <p className="text-gray-400">
                      Chúng tôi sẽ xem xét và xác nhận yêu cầu trong vòng 24 giờ. Nếu
                      đáp ứng điều kiện, chúng tôi sẽ hướng dẫn các bước tiếp theo.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-(--color-gold) flex items-center justify-center shrink-0 text-charcoal font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Gửi sản phẩm về
                    </h3>
                    <p className="text-gray-400">
                      Đóng gói sản phẩm cẩn thận và gửi về địa chỉ được chỉ định. Chi
                      phí vận chuyển sẽ được hoàn trả nếu sản phẩm có lỗi từ phía chúng
                      tôi.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-(--color-gold) flex items-center justify-center shrink-0 text-charcoal font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Xử lý và hoàn tiền
                    </h3>
                    <p className="text-gray-400">
                      Sau khi kiểm tra và xác nhận, chúng tôi sẽ tiến hành đổi sản
                      phẩm mới hoặc hoàn tiền trong vòng 3-5 ngày làm việc.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Refund Policy */}
          <AnimatedSection delay={0.4}>
            <GlassCard className="p-8">
              <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-(--color-gold)" />
                Chính Sách Hoàn Tiền
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Thời gian hoàn tiền
                  </h3>
                  <p className="text-gray-400">
                    Tiền sẽ được hoàn trả vào tài khoản trong vòng{" "}
                    <strong className="text-white">3-5 ngày làm việc</strong> sau khi
                    chúng tôi nhận và kiểm tra sản phẩm.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Phương thức hoàn tiền
                  </h3>
                  <p className="text-gray-400">
                    Tiền sẽ được hoàn trả theo phương thức thanh toán ban đầu. Nếu
                    thanh toán bằng tiền mặt, chúng tôi sẽ chuyển khoản vào tài khoản
                    ngân hàng bạn cung cấp.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Chi phí không hoàn trả
                  </h3>
                  <p className="text-gray-400">
                    Chi phí vận chuyển ban đầu sẽ không được hoàn trả trừ trường hợp
                    sản phẩm có lỗi từ phía chúng tôi. Chi phí chỉnh sửa hoặc tùy chỉnh
                    đã thực hiện cũng không được hoàn trả.
                  </p>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Contact */}
          <AnimatedSection delay={0.5}>
            <GlassCard className="p-8">
              <h2 className="text-2xl font-light text-white mb-4">
                Cần Hỗ Trợ Thêm?
              </h2>
              <p className="text-gray-400 mb-6">
                Nếu bạn có bất kỳ câu hỏi nào về chính sách đổi trả, vui lòng liên hệ
                với chúng tôi:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">Email:</span>
                  <a
                    href="mailto:support@customtailor.com"
                    className="text-(--color-gold) hover:underline"
                  >
                    support@customtailor.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">Hotline:</span>
                  <a
                    href="tel:1900123456"
                    className="text-(--color-gold) hover:underline"
                  >
                    1900 123 456
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">Giờ làm việc:</span>
                  <span className="text-white">8:00 - 20:00 (Tất cả các ngày trong tuần)</span>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}

