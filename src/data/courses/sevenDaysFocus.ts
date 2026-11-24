import type { Course } from '../../types/course';

export const sevenDaysFocusCourse: Course = {
  slug: '7-ngay-tap-trung',
  title: '7 Ngày Lấy Lại Sự Tập Trung',
  tagline: 'Lộ trình khoa học thần kinh giúp bạn dọn dẹp sương mù não, thoát khỏi bẫy dopamine ngắn và làm chủ sự chú ý sâu.',
  badge: 'Hệ Thống Cai Nghiện • Miễn Phí 100%',
  description: 'Một hành trình 7 ngày thực chiến, mỗi ngày 5 phút đọc và 15 phút thực hành, giúp bạn khôi phục thùy trán, thiết lập môi trường không xao nhãng và tìm lại trạng thái dòng chảy (Flow State) trong công việc và đời sống.',
  targetAudience: 'Người làm việc trí óc, sáng tạo nội dung, sinh viên và bất kỳ ai đang cảm thấy não bộ bị phân mảnh bởi video ngắn, thông báo và thói quen nhảy tab vô thức.',
  commitment: '5 phút đọc lý thuyết • 15 phút thực hành hành động vi mô mỗi ngày',
  totalDays: 7,
  days: [
    {
      dayNumber: 1,
      slug: 'ngay-1-nhan-dien-ma-tran-xao-nhang',
      title: 'Nhận Diện Ma Trận Xao Nhãng & Dọn Sạch Rác Số',
      subtitle: 'Hiểu cơ chế não bộ bị phân mảnh và thực hiện thanh lọc môi trường thiết bị ngay trong 24 giờ đầu tiên.',
      durationMinutes: 20,
      readTimeMinutes: 5,
      summary: 'Trước khi rèn luyện sự tập trung, bạn phải dọn sạch những chiếc móc câu chú ý đang cắm sâu vào tâm trí bạn từ chiếc điện thoại.',
      heroQuote: 'Sự chú ý là tài sản quý giá nhất của sinh mệnh. Khi bạn để người khác giật dây sự chú ý, bạn đang trao quyền định đoạt cuộc đời mình cho thuật toán.',
      heroQuoteAuthor: 'Michael Easter — The Comfort Crisis',
      neuroscience: {
        title: 'Cơ Chế Phân Mảnh Thùy Trán (Attention Fragmentation)',
        content: `Khi bạn vừa làm việc vừa để chuông điện thoại hoặc liếc nhìn thông báo, não bộ không hề "đa nhiệm" (multitasking). Khoa học thần kinh chứng minh não chỉ đang nhảy qua nhảy lại liên tục giữa các tác vụ (Task Switching).

Mỗi lần nhảy như vậy tạo ra một hiện tượng gọi là "Độ trễ chú ý còn sót lại" (Attention Residue): một phần năng lượng não vẫn bị kẹt lại ở mẩu tin nhắn bạn vừa đọc. Nghiên cứu của Đại học California chỉ ra rằng, sau một lần bị ngắt quãng, não bộ cần trung bình 23 phút 15 giây mới có thể quay trở lại trạng thái tập trung sâu hoàn toàn.

Nếu một ngày bạn bị ngắt quãng 20 lần, não bộ của bạn vĩnh viễn không bao giờ chạm được vào vùng tư duy sâu. Bạn kết thúc ngày làm việc trong kiệt sức dù chưa hoàn thành được việc gì có ý nghĩa.`
      },
      trap: {
        title: 'Bẫy Tâm Lý: Ảo Tưởng "Mình Chỉ Liếc 3 Giây Thôi"',
        content: `Cơn nghiện xao nhãng không bắt đầu bằng một quyết định lớn. Nó bắt đầu bằng một chuyển động ngón tay hoàn toàn vô thức: mở điện thoại lên "xem mấy giờ", rồi mắt nhìn thấy chấm đỏ thông báo, rồi bấm vào lướt 45 phút. 

Các ứng dụng công nghệ thuê hàng nghìn kỹ sư khoa học hành vi hàng đầu thế giới chỉ để tối ưu hóa màu đỏ thông báo và thuật toán giật dây dopamine mỗi 3 giây. Đừng trách bản thân yếu đuối, mà hãy tỉnh táo nhìn thấy: bạn đang đơn độc đối đầu với một siêu máy tính được thiết kế để bạn phải nghiện.`
      },
      action: {
        title: 'Bài Tập Vi Mô Hôm Nay: Chiến Dịch "Màn Hình Tĩnh Lặng"',
        steps: [
          'Tắt 100% thông báo biểu ngữ (banner) và âm thanh của tất cả mạng xã hội (Facebook, TikTok, Instagram, YouTube, Shopee). Chỉ giữ lại cuộc gọi khẩn cấp từ người thân/công việc.',
          'Chuyển màn hình điện thoại sang chế độ Đen Trắng (Grayscale / Thang màu xám). Không có màu sắc kích thích thị giác, điện thoại sẽ trở về đúng bản chất là một công cụ đơn thuần.',
          'Dọn sạch màn hình chính (Home screen): Gỡ toàn bộ icon mạng xã hội vào thư mục sâu hoặc xóa hẳn khỏi màn hình chính, chỉ để lại 4 công cụ thiết yếu (Ghi chú, Lịch, Bản đồ, Đồng hồ).'
        ]
      },
      checklist: [
        { id: 'd1_notif', label: 'Đã tắt thông báo của toàn bộ mạng xã hội và sàn thương mại điện tử' },
        { id: 'd1_grayscale', label: 'Đã kích hoạt chế độ màn hình Đen Trắng (Grayscale) trên điện thoại' },
        { id: 'd1_clean_home', label: 'Đã dọn sạch màn hình chính, không còn một icon ứng dụng giải trí nào' }
      ],
      reflectionQuestion: 'Cảm giác đầu tiên của bạn khi nhìn màn hình điện thoại đen trắng là gì? Có phải một sự bồn chồn trống trải nhẹ nhàng không?'
    },
    {
      dayNumber: 2,
      slug: 'ngay-2-nhip-sinh-hoc-ultradian-90-phut',
      title: 'Kỹ Thuật 90 Phút Nhịp Sinh Học Ultradian',
      subtitle: 'Học cách làm việc theo làn sóng tự nhiên của não bộ thay vì ép buộc bản thân cày cuốc độc hại (Toxic Hustle).',
      durationMinutes: 20,
      readTimeMinutes: 5,
      summary: 'Não người không phải cỗ máy chạy 8 tiếng liên tục. Làm việc sâu 90 phút rồi nghỉ trọn vẹn 20 phút mang lại hiệu suất gấp 3 lần ngồi lì cả ngày.',
      heroQuote: 'Năng suất đỉnh cao không đến từ việc bạn ngồi bao nhiêu giờ trên ghế, mà đến từ việc bạn có mặt trọn vẹn bao nhiêu phần trăm trong từng phút giây.',
      heroQuoteAuthor: 'Cal Newport — Deep Work',
      neuroscience: {
        title: 'Khoa Học Về Nhịp Sinh Học Ultradian Rhythm',
        content: `Nhà nghiên cứu giấc ngủ hàng đầu thế giới Nathaniel Kleitman phát hiện ra rằng: Cơ thể con người không chỉ có nhịp ngày đêm 24 giờ (Circadian Rhythm), mà trong ban ngày, não bộ còn vận hành theo các chu kỳ 90-120 phút gọi là Nhịp Ultradian.

Trong 90 phút đầu tiên, sóng não beta và gamma hoạt động mạnh mẽ, cho phép khả năng tư duy logic và tập trung cao nhất. Nhưng sau 90 phút, lượng adenosine và chất ức chế thần kinh tích tụ, não bắt đầu phát tín hiệu bồn chồn, ngáp, mất tập trung. 

Nếu bạn cố chống lại tín hiệu này bằng cách uống thêm cà phê hoặc vừa làm vừa lướt mạng, bạn đang ép não rơi vào trạng thái "kiệt sức mạn tính". Nếu bạn đứng dậy nghỉ ngơi thực sự trong 15-20 phút, não sẽ được nạp lại năng lượng cho một chu kỳ 90 phút tiếp theo.`
      },
      trap: {
        title: 'Bẫy Tâm Lý: Cố Làm Cố Ngồi Để Cảm Thấy Mình Đang Chăm Chỉ',
        content: `Rất nhiều người bị dính bẫy "bận rộn ảo" (Fake Busy): ngồi trước màn hình 8 tiếng, nhưng 4 tiếng là nhảy tab, xem tin tức, sửa font chữ, trả lời email lặt vặt. Đến cuối ngày thì mỏi mắt, đau vai gáy nhưng công việc quan trọng nhất vẫn dậm chân tại chỗ.

Ngồi lì không phải là kỷ luật. Dám dừng lại nghỉ ngơi đúng lúc mới là trí tuệ của người làm chủ năng lượng.`
      },
      action: {
        title: 'Bài Tập Vi Mô Hôm Nay: 1 Khối Deep Work 90 Phút Độc Bản',
        steps: [
          'Chọn 1 nhiệm vụ quan trọng nhất (The One Thing) mà nếu hoàn thành xong, ngày hôm nay coi như thành công 80%.',
          'Hẹn giờ đúng 90 phút. Trong 90 phút này: Không mở tab mới ngoài việc đang làm, úp điện thoại mặt kính xuống bàn hoặc để phòng khác.',
          'Khi chuông hết 90 phút reo: Dừng lại ngay lập tức. Đứng dậy đi bộ, uống nước, vươn vai, nhìn ra xa trong 15 phút. Tuyệt đối không chạm vào điện thoại trong giờ nghỉ.'
        ]
      },
      checklist: [
        { id: 'd2_select_task', label: 'Đã xác định rõ 1 nhiệm vụ cốt lõi duy nhất cho ngày hôm nay' },
        { id: 'd2_run_90min', label: 'Đã thực hiện trọn vẹn 1 phiên 90 phút đơn nhiệm không gián đoạn' },
        { id: 'd2_real_rest', label: 'Đã nghỉ ngơi 15 phút không màn hình (đi bộ, uống nước, nhắm mắt tĩnh tâm)' }
      ],
      reflectionQuestion: 'Sau 90 phút tập trung sâu một mạch, bạn thấy khối lượng công việc hoàn thành so với cả buổi sáng như thế nào?'
    },
    {
      dayNumber: 3,
      slug: 'ngay-3-thiet-ke-khong-gian-tinh-lang',
      title: 'Thiết Kế Không Gian Làm Việc Tĩnh Lặng',
      subtitle: 'Biến bàn làm việc thành thánh đường của sự chú ý (Sanctuary Environment) bằng việc kiểm soát ma sát vật lý.',
      durationMinutes: 20,
      readTimeMinutes: 5,
      summary: 'Kỷ luật tự thân là nguồn tài nguyên có hạn. Người thông minh không dùng ý chí để chống lại cám dỗ, họ thiết kế môi trường để cám dỗ không thể xảy ra.',
      heroQuote: 'Môi trường là bàn tay vô hình nhào nặn hành vi con người. Thay đổi môi trường, thói quen tự khắc thay đổi.',
      heroQuoteAuthor: 'James Clear — Atomic Habits',
      neuroscience: {
        title: 'Nghiên Cứu "Sức Hút Vô Hình Của Điện Thoại" (Brain Drain)',
        content: `Một nghiên cứu chấn động của Đại học Texas tại Austin năm 2017 trên gần 800 người tham gia đã chứng minh:

Ngay cả khi chiếc điện thoại của bạn đang tắt chuông và để úp mặt xuống trên bàn làm việc, năng lực xử lý nhận thức (Cognitive Capacity) và trí nhớ làm việc (Working Memory) của bạn vẫn bị sụt giảm đáng kể.

Lý do là não bộ của bạn phải liên tục tiêu tốn một phần năng lượng ý chí ngầm chỉ để "chống lại thôi thúc với tay cầm điện thoại". Chỉ khi chiếc điện thoại được mang sang một căn phòng khác hoàn toàn, chỉ số tập trung của các đối tượng mới phục hồi về mức tối đa.`
      },
      trap: {
        title: 'Bẫy Tâm Lý: "Để Điện Thoại Kế Bên Để Lỡ Ai Gọi Cần Gấp"',
        content: `Trong 99% trường hợp, không có cuộc gọi nào thực sự sinh tử đến mức không thể chờ sau 90 phút. Đó chỉ là cái cớ mà con người nghiện dopamine bên trong bạn đưa ra để giữ chiếc máy nằm trong tầm với của ngón tay.`
      },
      action: {
        title: 'Bài Tập Vi Mô Hôm Nay: Quy Tắc "Khác Phòng" (Different Room Rule)',
        steps: [
          'Dọn sạch mặt bàn: Bàn làm việc chỉ để lại máy tính, 1 quyển sổ tay, 1 cây bút và 1 ly nước lọc. Loại bỏ mọi giấy tờ rác, đồ ăn vặt hay dây sạc lằng nhằng.',
          'Trong khung giờ làm việc sâu: Mang điện thoại đặt ở phòng khác (phòng khách hoặc kệ giày). Khoảng cách vật lý 10 bước chân sẽ tạo ra "ma sát" đủ lớn để cắt đứt cơn bốc đồng vô thức.',
          'Đóng toàn bộ tab trình duyệt không liên quan trước khi bắt đầu phiên làm việc mới.'
        ]
      },
      checklist: [
        { id: 'd3_clean_desk', label: 'Bàn làm việc chỉ còn máy tính, sổ, bút và ly nước' },
        { id: 'd3_phone_other_room', label: 'Đã để điện thoại ở phòng khác trong suốt phiên làm việc' },
        { id: 'd3_tab_hygiene', label: 'Dọn sạch các tab trình duyệt rác, chỉ giữ đúng trang phục vụ công việc' }
      ],
      reflectionQuestion: 'Khi điện thoại ở phòng khác, bao nhiêu lần bạn giật mình đưa tay tìm nó trong vô thức?'
    },
    {
      dayNumber: 4,
      slug: 'ngay-4-tai-lap-dopamine-lam-ban-voi-su-nham-chan',
      title: 'Tái Lập Thụ Thể Dopamine D2 & Làm Bạn Với Sự Nhàm Chán',
      subtitle: 'Khôi phục độ nhạy cảm của não bộ và học cách đón nhận sự khó chịu lành mạnh (Lean into Discomfort).',
      durationMinutes: 20,
      readTimeMinutes: 5,
      summary: 'Nếu não bạn quen với món ăn nhanh dopamine cực mạnh từ TikTok, những việc bình dị nhưng giá trị như đọc sách hay suy tư sẽ trở nên vô cùng nhạt nhẽo.',
      heroQuote: 'Khả năng chịu đựng sự nhàm chán mà không tìm kiếm kích thích rẻ tiền chính là siêu năng lực phân loại người xuất chúng trong kỷ nguyên số.',
      heroQuoteAuthor: 'Anna Lembke — Dopamine Nation',
      neuroscience: {
        title: 'Cơ Chế Bập Bênh Thần Kinh: Thụ Thể Dopamine D2',
        content: `Giáo sư Tâm thần học Anna Lembke tại Đại học Stanford giải thích rằng: Khoái cảm và nỗi đau vận hành như một chiếc bập bênh trong não bộ.

Khi bạn lướt một video ngắn hài hước, chiếc bập bênh nghiêng mạnh về phía khoái cảm. Ngay lập tức, não bộ sẽ hạ thấp số lượng thụ thể Dopamine D2 để đưa chiếc bập bênh về trạng thái cân bằng. Càng nạp nhiều dopamine công nghiệp, ngưỡng kích thích của bạn càng bị đẩy lên cao (hiện tượng chai sạn cảm xúc).

Hậu quả là bạn mất khả năng cảm nhận niềm vui từ những việc đòi hỏi sự kiên nhẫn: đọc một trang sách, viết một đoạn văn hay ngồi yên ngắm mưa. Muốn lấy lại sự tập trung, bạn phải dũng cảm trải qua giai đoạn "đói dopamine" để não bộ tái sinh lại các thụ thể D2.`
      },
      trap: {
        title: 'Bẫy Tâm Lý: Sợ Sự Rảnh Rỗi & Phải Lấp Đầy Mọi Khoảng Trống',
        content: `Đứng chờ đèn đỏ: rút điện thoại ra. Đi thang máy 20 giây: rút điện thoại ra. Đi vệ sinh: cầm điện thoại theo. 

Chúng ta đã đánh mất hoàn toàn khả năng ở một mình với chính mình. Mỗi khi tâm trí có khoảng trống, ta lập tức nhét rác số vào để xoa dịu cảm giác bồn chồn trống trải.`
      },
      action: {
        title: 'Bài Tập Vi Mô Hôm Nay: 15 Phút "Không Làm Gì Cả" (The Mindful Boredom)',
        steps: [
          'Chọn 15 phút vào buổi chiều hoặc trước bữa tối. Ngồi yên trên ghế, bên cửa sổ hoặc ban công.',
          'Không điện thoại, không sách, không nhạc, không podcast, không đồ ăn thức uống.',
          'Để tâm trí tự do trôi nổi. Quan sát những cơn bồn chồn nổi lên trong lồng ngực mà không vội vàng tìm cách dập tắt nó. Học cách hòa giải với sự tĩnh lặng.'
        ]
      },
      checklist: [
        { id: 'd4_no_phone_bathroom', label: 'Cả ngày hôm nay: Tuyệt đối không mang điện thoại vào nhà vệ sinh' },
        { id: 'd4_red_light_presence', label: 'Đứng chờ thang máy hoặc đèn đỏ: Để tay thảnh thơi, không rút điện thoại' },
        { id: 'd4_15min_stillness', label: 'Hoàn thành 15 phút ngồi yên tĩnh lặng một mình không kích thích' }
      ],
      reflectionQuestion: 'Trong 15 phút ngồi yên, tâm trí bạn đã xuất hiện những suy nghĩ hay cảm xúc thú vị nào?'
    },
    {
      dayNumber: 5,
      slug: 'ngay-5-quy-trinh-brain-dump-time-blocking',
      title: 'Quy Trình Brain Dump & Khung Thời Gian Time-Blocking',
      subtitle: 'Xả sạch áp lực tồn đọng trong tâm trí ra trang giấy và đóng gói ngày làm việc có chủ đích.',
      durationMinutes: 20,
      readTimeMinutes: 5,
      summary: 'Não bộ sinh ra để sáng tạo ý tưởng chứ không phải để làm kho lưu trữ việc cần làm. Hãy đổ rác tâm trí ra trang giấy.',
      heroQuote: 'Tâm trí bạn như một dòng sông. Khi chứa quá nhiều mảnh vụn lo âu, nước sẽ đục ngầu. Hãy để trang giấy gánh vác sức nặng thay cho thùy trán của bạn.',
      heroQuoteAuthor: 'David Allen — Getting Things Done',
      neuroscience: {
        title: 'Hiệu Ứng Zeigarnik: Nguồn Cội Của Cơn Lo Âu Ngầm',
        content: `Nhà tâm lý học Bluma Zeigarnik phát hiện ra rằng: Não bộ con người có xu hướng bị ám ảnh và liên tục nhớ về những việc chưa hoàn thành (Unfinished Tasks).

Mỗi khi bạn có một đầu việc chưa làm ("phải gửi email cho sếp", "phải đóng tiền điện", "phải mua sữa"), não bộ sẽ mở một "vòng lặp mở" (Open Loop) chạy ngầm như ứng dụng ngốn RAM. Càng nhiều vòng lặp mở, bạn càng cảm thấy choáng ngợp, stress và không thể tập trung vào việc hiện tại.

Chỉ khi bạn viết chính xác việc đó ra giấy kèm thời điểm xử lý, não bộ mới tin rằng nhiệm vụ đã được kiểm soát và chính thức đóng vòng lặp lại.`
      },
      trap: {
        title: 'Bẫy Tâm Lý: Lập Danh Sách Việc Cần Làm Dài 20 Đầu Việc (To-do List)',
        content: `Một danh sách 20 việc cần làm không giúp bạn tập trung hơn, nó chỉ khiến bạn hoảng loạn. Bạn sẽ có xu hướng chọn những việc dễ nhất và ít quan trọng nhất để làm trước (như check mail hay quét nhà), rồi trì hoãn việc sống còn lại đến nửa đêm.`
      },
      action: {
        title: 'Bài Tập Vi Mô Hôm Nay: Ghi Chép Xả Rác & 3 Khối Thời Gian Vàng',
        steps: [
          'Thực hiện Brain Dump: Lấy một tờ giấy trắng, viết ra tất cả những gì đang lởn vởn trong đầu bạn trong 5 phút (việc cần làm, nỗi lo, ý tưởng). Không cần sắp xếp thứ tự.',
          'Chọn ra đúng 3 việc quan trọng nhất cho ngày hôm nay (Top 3 Priorities).',
          'Khóa thời gian (Time-blocking): Gán giờ cụ thể vào lịch cho 3 việc này (ví dụ: 09:00 - 10:30 làm Việc 1). Mọi việc khác dời sang khung giờ phụ.'
        ]
      },
      checklist: [
        { id: 'd5_brain_dump', label: 'Đã xả rác toàn bộ đầu óc ra giấy trắng trong 5 phút' },
        { id: 'd5_top_3', label: 'Đã khoanh vùng đúng 3 việc quan trọng nhất trong ngày' },
        { id: 'd5_time_block', label: 'Đã gán khung giờ cụ thể trên lịch cho 3 việc này' }
      ],
      reflectionQuestion: 'Sau khi viết hết mọi lo âu ra giấy, đầu óc bạn có cảm thấy nhẹ nhõm hơn không?'
    },
    {
      dayNumber: 6,
      slug: 'ngay-6-ky-luat-khong-can-gong-kaizen-1-phan-tram',
      title: 'Kỷ Luật Không Cần Gồng: Kaizen 1% Vi Mô',
      subtitle: 'Ứng dụng triết lý tối giản Nhật Bản để biến sự tập trung thành phản xạ tự nhiên không tốn ý chí.',
      durationMinutes: 20,
      readTimeMinutes: 5,
      summary: 'Kỷ luật bền vững nhất là kỷ luật không cần phải nỗ lực gồng mình. Hãy chia nhỏ hành động đến mức não bạn không thể viện cớ từ chối.',
      heroQuote: 'Hành trình vạn dặm bắt đầu từ một bước chân. Đừng cố gắng hoàn hảo ngay lập tức, hãy chỉ cần tiến bộ 1% mỗi ngày.',
      heroQuoteAuthor: 'Lão Tử — Đạo Đức Kinh',
      neuroscience: {
        title: 'Cơ Chế Kháng Cự Của Hạch Hạnh Nhân (Amygdala Resistance)',
        content: `Khi bạn đặt ra một mục tiêu quá lớn ("ngày mai mình sẽ học 8 tiếng liên tục", "mình sẽ bỏ hẳn điện thoại"), vùng hạch hạnh nhân (trung tâm sợ hãi và sinh tồn của não) sẽ bị kích hoạt. Nó coi mục tiêu lớn đó như một mối đe dọa sinh học và lập tức thôi thúc cơ chế né tránh: Trì hoãn (Procrastination).

Ngược lại, khi bạn áp dụng phương pháp Kaizen: thu nhỏ hành động xuống một mức độ vi mô cực thấp ("mình chỉ ngồi vào bàn 5 phút thôi", "mình chỉ đọc 1 trang sách thôi"), hạch hạnh nhân sẽ hoàn toàn ngủ yên vì không thấy có mối nguy hiểm nào.

Khi đã vượt qua được sức ỳ ban đầu và bước vào hành động, định luật quán tính sẽ giúp bạn tự động tiếp tục làm việc một cách nhẹ nhàng.`
      },
      trap: {
        title: 'Bẫy Tâm Lý: Tư Duy "Tất Cả Hoặc Không Có Gì" (All-or-Nothing)',
        content: `"Hôm nay mình lỡ lướt TikTok 30 phút rồi, thôi hỏng cả ngày rồi, lướt nốt đến tối mai làm lại từ đầu". Đây là cái bẫy tự hoại phổ biến nhất. Một vết xước nhỏ trên xe không có nghĩa là bạn phải đập nát cả chiếc xe!`
      },
      action: {
        title: 'Bài Tập Vi Mô Hôm Nay: Quy Tắc 2 Phút Khởi Động',
        steps: [
          'Chọn một việc bạn đang muốn né tránh hoặc trì hoãn suốt tuần qua.',
          'Tự cam kết với bản thân: "Tôi chỉ làm việc này đúng 2 phút. Sau 2 phút, nếu muốn dừng lại tôi hoàn toàn có quyền dừng lại."',
          'Mở tài liệu ra và làm đúng 2 phút. Trải nghiệm cảm giác kỳ diệu khi sức ỳ bị bẻ gãy.'
        ]
      },
      checklist: [
        { id: 'd6_pick_procrastination', label: 'Đã gọi tên đúng 1 việc mình đang trì hoãn né tránh' },
        { id: 'd6_apply_2min', label: 'Đã thực hiện cam kết 2 phút khởi động cho nhiệm vụ đó' },
        { id: 'd6_self_compassion', label: 'Tự bao dung với bản thân nếu lỡ có những phút xao nhãng trong ngày' }
      ],
      reflectionQuestion: 'Khi bắt đầu 2 phút đầu tiên, bạn có thấy việc đó dễ thở hơn rất nhiều so với nỗi sợ trong tưởng tượng không?'
    },
    {
      dayNumber: 7,
      slug: 'ngay-7-duy-tri-su-chu-y-ben-bi-ke-hoach-30-ngay',
      title: 'Duy Trì Sự Chú Ý Bền Bỉ & Bản Kế Hoạch 30 Ngày Tới',
      subtitle: 'Tổng kết hành trình, neo giữ bản sắc mới và thiết lập hệ thống tự vận hành để sống có chủ đích trọn đời.',
      durationMinutes: 20,
      readTimeMinutes: 5,
      summary: 'Bạn không còn là người bị thuật toán điều khiển. Bạn là người làm chủ sự chú ý, làm chủ tâm trí và sống một cuộc đời có chủ đích.',
      heroQuote: 'Chúng tôi ở đây để cùng bạn đối diện và giải phóng khỏi xao nhãng số, giành lại quyền làm chủ tâm trí — làm chủ sự tập trung, sống có chủ đích.',
      heroQuoteAuthor: 'Trại Cai Nghiện Manifesto',
      neuroscience: {
        title: 'Sự Tái Cấu Trúc Khả Biến Của Não Bộ (Neuroplasticity)',
        content: `Khoa học thần kinh hiện đại đã chứng minh não bộ không hề cố định: nó liên tục tự tái cấu trúc dựa trên những gì bạn lặp đi lặp lại hàng ngày (Neuroplasticity).

Trong 7 ngày qua, bạn đã bắt đầu làm suy yếu các rãnh mòn thần kinh cũ của thói quen bốc đồng lướt mạng, đồng thời kích thích các nơ-ron thùy trán mới phụ trách việc duy trì chú ý sâu.

Một thói quen cần trung bình 21 đến 66 ngày để trở thành bản năng tự nhiên. 7 ngày này là ngọn lửa mồi đánh thức bạn khỏi cơn mê số. Giờ là lúc bạn chuyển ngọn lửa đó thành một lối sống vững chãi.`
      },
      trap: {
        title: 'Bẫy Tâm Lý: Chủ Quan Và Nghĩ Rằng Mình Đã Hoàn Toàn Miễn Nhiễm',
        content: `Cơn nghiện xao nhãng luôn chờ đợi những lúc bạn mệt mỏi, cô đơn hoặc căng thẳng nhất để kéo bạn quay trở lại. Hãy luôn nhớ: Phòng ngừa trước khi sa bẫy bằng cách duy trì môi trường sạch luôn dễ hơn gấp trăm lần việc dùng ý chí để giằng co.`
      },
      action: {
        title: 'Bài Tập Vi Mô Hôm Nay: 3 Trụ Cột Neo Giữ Cuộc Đời Mới',
        steps: [
          'Trụ cột 1 (Buổi Sáng Tĩnh Lặng): Duy trì 60 phút đầu tiên sau khi ngủ dậy hoàn toàn không chạm vào điện thoại. Uống nước, tập thể dục nhẹ, đọc sách hoặc ngồi tĩnh tâm.',
          'Trụ cột 2 (Khối Deep Work Sáng): Mỗi ngày bắt buộc bảo vệ tối thiểu 1 khối 90 phút tập trung sâu cho công việc cốt lõi.',
          'Trụ cột 3 (Buổi Tối Hồi Phục): Tắt màn hình trước khi đi ngủ 45 phút. Đưa điện thoại sạc ở ngoài phòng ngủ.'
        ]
      },
      checklist: [
        { id: 'd7_morning_ritual', label: 'Cam kết 60 phút buổi sáng không chạm vào màn hình' },
        { id: 'd7_daily_deep_work', label: 'Cam kết bảo vệ tối thiểu 1 khung giờ 90 phút Deep Work mỗi ngày' },
        { id: 'd7_bedroom_sanctuary', label: 'Đưa sạc điện thoại ra khỏi phòng ngủ để ngủ ngon trọn vẹn' }
      ],
      reflectionQuestion: 'Sau 7 ngày đồng hành cùng Trại Cai Nghiện, sự thay đổi rõ rệt nhất bên trong tâm trí bạn là gì?'
    }
  ]
};
