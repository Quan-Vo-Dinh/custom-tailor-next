"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Award, Heart, Scissors, Users } from "lucide-react";
import { useRef } from "react";

const values = [
  {
    icon: Scissors,
    title: "Tay Nghề Tinh Xảo",
    description:
      "Đội ngũ thợ may với hơn 15 năm kinh nghiệm, được đào tạo bài bản từ những nghệ nhân hàng đầu.",
  },
  {
    icon: Heart,
    title: "Tận Tâm & Tận Tình",
    description:
      "Chúng tôi lắng nghe và thấu hiểu từng nhu cầu, mang đến trải nghiệm dịch vụ vượt mong đợi.",
  },
  {
    icon: Award,
    title: "Chất Lượng Đỉnh Cao",
    description:
      "Chỉ sử dụng vải nhập khẩu cao cấp từ Ý, Anh và Nhật Bản, đảm bảo độ bền và sang trọng.",
  },
  {
    icon: Users,
    title: "Thấu Hiểu Khách Hàng",
    description:
      "Mỗi sản phẩm là một câu chuyện riêng, phản ánh cá tính và phong cách độc đáo của bạn.",
  },
];

export const BrandStory = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)] to-[var(--color-charcoal-light)]" />
        <motion.div
          className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full liquid-glass blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* Story Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          {/* Left Column - Story */}
          <AnimatedSection>
            <div className="space-y-8">
              <div>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "120px" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-px bg-[var(--color-gold)] mb-6"
                />
                <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
                  Câu Chuyện
                  <br />
                  <span className="text-luxury italic">Của Chúng Tôi</span>
                </h2>
              </div>

              <p className="text-lg text-gray-300 font-light leading-relaxed">
                Được thành lập từ năm 2009,{" "}
                <span className="text-[var(--color-gold)] font-medium">
                  Custom Tailor
                </span>{" "}
                ra đời từ niềm đam mê với nghệ thuật may đo và khát vọng mang
                đến cho quý khách hàng những bộ trang phục hoàn hảo nhất.
              </p>

              <p className="text-lg text-gray-300 font-light leading-relaxed">
                Chúng tôi tin rằng mỗi con người đều có một phong cách riêng
                biệt, và sứ mệnh của chúng tôi là biến ước mơ về trang phục lý
                tưởng của bạn thành hiện thực. Với đội ngũ nghệ nhân tài hoa và
                quy trình may đo tỉ mỉ, từng chi tiết nhỏ đều được chăm chút để
                tạo nên sản phẩm hoàn mỹ.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="glass-dark p-6 rounded-lg">
                  <div className="text-4xl font-light text-luxury mb-2">
                    15+
                  </div>
                  <div className="text-sm text-gray-400 tracking-wider uppercase">
                    Năm Kinh Nghiệm
                  </div>
                </div>
                <div className="glass-dark p-6 rounded-lg">
                  <div className="text-4xl font-light text-luxury mb-2">
                    5000+
                  </div>
                  <div className="text-sm text-gray-400 tracking-wider uppercase">
                    Khách Hàng
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right Column - Image Placeholder */}
          <AnimatedSection delay={0.2}>
            <div className="relative">
              {/* Main Image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[4/5] rounded-lg overflow-hidden glass-luxury"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold-dark)] to-[var(--color-charcoal-lighter)] flex items-center justify-center">
                  <Scissors className="w-32 h-32 text-white/20" />
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                className="absolute -bottom-8 -left-8 glass-luxury p-6 rounded-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-gold)] flex items-center justify-center">
                    <Award className="w-6 h-6 text-[var(--color-charcoal)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Chứng Nhận
                    </div>
                    <div className="text-xs text-gray-400">ISO 9001:2015</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>

        {/* Values Grid */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-light text-white mb-4">
              Giá Trị <span className="text-luxury italic">Cốt Lõi</span>
            </h3>
            <p className="text-gray-300 font-light">
              Những nguyên tắc định hướng mọi hành động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1}>
                <GlassCard
                  variant="dark"
                  className="h-full hover:border-[var(--color-gold)] transition-all duration-500"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-gold)] flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-[var(--color-charcoal)]" />
                    </div>
                    <h4 className="text-xl font-light text-white">
                      {value.title}
                    </h4>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
