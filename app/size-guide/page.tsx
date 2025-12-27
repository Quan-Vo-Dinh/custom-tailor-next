"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Ruler, Info, AlertCircle, CheckCircle } from "lucide-react";

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <AnimatedSection className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            Hướng Dẫn <span className="text-luxury italic">Đo Size</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Hướng dẫn chi tiết cách đo size để có được bộ trang phục vừa vặn hoàn hảo
          </p>
        </AnimatedSection>

        <div className="space-y-8">
          {/* Introduction */}
          <AnimatedSection delay={0.1}>
            <GlassCard className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-(--color-gold)/10 flex items-center justify-center shrink-0">
                  <Info className="w-6 h-6 text-(--color-gold)" />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-white mb-2">
                    Tầm Quan Trọng Của Việc Đo Size
                  </h2>
                  <p className="text-gray-400">
                    Đo size chính xác là bước đầu tiên và quan trọng nhất để có được
                    trang phục may đo hoàn hảo. Mỗi số đo đều ảnh hưởng đến độ vừa vặn,
                    thoải mái và vẻ đẹp tổng thể của sản phẩm.
                  </p>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Measurement Guide */}
          <AnimatedSection delay={0.2}>
            <GlassCard className="p-8">
              <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                <Ruler className="w-6 h-6 text-(--color-gold)" />
                Hướng Dẫn Đo Các Số Đo Cơ Bản
              </h2>
              <div className="space-y-6">
                {/* Chest */}
                <div className="p-6 bg-white/5 rounded-lg">
                  <h3 className="text-xl font-medium text-white mb-3">
                    1. Vòng Ngực (Chest)
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Đo vòng quanh phần rộng nhất của ngực, đi qua điểm cao nhất của
                    ngực.
                  </p>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Cách đo:</strong> Đứng thẳng, đặt
                      thước dây vòng quanh ngực, đi qua điểm cao nhất của ngực và phần
                      rộng nhất của lưng. Thước dây phải song song với mặt đất và không
                      quá chặt cũng không quá lỏng.
                    </p>
                  </div>
                </div>

                {/* Waist */}
                <div className="p-6 bg-white/5 rounded-lg">
                  <h3 className="text-xl font-medium text-white mb-3">
                    2. Vòng Eo (Waist)
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Đo vòng quanh phần nhỏ nhất của eo, thường ở trên rốn khoảng 2-3cm.
                  </p>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Cách đo:</strong> Đứng thẳng, tìm
                      điểm nhỏ nhất của eo (thường là phần thắt lưng tự nhiên). Đặt
                      thước dây vòng quanh eo, đảm bảo thước dây nằm ngang và không bị
                      xoắn.
                    </p>
                  </div>
                </div>

                {/* Hips */}
                <div className="p-6 bg-white/5 rounded-lg">
                  <h3 className="text-xl font-medium text-white mb-3">
                    3. Vòng Mông (Hips)
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Đo vòng quanh phần rộng nhất của mông.
                  </p>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Cách đo:</strong> Đứng thẳng, đặt
                      thước dây vòng quanh phần rộng nhất của mông. Thước dây phải song
                      song với mặt đất và đi qua điểm cao nhất của mông.
                    </p>
                  </div>
                </div>

                {/* Shoulders */}
                <div className="p-6 bg-white/5 rounded-lg">
                  <h3 className="text-xl font-medium text-white mb-3">
                    4. Vai (Shoulders)
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Đo từ điểm đầu vai này sang điểm đầu vai kia.
                  </p>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Cách đo:</strong> Đứng thẳng, tìm
                      điểm đầu vai (nơi vai gặp cánh tay). Đo từ điểm đầu vai trái sang
                      điểm đầu vai phải, thước dây phải đi qua phần cao nhất của vai.
                    </p>
                  </div>
                </div>

                {/* Sleeve Length */}
                <div className="p-6 bg-white/5 rounded-lg">
                  <h3 className="text-xl font-medium text-white mb-3">
                    5. Dài Tay (Sleeve Length)
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Đo từ điểm đầu vai đến điểm bạn muốn tay áo kết thúc.
                  </p>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Cách đo:</strong> Đặt một đầu
                      thước dây tại điểm đầu vai, đo dọc theo cánh tay đến điểm bạn muốn
                      tay áo kết thúc (thường là cổ tay hoặc ngay dưới cổ tay khoảng
                      1-2cm).
                    </p>
                  </div>
                </div>

                {/* Inseam */}
                <div className="p-6 bg-white/5 rounded-lg">
                  <h3 className="text-xl font-medium text-white mb-3">
                    6. Dài Quần (Inseam)
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Đo từ đáy quần đến điểm bạn muốn quần kết thúc.
                  </p>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Cách đo:</strong> Đứng thẳng, đặt
                      một đầu thước dây tại đáy quần (nơi hai chân gặp nhau), đo dọc
                      theo mặt trong của chân đến điểm bạn muốn quần kết thúc (thường là
                      trên giày khoảng 1-2cm).
                    </p>
                  </div>
                </div>

                {/* Neck */}
                <div className="p-6 bg-white/5 rounded-lg">
                  <h3 className="text-xl font-medium text-white mb-3">
                    7. Vòng Cổ (Neck)
                  </h3>
                  <p className="text-gray-400 mb-3">
                    Đo vòng quanh cổ, ngay dưới yết hầu.
                  </p>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Cách đo:</strong> Đặt thước dây
                      vòng quanh cổ, ngay dưới yết hầu. Thước dây phải vừa khít nhưng
                      không quá chặt, để lại khoảng trống vừa đủ để đặt một ngón tay vào.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Tips */}
          <AnimatedSection delay={0.3}>
            <GlassCard className="p-8">
              <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-(--color-gold)" />
                Lưu Ý Khi Đo Size
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Thời điểm đo tốt nhất
                  </h3>
                  <p className="text-gray-400">
                    Nên đo vào buổi sáng khi cơ thể ở trạng thái tự nhiên nhất. Tránh
                    đo ngay sau khi ăn no hoặc khi mặc quần áo quá dày.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Trang phục khi đo
                  </h3>
                  <p className="text-gray-400">
                    Mặc quần áo mỏng, bó sát cơ thể hoặc chỉ mặc đồ lót để có số đo
                    chính xác nhất. Tránh mặc quần áo dày, rộng sẽ làm sai lệch số đo.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Tư thế khi đo
                  </h3>
                  <p className="text-gray-400">
                    Đứng thẳng, thả lỏng tự nhiên, hai chân song song và cách nhau một
                    khoảng bằng vai. Không căng người hoặc hóp bụng.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Độ chặt của thước dây
                  </h3>
                  <p className="text-gray-400">
                    Thước dây phải vừa khít với cơ thể, không quá chặt cũng không quá
                    lỏng. Nên để lại khoảng trống vừa đủ để đặt một ngón tay vào giữa
                    thước dây và cơ thể.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Đo nhiều lần để chính xác
                  </h3>
                  <p className="text-gray-400">
                    Nên đo mỗi số đo 2-3 lần và lấy giá trị trung bình để đảm bảo độ
                    chính xác. Nếu có sự chênh lệch lớn giữa các lần đo, hãy đo lại.
                  </p>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Warning */}
          <AnimatedSection delay={0.4}>
            <GlassCard className="p-8 border-yellow-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-white mb-3">
                    Lưu Ý Quan Trọng
                  </h2>
                  <p className="text-gray-400 mb-4">
                    Nếu bạn không chắc chắn về cách đo hoặc muốn đảm bảo độ chính xác
                    tuyệt đối, chúng tôi khuyến khích bạn đến cửa hàng để được nhân viên
                    chuyên nghiệp hỗ trợ đo size trực tiếp.
                  </p>
                  <p className="text-gray-400">
                    Hoặc bạn có thể đặt lịch hẹn để nhân viên đến tận nhà đo size cho
                    bạn với dịch vụ{" "}
                    <strong className="text-white">đo size tại nhà miễn phí</strong>.
                  </p>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Contact */}
          <AnimatedSection delay={0.5}>
            <GlassCard className="p-8">
              <h2 className="text-2xl font-light text-white mb-4">
                Cần Hỗ Trợ Đo Size?
              </h2>
              <p className="text-gray-400 mb-6">
                Nếu bạn cần hỗ trợ thêm về cách đo size hoặc muốn đặt lịch đo size tại
                nhà, vui lòng liên hệ:
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
                  <span className="text-gray-400">Đặt lịch đo size:</span>
                  <a
                    href="/booking"
                    className="text-(--color-gold) hover:underline"
                  >
                    Đặt lịch hẹn ngay
                  </a>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}

