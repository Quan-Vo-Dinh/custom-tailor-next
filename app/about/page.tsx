import { Metadata } from "next";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Award, Heart, Scissors, Target, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Về Chúng Tôi - Custom Tailor",
  description: "Câu chuyện về Custom Tailor - Nghệ thuật may đo cao cấp",
};

export default function AboutPage() {
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
              Câu Chuyện
              <br />
              <span className="text-luxury italic">Của Chúng Tôi</span>
            </h1>
            <p className="text-lg md:text-xl text-(--color-charcoal-lighter) font-light">
              Hành trình 15 năm kiên định với đam mê nghệ thuật may đo cao cấp
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <AnimatedSection>
              <div className="space-y-6 text-lg font-light leading-relaxed text-gray-700">
                <p>
                  <span className="text-(--color-gold) font-medium">
                    Custom Tailor
                  </span>{" "}
                  được thành lập vào năm 2009 bởi Nghệ nhân Nguyễn Văn A, người
                  có hơn 30 năm kinh nghiệm trong nghề may đo truyền thống.
                </p>
                <p>
                  Khởi đầu từ một xưởng may nhỏ với chỉ 3 thợ may, chúng tôi đã
                  không ngừng phát triển và hoàn thiện kỹ năng, mang đến cho
                  khách hàng những sản phẩm chất lượng cao nhất.
                </p>
                <p>
                  Ngày nay, Custom Tailor tự hào là một trong những thương hiệu
                  may đo cao cấp hàng đầu, với đội ngũ hơn 20 nghệ nhân tài hoa
                  và hơn 5000 khách hàng thân thiết trên toàn quốc.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <GlassCard className="p-8">
                <div className="aspect-4/5 bg-linear-to-br from-(--color-gold-dark) to-(--color-charcoal-lighter) rounded-lg flex items-center justify-center">
                  <Scissors className="w-32 h-32 text-white/20" />
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <AnimatedSection>
              <GlassCard className="h-full">
                <Target className="w-12 h-12 text-(--color-gold) mb-4" />
                <h3 className="text-2xl font-light mb-4">Sứ Mệnh</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Mang đến cho mỗi khách hàng những bộ trang phục hoàn hảo, phản
                  ánh đúng phong cách và cá tính riêng, đồng thời nâng cao giá
                  trị nghệ thuật may đo truyền thống Việt Nam.
                </p>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <GlassCard className="h-full">
                <Award className="w-12 h-12 text-(--color-gold) mb-4" />
                <h3 className="text-2xl font-light mb-4">Tầm Nhìn</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Trở thành thương hiệu may đo cao cấp hàng đầu Việt Nam, được
                  công nhận trên thị trường quốc tế với sự kết hợp hoàn hảo giữa
                  tay nghề truyền thống và công nghệ hiện đại.
                </p>
              </GlassCard>
            </AnimatedSection>
          </div>

          {/* Values */}
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-light text-center mb-12">
              Giá Trị <span className="text-luxury italic">Cốt Lõi</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Scissors,
                  title: "Tay Nghề Tinh Xảo",
                  description:
                    "Đội ngũ thợ may lành nghề với kinh nghiệm 15+ năm",
                },
                {
                  icon: Heart,
                  title: "Tận Tâm & Tận Tình",
                  description: "Luôn lắng nghe và thấu hiểu nhu cầu khách hàng",
                },
                {
                  icon: Users,
                  title: "Khách Hàng Là Trọng Tâm",
                  description:
                    "Mọi quyết định đều hướng đến sự hài lòng của bạn",
                },
              ].map((value, index) => (
                <AnimatedSection key={value.title} delay={index * 0.1}>
                  <GlassCard className="text-center h-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-(--color-gold) mb-4">
                      <value.icon className="w-8 h-8 text-(--color-charcoal)" />
                    </div>
                    <h4 className="text-xl font-light mb-3">{value.title}</h4>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      {value.description}
                    </p>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-linear-to-b from-(--color-charcoal) to-(--color-charcoal-light)">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { number: "15+", label: "Năm Kinh Nghiệm" },
              { number: "5000+", label: "Khách Hàng" },
              { number: "20+", label: "Nghệ Nhân" },
              { number: "100%", label: "Hài Lòng" },
            ].map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-light text-luxury mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm tracking-wider uppercase text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
