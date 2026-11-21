import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Heart, Compass, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Giới Thiệu — Câu Chuyện Sáng Lập & Sứ Mệnh | Trại Cai Nghiện",
  description: "Lời tự sự chân thành từ người sáng lập Trại Cai Nghiện: Từng nghiện xao nhãng số, từng đánh mất sự tập trung và hành trình lập ra Trại để giúp bạn giành lại tâm trí.",
};

export default function GioiThieuPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-10">
      
      {/* 1. HEADER TINH GỌN */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#EBF0EC] dark:bg-[#202A23] text-[#3A5A40] dark:text-[#78A380]">
          <span>Câu Chuyện Của Tôi</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#2D312E] dark:text-[#F0ECE6] leading-tight">
          Tại sao Trại Cai Nghiện ra đời?
        </h1>
        <p className="text-sm md:text-base text-[#6B726E] dark:text-[#9DA39F] font-serif italic">
          Làm chủ sự tập trung, sống có chủ đích.
        </p>
      </div>

      {/* 2. CHIẾC HỘP TỰ SỰ DUY NHẤT (CHÂN THÀNH & XÚC ĐỘNG) */}
      <div className="rounded-3xl p-7 sm:p-10 md:p-12 bg-white dark:bg-[#1A1F1C] border border-[#E6E1D8] dark:border-[#2E3531] shadow-sm space-y-6 text-[#2D312E] dark:text-[#E8E4DE] leading-relaxed">
        
        {/* Header thư */}
        <div className="border-b border-[#E6E1D8] dark:border-[#2E3531] pb-5 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C27D53] dark:text-[#D48C62]">
            Thư ngỏ từ người sáng lập
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#2D312E] dark:text-[#F0ECE6]">
            "Gửi bạn — người đang thấy tâm trí mình ngày một vụn vỡ..."
          </h2>
        </div>

        {/* Nội dung tâm sự */}
        <div className="space-y-4 text-sm sm:text-base font-serif leading-relaxed">
          <p>
            Chào bạn,
          </p>
          <p>
            Tôi viết những dòng này không phải với tư cách của một chuyên gia tâm lý hay một giáo sư đứng trên bục giảng. Tôi viết cho bạn như một người bình thường — một người đã từng có những năm tháng bế tắc và bất lực cùng cực trước chiếc màn hình điện thoại.
          </p>
          <p>
            Tôi từng là một kẻ nghiện đúng nghĩa: Mở mắt ra là quẹt máy, ngồi vào bàn 5 phút là bứt rứt, nhảy tab liên tục, dự định làm việc 1 tiếng nhưng lướt video ngắn đến tận 2h sáng cay xè mắt. Khi buông máy xuống, đầu tôi bọc trong một lớp sương mù nặng trĩu. Tôi nhớ như in cảm giác căm ghét sự yếu đuối của chính mình, nhớ nỗi bất an sâu sắc khi nhìn những ước mơ và dự định cuộc đời cứ thế trôi tuột qua kẽ tay.
          </p>
          <p>
            Cho đến một ngày, tôi nhận ra một sự thật: <strong>Chúng ta không hề lười biếng. Chúng ta chỉ đang là những con người bình thường bị ném vào một xã hội siêu kích thích — nơi mọi thuật toán được thiết kế tinh vi để bòn rút từng giây sự chú ý của bạn.</strong>
          </p>
          <p>
            Trong xã hội hôm nay, <strong>Sự Tập Trung</strong> không còn là một kỹ năng làm việc đơn thuần. Nó là tấm khiên bảo vệ tâm trí, là phẩm giá, và là siêu năng lực quyết định bạn có được sống cuộc đời của chính mình hay sẽ trở thành món hàng trong ma trận số.
          </p>
          <p>
            Tôi lập ra <strong>Trại Cai Nghiện</strong> đơn giản vì tôi đã từng ở dưới đáy của sự xao nhãng đó, và tôi đã may mắn tìm được con đường bước ra ánh sáng: Bằng khoa học thần kinh để thôi dằn vặt bản thân, bằng thiết kế môi trường để không cần gồng ép ý chí, và bằng triết lý Kaizen 1% để kiên nhẫn làm bạn với chính mình.
          </p>
          <p>
            Tôi biết ngoài kia có hàng triệu người cũng đang loay hoay trong cơn mê số giống hệt tôi ngày trước. Tôi không tiếp cận bạn bằng tâm thế con buôn chèo kéo khóa học. Tôi chỉ muốn tạo ra một trạm dừng chân tĩnh lặng — nơi trao cho bạn những chiếc phao cứu sinh thực chiến nhất để cùng bạn giành lại sự tập trung, khôi phục sự bình an trong tâm hồn và sống một cuộc đời có chủ đích.
          </p>
          <p className="italic text-[#3A5A40] dark:text-[#78A380] pt-1">
            "Nếu bạn đang mệt mỏi vì một ngày lại trôi qua trong vô thức, hãy thở sâu một nhịp. Bạn không hề đơn độc, và chúng ta hoàn toàn có thể bắt đầu lại ngay từ hôm nay."
          </p>
        </div>

        {/* Chân chữ ký & CTA */}
        <div className="pt-6 border-t border-[#E6E1D8] dark:border-[#2E3531] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold block text-[#2D312E] dark:text-[#F0ECE6]">
              Một người bạn đã từng ngã và đứng dậy,
            </span>
            <span className="text-xs text-[#6B726E] dark:text-[#9DA39F]">
              Người sáng lập Trại Cai Nghiện
            </span>
          </div>

          <Link
            href="/trac-nghiem"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white bg-[#3A5A40] hover:bg-[#2F4A34] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <span>Đo mức độ mất tập trung (3 phút)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* 3. RANH GIỚI AN TOÀN Y TẾ TINH GỌN */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#EBF0EC]/60 dark:bg-[#202A23]/60 border border-[#E6E1D8] dark:border-[#2E3531] text-xs text-[#6B726E] dark:text-[#9DA39F] leading-relaxed flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#3A5A40] dark:text-[#78A380] shrink-0 mt-0.5" />
        <div>
          <strong>Ranh giới an toàn:</strong> Trại Cai Nghiện là nền tảng chia sẻ kiến thức khoa học hành vi và kinh nghiệm thực tế của người thường dành cho người thường nhằm giải phóng xao nhãng số nhẹ đến trung bình. Chúng tôi không đưa ra chẩn đoán y khoa, không kê đơn thuốc và không thay thế các liệu pháp điều trị tâm thần lâm sàng chuyên nghiệp.
        </div>
      </div>

    </div>
  );
}
