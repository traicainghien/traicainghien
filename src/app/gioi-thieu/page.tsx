import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, Compass, CheckCircle2, ArrowRight, Brain, Zap, Target, Flame, BatteryCharging, Clock } from "lucide-react";

export const metadata = {
  title: "Câu Chuyện Sáng Lập — Từ Người Từng Đánh Mất Tâm Trí Đến Hành Trình Giành Lại Sự Tập Trung | Trại Cai Nghiện",
  description: "Lời tự sự chân thành từ người sáng lập Trại Cai Nghiện: Từng là một người nghiện xao nhãng số, nhũn não và mất sạch tập trung, hành trình giành lại sự chú ý và lý do dự án ra đời để đồng hành cùng bạn.",
};

export default function GioiThieuPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
      
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-5 border-b border-[#E6E1D8] dark:border-[#2E3531] pb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3A5A40] dark:text-[#78A380] bg-[#EBF0EC] dark:bg-[#202A23] px-4 py-1.5 rounded-full inline-block">
          Câu Chuyện Sáng Lập • Hành Trình Tỉnh Thức
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#2D312E] dark:text-[#F0ECE6] leading-tight max-w-3xl mx-auto">
          "Tôi đã từng bất lực nhìn tâm trí mình bị xé vụn trước chiếc màn hình..."
        </h1>
        <p className="text-base md:text-lg text-[#6B726E] dark:text-[#9DA39F] max-w-2xl mx-auto leading-relaxed">
          Và lý do vì sao <strong>Trại Cai Nghiện</strong> ra đời — không phải để dạy dỗ ai, mà để trao lại cho bạn vũ khí quan trọng nhất của thời đại số: <strong>Khả năng tập trung sâu để sống một cuộc đời có chủ đích.</strong>
        </p>
      </div>

      {/* 2. CHƯƠNG 1: LỜI TỰ THÚ TRẦN TRỤI CỦA MỘT NGƯỜI TỪNG BẾ TẮC */}
      <section className="space-y-6">
        <div className="p-8 md:p-12 rounded-3xl bg-white dark:bg-[#1A1F1C] border border-[#E6E1D8] dark:border-[#2E3531] space-y-6 shadow-sm">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C27D53] dark:text-[#D48C62]">
            <Flame className="w-4 h-4" />
            <span>Chương 1: Lời Thú Nhận Của Một Kẻ Từng Bất Lực</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#2D312E] dark:text-[#F0ECE6] leading-snug">
            "Tôi không phải chuyên gia tâm lý học đứng trên bục giảng. Tôi là một người đã từng ngã dúi dụi trong vũng lầy xao nhãng."
          </h2>

          <div className="space-y-4 text-sm md:text-base text-[#2D312E] dark:text-[#D1CCC4] leading-relaxed">
            <p>
              Nếu quay ngược thời gian lại vài năm trước, bạn sẽ thấy tôi là một phiên bản tồi tệ nhất mà chính tôi từng căm ghét: Một người mở mắt ra lúc 7h sáng nhưng nằm bẹp trên giường quẹt điện thoại tới 8h30 mới lết dậy trong sự đờ đẫn. 
            </p>
            <p>
              Mỗi ngày của tôi bắt đầu bằng sự vội vã và kết thúc bằng nỗi dằn vặt. Tôi ngồi vào bàn làm việc, tự hứa với bản thân: <em>"Hôm nay mình phải làm xong kế hoạch này."</em> Nhưng chỉ được đúng 5 phút, khi gặp một ý khó, hai bàn tay tôi như bị ma xui quỷ khiến tự động với lấy điện thoại, hoặc bật sang một tab YouTube mới để tìm một liều kích thích ngắn.
            </p>
            <p>
              Và rồi 15 phút, 30 phút, 2 tiếng đồng hồ biến mất không dấu vết. Đầu tôi bắt đầu bốc hỏa, một lớp sương mù dày đặc bao phủ lấy não bộ — người ta gọi đó là hội chứng <strong>"Nhũn não số" (Brain Rot)</strong>. Đọc một trang sách không nổi, nói chuyện với người thân thì mắt lơ đễnh nhìn vào thông báo nhấp nháy, tối đến lại nằm co ro lướt video ngắn đến 2-3h sáng trong sự trống rỗng và bất lực cùng cực.
            </p>
            <p className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#202722] border-l-4 border-[#C27D53] text-[#2D312E] dark:text-[#F0ECE6] italic font-serif">
              "Tôi từng thử mọi cách mà người ta hay dạy: Xóa app, cất điện thoại sang phòng khác, cài mật khẩu chặn web, tự chửi mắng bản thân phải gồng lên mà kỷ luật... Nhưng chỉ được vài ba hôm, cơn thèm dopamine lại quật ngã tôi dữ dội hơn gấp bội. Tôi hoàn toàn mất niềm tin vào chính mình."
            </p>
          </div>
        </div>
      </section>

      {/* 3. CHƯƠNG 2: SỰ THẬT VỀ ĐẠI DỊCH MẤT TẬP TRUNG */}
      <section className="space-y-6">
        <div className="p-8 md:p-12 rounded-3xl bg-[#FAF7F2] dark:bg-[#1E2420] border border-[#E6E1D8] dark:border-[#2E3531] space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A5A40] dark:text-[#78A380]">
            <Brain className="w-4 h-4" />
            <span>Chương 2: Cú Đập Vỡ Ngộ Nhận</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#2D312E] dark:text-[#F0ECE6] leading-snug">
            Bạn không hề lười biếng. Bộ não của bạn chỉ đang là nạn nhân của một cuộc chiến bất cân sức.
          </h2>

          <div className="space-y-4 text-sm md:text-base text-[#2D312E] dark:text-[#D1CCC4] leading-relaxed">
            <p>
              Bước ngoặt cuộc đời tôi chỉ thực sự bắt đầu khi tôi buông bỏ việc tự trách móc và bắt đầu lao vào nghiên cứu y văn về sinh học thần kinh, tâm lý học hành vi và cơ chế của chất dẫn truyền Dopamine.
            </p>
            <p>
              Tôi giật mình nhận ra một sự thật cay đắng: <strong>Chúng ta không hề yếu đuối hay vô kỷ luật. Chúng ta đang bị ném vào một cỗ máy công nghiệp trị giá hàng nghìn tỷ đô — nơi những bộ óc xuất chúng nhất Thung lũng Silicon làm việc ngày đêm chỉ với một mục đích duy nhất: Đánh cắp từng giây sự chú ý của bạn.</strong>
            </p>
            <p>
              Trong xã hội hiện đại, sự tập trung của bạn chính là "mỏ dầu mới" để các thuật toán khai thác. Khi video ngắn giật dây thần kinh mỗi 3 giây, não bộ buộc phải hạ thấp độ nhạy của các thụ thể dopamine để tự vệ. Hậu quả là những việc sâu sắc, chậm rãi như đọc sách, suy ngẫm, viết lách hay làm việc chuyên sâu bỗng chốc trở thành một cực hình bứt rứt.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white dark:bg-[#151816] border border-[#E6E1D8] dark:border-[#2E3531]">
                <span className="font-bold text-[#9E2A2B] dark:text-[#E57373] block mb-1">Căn Bệnh Thời Đại:</span>
                <span className="text-xs text-[#6B726E] dark:text-[#9DA39F]">Não phân mảnh, nhảy tab liên tục, sương mù não, kiệt quệ cảm xúc và mất khả năng hiện diện trọn vẹn bên người mình yêu thương.</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#151816] border border-[#E6E1D8] dark:border-[#2E3531]">
                <span className="font-bold text-[#3A5A40] dark:text-[#78A380] block mb-1">Siêu Năng Lực Thời Đại:</span>
                <span className="text-xs text-[#6B726E] dark:text-[#9DA39F]">Ai giành lại được Sự Tập Trung, người đó làm chủ sự nghiệp, sở hữu nội lực tĩnh tại và tự do định đoạt cuộc đời mình.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHƯƠNG 3: HÀNH TRÌNH TỰ CỨU MÌNH VÀ TÁI SINH TÂM TRÍ */}
      <section className="space-y-6">
        <div className="p-8 md:p-12 rounded-3xl bg-white dark:bg-[#1A1F1C] border border-[#E6E1D8] dark:border-[#2E3531] space-y-6 shadow-sm">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A5A40] dark:text-[#78A380]">
            <BatteryCharging className="w-4 h-4" />
            <span>Chương 3: Con Đường Trở Về Đời Thực</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#2D312E] dark:text-[#F0ECE6] leading-snug">
            Tôi không dùng ý chí để chiến thắng. Tôi dùng một hệ thống phòng thủ khoa học.
          </h2>

          <div className="space-y-4 text-sm md:text-base text-[#2D312E] dark:text-[#D1CCC4] leading-relaxed">
            <p>
              Tôi ngừng gồng mình. Tôi bắt đầu xây dựng lại mối quan hệ với sự chú ý của mình bằng các nguyên lý bền vững:
            </p>
            <ul className="space-y-3 pl-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#3A5A40] dark:text-[#78A380] shrink-0 mt-0.5" />
                <span><strong>Thiết kế lại môi trường vật lý (Architecture of Choice):</strong> Quy tắc sạc điện thoại cách giường 2m, đưa màn hình về chế độ thang xám (Grayscale), triệt tiêu ma sát cho việc làm sâu và tăng ma sát cực đại cho các thói quen xao nhãng.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#3A5A40] dark:text-[#78A380] shrink-0 mt-0.5" />
                <span><strong>Tái lập Dopamine nền tự nhiên (Dopamine Reset):</strong> Thiết kế bảng "Dopamine Menu" gồm các hoạt động nuôi dưỡng sinh học (đi bộ tiếp đất, tắm nước ấm, đọc sách giấy, viết nhật ký) để mỗi khi mệt mỏi, não bộ không còn phản xạ tìm đến short video.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#3A5A40] dark:text-[#78A380] shrink-0 mt-0.5" />
                <span><strong>Kaizen 1% & Wabi Sabi:</strong> Không bao giờ ép mình trở thành thánh nhân sau một đêm. Khi lỡ trượt chân thức khuya hay lướt mạng, tôi tha thứ cho sự vụng về của mình, hít một hơi sâu và quay trở lại với kỷ luật vào sáng hôm sau mà không hề dằn vặt.</span>
              </li>
            </ul>
            <p className="pt-2">
              Khoảnh khắc tuyệt vời nhất là sau 30 ngày kiên định: Lần đầu tiên sau nhiều năm, lớp sương mù trong đầu tôi tan biến hoàn toàn. Tôi có thể ngồi vào bàn làm việc liền mạch 90 phút trong trạng thái dòng chảy tĩnh lặng, giải quyết công việc chỉ trong nửa ngày, và buổi tối thảnh thơi đọc sách, trò chuyện cùng gia đình mà bàn tay không hề có cảm giác bồn chồn muốn với lấy màn hình.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CHƯƠNG 4: VÌ SAO TRẠI CAI NGHIỆN RA ĐỜI? */}
      <section className="space-y-6">
        <div className="p-8 md:p-12 rounded-3xl bg-[#EBF0EC]/80 dark:bg-[#202722] border border-[#3A5A40]/30 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3A5A40] dark:text-[#78A380]">
            <Compass className="w-4 h-4" />
            <span>Chương 4: Sứ Mệnh Phụng Sự</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#2D312E] dark:text-[#F0ECE6] leading-snug">
            Khi chính mình đã bước ra được ánh sáng, tôi không thể ngoảnh mặt làm ngơ trước những người đang loay hoay trong bóng tối.
          </h2>

          <div className="space-y-4 text-sm md:text-base text-[#2D312E] dark:text-[#D1CCC4] leading-relaxed">
            <p>
              Nhìn ra ngoài kia, tôi thấy hàng triệu người trẻ tài năng đang bị những chiếc màn hình điện thoại thiêu rụi ước mơ và bào mòn sinh lực mỗi ngày. Họ không hề kém cỏi, họ chỉ đơn giản là đang thiếu một chiếc phao cứu sinh, thiếu một phương pháp khoa học và một không gian đủ thấu hiểu để tựa vào.
            </p>
            <p>
              Cái tên <strong>"Trại Cai Nghiện"</strong> nghe có thể gai góc, nhưng bản chất nơi đây là một <strong>Góc Tĩnh Lặng (Sanctuary)</strong>:
            </p>
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#151816]/90 border border-[#E6E1D8] dark:border-[#2E3531] space-y-3 font-serif">
              <p className="text-[#3A5A40] dark:text-[#78A380] font-bold text-base md:text-lg">
                "Trại Cai Nghiện chỉ đơn giản là nơi tụi mình giúp bạn tìm lại con người với nhiều động lực và ước mơ nhất của bạn — một phiên bản tươi mới, sắc bén và tĩnh tại mà bạn đã từng sở hữu trước khi bị các bẫy kích thích số giam cầm."
              </p>
              <p className="text-xs md:text-sm text-[#6B726E] dark:text-[#9DA39F] not-italic font-sans">
                Tụi mình không tiếp cận bạn bằng tâm thế con buôn chèo kéo khóa học. Tụi mình ở đây như một người anh em đã từng vượt qua vũng lầy, sẵn sàng chìa tay kéo bạn đứng dậy để cùng bạn làm chủ sự tập trung và sống có chủ đích.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BA TRỤ CỘT NIỀM TIN BẤT DI BẤT DỊCH */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#2D312E] dark:text-[#F0ECE6]">
            Ba Trụ Cột Giúp Bạn Giành Lại Tâm Trí
          </h2>
          <p className="text-xs md:text-sm text-[#6B726E] dark:text-[#9DA39F]">
            Bộ ba kim chỉ nam xuyên suốt mọi bài viết, video và công cụ của Trại Cai Nghiện
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1F1C] border border-[#E6E1D8] dark:border-[#2E3531] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF0EC] dark:bg-[#202A23] text-[#3A5A40] dark:text-[#78A380] flex items-center justify-center font-bold text-lg font-serif">
              1
            </div>
            <h3 className="font-bold text-lg font-serif text-[#2D312E] dark:text-[#F0ECE6]">Hiểu Hành Vi</h3>
            <p className="text-xs text-[#6B726E] dark:text-[#9DA39F] leading-relaxed">
              Dựa trên y văn và khoa học thần kinh để soi rọi cơ chế Dopamine và phản ứng của não bộ. Khi bạn hiểu vì sao mình thèm lướt máy, bạn sẽ xóa sạch mặc cảm tội lỗi để bắt đầu hồi phục.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1F1C] border border-[#E6E1D8] dark:border-[#2E3531] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F9EFE9] dark:bg-[#2D231C] text-[#C27D53] dark:text-[#D48C62] flex items-center justify-center font-bold text-lg font-serif">
              2
            </div>
            <h3 className="font-bold text-lg font-serif text-[#2D312E] dark:text-[#F0ECE6]">Thực Hành Thay Đổi</h3>
            <p className="text-xs text-[#6B726E] dark:text-[#9DA39F] leading-relaxed">
              Không dùng kỷ luật thép hà khắc. Chúng tôi trao cho bạn các công cụ vi mô (Kaizen 1%, The Big Rocks, Dopamine Menu) để bạn dễ dàng hành động ngay cả khi năng lượng cạn kiệt nhất.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1F1C] border border-[#E6E1D8] dark:border-[#2E3531] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF0EC] dark:bg-[#202A23] text-[#3A5A40] dark:text-[#78A380] flex items-center justify-center font-bold text-lg font-serif">
              3
            </div>
            <h3 className="font-bold text-lg font-serif text-[#2D312E] dark:text-[#F0ECE6]">Sống Có Chủ Đích</h3>
            <p className="text-xs text-[#6B726E] dark:text-[#9DA39F] leading-relaxed">
              Giành lại sự tập trung không phải để cày cuốc kiệt sức, mà để giải phóng tâm trí cho những điều thực sự quan trọng: Sự nghiệp đam mê, gia đình yêu thương và sự bình an nội tại.
            </p>
          </div>
        </div>
      </section>

      {/* 7. RANH GIỚI AN TOÀN Y TẾ */}
      <section className="p-8 rounded-3xl bg-[#FAF7F2] dark:bg-[#1E2420] border border-[#E6E1D8] dark:border-[#2E3531] space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#3A5A40] dark:text-[#78A380]" />
          <h2 className="text-lg md:text-xl font-bold font-serif text-[#2D312E] dark:text-[#F0ECE6]">
            Ranh Giới An Toàn Của Trại Cai Nghiện
          </h2>
        </div>
        <div className="text-xs md:text-sm text-[#6B726E] dark:text-[#9DA39F] leading-relaxed space-y-2">
          <p>
            • Dự án tập trung vào việc <strong>khắc phục các thói quen xao nhãng số và mất tập trung thời hiện đại</strong>: Nghiện lướt short video (TikTok, Reels, Shorts), nhảy tab liên tục, hội chứng sương mù não (Brain Fog), trì hoãn công việc và thức khuya dán mắt vào màn hình.
          </p>
          <p>
            • Trại Cai Nghiện là nền tảng chia sẻ kiến thức khoa học hành vi và kinh nghiệm thực chứng của người thường dành cho người thường. Chúng tôi <strong>không đưa ra chẩn đoán y khoa</strong>, không kê đơn thuốc và không thay thế các liệu pháp điều trị tâm thần lâm sàng chuyên nghiệp.
          </p>
          <p>
            • Đối với các trường hợp nghiện chất kích thích nặng, nghiện rượu bia nghiêm trọng hoặc rối loạn lo âu / trầm cảm lâm sàng sâu sắc, chúng tôi luôn khẩn thiết khuyến nghị bạn tìm kiếm sự trợ giúp trực tiếp từ các bác sĩ chuyên khoa và bệnh viện uy tín.
          </p>
        </div>
      </section>

      {/* 8. CTA BOTTOM */}
      <div className="text-center space-y-5 pt-4">
        <h3 className="text-2xl md:text-3xl font-bold font-serif text-[#2D312E] dark:text-[#F0ECE6]">
          Bạn đã sẵn sàng cùng tôi giành lại quyền làm chủ tâm trí?
        </h3>
        <p className="text-xs md:text-sm text-[#6B726E] dark:text-[#9DA39F] max-w-lg mx-auto">
          Bước đi đầu tiên luôn bắt đầu từ việc hiểu rõ tình trạng hiện tại của bộ não mình. Hãy dành ra 3 phút để làm bài trắc nghiệm nhận diện ẩn danh.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Link
            href="/trac-nghiem"
            className="px-8 py-4 rounded-2xl font-bold text-sm text-white bg-[#3A5A40] hover:bg-[#2F4A34] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Đo mức độ mất tập trung (25 câu miễn phí)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/bai-viet"
            className="px-8 py-4 rounded-2xl font-bold text-sm border border-[#E6E1D8] dark:border-[#2E3531] text-[#2D312E] dark:text-[#F0ECE6] hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center"
          >
            Khám phá kho bài viết chuyên sâu
          </Link>
        </div>
      </div>

    </div>
  );
}
