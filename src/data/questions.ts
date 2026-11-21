export interface Question {
  id: number;
  stageId: number;
  stageName: string;
  stageIcon: string;
  question: string;
  scenario: string;
  scientificReference: string;
  options: {
    text: string;
    score: number;
  }[];
}

export const assessmentQuestions: Question[] = [
  // =========================================================================
  // CHẶNG 1: NĂNG LỰC LÀM VIỆC SÂU & ĐƠN NHIỆM (1-5)
  // Cơ sở khoa học: Derryberry & Reed (ACS - Focusing), WHO ASRS, Cal Newport (Deep Work)
  // =========================================================================
  {
    id: 1,
    stageId: 1,
    stageName: "Chú Ý Sâu & Đơn Nhiệm",
    stageIcon: "🎯",
    question: "Khi bắt đầu một công việc cần suy nghĩ nhiều, bạn có thể duy trì sự tập trung liên tục trong bao lâu trước khi thôi thúc bỏ cuộc xuất hiện?",
    scenario: "Khi bạn ngồi vào bàn với một báo cáo khó, viết lách, hay học kỹ năng mới...",
    scientificReference: "Derryberry & Reed (ACS Focusing Scale) & Nhịp sinh học Ultradian 90 phút",
    options: [
      { text: "Cứ 10-15 phút là mắt lại ngó nghiêng, tay muốn mở tab khác hoặc chạm vào điện thoại.", score: 2 },
      { text: "Tôi tập trung sâu liên tục 45-60 phút một mạch một cách thoải mái, không cần ngắt quãng.", score: 0 },
      { text: "Chưa đầy 3-5 phút đã bồn chồn khó chịu, không thể ngồi yên và lập tức mở video hoặc lướt mạng.", score: 3 },
      { text: "Duy trì tốt khoảng 25-30 phút, sau đó cảm thấy hơi mỏi và cần đứng dậy nghỉ ngắn 5 phút.", score: 1 },
    ],
  },
  {
    id: 2,
    stageId: 1,
    stageName: "Chú Ý Sâu & Đơn Nhiệm",
    stageIcon: "🎯",
    question: "Khả năng đọc một chương sách dày (20 trang) hoặc một tài liệu học thuật phức tạp không có hình ảnh minh họa?",
    scenario: "Khi bộ não phải xử lý văn bản dài có chiều sâu tư duy...",
    scientificReference: "Nicholas Carr (The Shallows) & Brown & Ryan (MAAS)",
    options: [
      { text: "Đọc say sưa, hiểu sâu và cảm nhận trọn vẹn mạch tư duy của tác giả từ đầu đến cuối.", score: 0 },
      { text: "Đọc được 2-3 trang là mắt díu lại, lướt chữ như quét mắt qua loa mà không đọng lại gì.", score: 2 },
      { text: "Đôi lúc bị xao nhãng nhưng tự kéo sự chú ý về trang sách và hoàn thành được mục tiêu đề ra.", score: 1 },
      { text: "Không thể đọc nổi 1 trang giấy; chữ như nhảy múa, não bực bội từ chối tiếp nhận và phải cầm máy lướt clip ngay.", score: 3 },
    ],
  },
  {
    id: 3,
    stageId: 1,
    stageName: "Chú Ý Sâu & Đơn Nhiệm",
    stageIcon: "🎯",
    question: "Mức độ đơn nhiệm (Mono-tasking) khi bạn xử lý một công việc mang tính sống còn?",
    scenario: "Cách bạn bố trí không gian làm việc trên máy tính hoặc bàn làm việc...",
    scientificReference: "Nghiên cứu Đa nhiệm Đại học Stanford (Prof. Clifford Nass - Cognitive Load)",
    options: [
      { text: "Mở song song 10-15 tab, vừa làm việc vừa bật nhạc/tin tức chạy nền, chuyển đổi qua lại liên tục.", score: 2 },
      { text: "Luôn đóng hết các ứng dụng thừa, chỉ để đúng 1 cửa sổ làm việc duy nhất để dồn toàn bộ tâm trí.", score: 0 },
      { text: "Bật 20-30 tab, vừa gõ việc vừa xem YouTube, vừa lướt mạng; tưởng mình làm nhiều nhưng cuối buổi không xong việc gì.", score: 3 },
      { text: "Mở 2-3 tab liên quan trực tiếp đến việc đang làm, thỉnh thoảng mới liếc qua kiểm tra một tab khác.", score: 1 },
    ],
  },
  {
    id: 4,
    stageId: 1,
    stageName: "Chú Ý Sâu & Đơn Nhiệm",
    stageIcon: "🎯",
    question: "Khi phần khó nhất/thú vị nhất của công việc đã hoàn thành, bạn có kiên trì hoàn tất các chi tiết cuối cùng không?",
    scenario: "Khâu hoàn thiện chi tiết, trau chuốt, kiểm tra lỗi và bàn giao dự án...",
    scientificReference: "WHO ASRS Part A - Item 1 (Trouble wrapping up details of a project)",
    options: [
      { text: "Đôi khi hơi nản lòng nhưng vẫn dành thời gian hoàn thiện đầy đủ các bước còn lại một cách cẩn thận.", score: 1 },
      { text: "Rất hay bỏ dở khâu cuối, bàn giao cẩu thả hoặc để dự án treo lơ lửng nhiều ngày không chịu chốt.", score: 2 },
      { text: "Luôn tỉ mỉ rà soát từng chi tiết cuối cùng trước khi đóng gói và gửi đi một cách chỉn chu.", score: 0 },
      { text: "Gần như không bao giờ hoàn tất trọn vẹn: cứ đến 90% là chán ngấy và bỏ mặc để nhảy sang việc mới.", score: 3 },
    ],
  },
  {
    id: 5,
    stageId: 1,
    stageName: "Chú Ý Sâu & Đơn Nhiệm",
    stageIcon: "🎯",
    question: "Bạn làm việc với sự tỉnh thức nhận biết rõ ràng hay cảm giác như mình đang 'bật chế độ lái tự động' (Autopilot)?",
    scenario: "Khi bạn thao tác trên máy tính, viết báo cáo hay xử lý công việc thường ngày...",
    scientificReference: "Mindful Attention Awareness Scale (Brown & Ryan 2003 - Item 7 & 10)",
    options: [
      { text: "Hiện diện trọn vẹn, cảm nhận rõ từng thao tác và mục đích của hành động mình đang làm.", score: 0 },
      { text: "Thường xuyên làm việc như một cái máy, giật mình nhận ra mình đã bấm chuột hoặc gõ phím vô thức 30 phút.", score: 2 },
      { text: "Thỉnh thoảng có những khoảnh khắc lơ đãng nhưng nhanh chóng nhận biết và kéo mình quay lại hiện tại.", score: 1 },
      { text: "Toàn bộ ngày làm việc trôi qua như một cơn mơ màng; không thể nhớ nổi sáng nay mình đã làm cụ thể những gì.", score: 3 },
    ],
  },

  // =========================================================================
  // CHẶNG 2: KHÁNG XAO NHÃNG SỐ & NHẢY TAB (6-10)
  // Cơ sở khoa học: Dr. Gloria Mark (UC Irvine - Attention Span), Derryberry & Reed, APA
  // =========================================================================
  {
    id: 6,
    stageId: 2,
    stageName: "Kháng Xao Nhãng Số",
    stageIcon: "📱",
    question: "Hiện tượng 'nhảy tab' (Tab-Hopping) và gián đoạn tự thân diễn ra với tần suất như thế nào khi bạn đang làm việc?",
    scenario: "Khi đang gõ một văn bản hay xử lý số liệu quan trọng trên máy tính...",
    scientificReference: "Dr. Gloria Mark (UC Irvine) - Độ dài chú ý trên màn hình trung bình 47 giây",
    options: [
      { text: "Thỉnh thoảng có thôi thúc muốn mở tab mới nhưng dễ dàng kiềm chế lại được để xong việc.", score: 1 },
      { text: "Tôi giữ vững mạch làm việc liên tục cho đến khi hoàn thành xong một khối công việc mới chuyển tác vụ.", score: 0 },
      { text: "Cứ 3-5 phút tay lại tự động bấm Alt+Tab sang đọc báo, lướt tin tức hoặc kiểm tra hộp thư.", score: 2 },
      { text: "Hoàn toàn mất kiểm soát: nhảy tab liên tục như phản xạ cơ thể, không thể duy trì mạch suy nghĩ quá 1 phút.", score: 3 },
    ],
  },
  {
    id: 7,
    stageId: 2,
    stageName: "Kháng Xao Nhãng Số",
    stageIcon: "📱",
    question: "Khả năng chặn lọc tiếng ồn và chuyển động của môi trường xung quanh khi cần tập trung?",
    scenario: "Làm việc tại văn phòng mở, quán cà phê hoặc phòng có tiếng người nói chuyện rì rầm...",
    scientificReference: "Derryberry & Reed (ACS Focusing Item 1) & WHO ASRS (Item 11)",
    options: [
      { text: "Rất dễ bị phân tán; ai nói gì hay đi qua là mắt và tai tự động hướng theo, đứt mạch tư duy.", score: 2 },
      { text: "Có bị ảnh hưởng nhẹ nhưng chỉ cần đeo tai nghe nhạc không lời là tập trung lại được ngay.", score: 1 },
      { text: "Miễn nhiễm hoàn toàn; tôi dễ dàng chìm vào không gian riêng dù xung quanh có ồn ào đến đâu.", score: 0 },
      { text: "Không thể làm việc nổi nếu có tiếng động; trở nên cực kỳ bực bội, cáu kỉnh và bế tắc tư duy hoàn toàn.", score: 3 },
    ],
  },
  {
    id: 8,
    stageId: 2,
    stageName: "Kháng Xao Nhãng Số",
    stageIcon: "📱",
    question: "Bạn mất bao lâu để não bắt lại nhịp tư duy sâu sau khi bị một tin nhắn hoặc người khác ngắt quãng 30 giây?",
    scenario: "Chi phí tàn dư chú ý (Attention Residue) của bộ não sau khi bị gián đoạn...",
    scientificReference: "Dr. Gloria Mark (Thời gian phục hồi 23 phút 15 giây) & Cal Newport (Attention Residue)",
    options: [
      { text: "Mất khoảng 1-2 phút đọc lại đoạn vừa làm để bắt lại dòng suy nghĩ và tiếp tục.", score: 1 },
      { text: "Não bị khựng lại, mất 15-20 phút lướt mạng linh tinh rồi mới có thể gượng ép quay lại công việc.", score: 2 },
      { text: "Trả lời ngắn gọn xong là quay lại ngay với mạch tư duy sâu trước đó chỉ trong vài giây.", score: 0 },
      { text: "Đứt gãy hoàn toàn mạch tập trung; sau đó bỏ cuộc luôn và không thể quay lại làm việc đó trong ngày.", score: 3 },
    ],
  },
  {
    id: 9,
    stageId: 2,
    stageName: "Kháng Xao Nhãng Số",
    stageIcon: "📱",
    question: "Phản xạ kiểm tra thông báo và mở khóa màn hình điện thoại diễn ra như thế nào trên bàn làm việc của bạn?",
    scenario: "Chiếc điện thoại thông minh nằm trong tầm mắt hoặc tầm với của bạn...",
    scientificReference: "B.J. Fogg (Behavior Model) & The Subconscious Habit Loop",
    options: [
      { text: "Cứ 5-10 phút lại thò tay cầm máy mở khóa lên xem dù máy không hề rung hay có thông báo gì.", score: 2 },
      { text: "Tôi để điện thoại ở chế độ im lặng/úp mặt xuống và chỉ kiểm tra vào những giờ giải lao cố định.", score: 0 },
      { text: "Điện thoại dính chặt vào tay; vừa đặt xuống được 30 giây lại nhặt lên quẹt màn hình trong vô thức.", score: 3 },
      { text: "Thỉnh thoảng liếc nhìn khi thấy màn hình sáng lên vì có cuộc gọi hoặc thông báo quan trọng.", score: 1 },
    ],
  },
  {
    id: 10,
    stageId: 2,
    stageName: "Kháng Xao Nhãng Số",
    stageIcon: "📱",
    question: "Hành vi sử dụng màn hình kép (Dual Screening) khi giải trí hoặc tham gia học tập, họp hành?",
    scenario: "Khi bạn đang xem một bộ phim dài, xem video bài giảng hoặc dự họp online...",
    scientificReference: "Nghiên cứu Stanford & MIT Technology Review (Media Multitasking & Working Memory Degradation)",
    options: [
      { text: "Thường xuyên vừa bật phim/họp làm nền vừa cầm điện thoại lướt mạng xã hội lúc phim thoại chậm.", score: 2 },
      { text: "Tôi chỉ chú tâm vào một màn hình duy nhất và thưởng thức trọn vẹn nội dung đó từ đầu đến cuối.", score: 0 },
      { text: "100% thời gian: tay không thể ngừng lướt TikTok/Reels dù trước mặt màn hình TV hay laptop đang chiếu.", score: 3 },
      { text: "Chỉ thỉnh thoảng mới liếc nhìn tin nhắn nếu có việc thực sự khẩn cấp phát sinh.", score: 1 },
    ],
  },

  // =========================================================================
  // CHẶNG 3: NHÀN RỖI & SỨC BỀN BUỒN CHÁN (11-15)
  // Cơ sở khoa học: Michael Easter (The Comfort Crisis), Dr. Anna Lembke (Stanford), MWQ
  // =========================================================================
  {
    id: 11,
    stageId: 3,
    stageName: "Nhàn Rỗi & Buồn Chán",
    stageIcon: "🧘",
    question: "Phản ứng của bạn trước những khoảng trống thời gian ngắn ngủi bất chợt (30 - 60 giây) trong ngày?",
    scenario: "Khi đứng đợi thang máy, dừng đèn đỏ 40 giây hoặc xếp hàng chờ tính tiền siêu thị...",
    scientificReference: "Michael Easter (The Comfort Crisis - The Lost Art of Boredom)",
    options: [
      { text: "Đôi khi hơi sốt ruột nhưng vẫn có thể đứng yên tĩnh lặng thư giãn mà không cần đụng đến máy.", score: 1 },
      { text: "Thả lỏng tâm trí, quan sát không gian xung quanh hoặc tận hưởng sự thảnh thơi ngắn ngủi.", score: 0 },
      { text: "Phần lớn sẽ thò tay vào túi rút điện thoại ra mở khóa lướt qua loa cho đỡ phí thời gian.", score: 2 },
      { text: "Không thể chịu nổi 10 giây rảnh rỗi mà không quẹt màn hình; cảm giác bứt rứt như bị kiến cắn.", score: 3 },
    ],
  },
  {
    id: 12,
    stageId: 3,
    stageName: "Nhàn Rỗi & Buồn Chán",
    stageIcon: "🧘",
    question: "Tần suất tâm trí bạn bị 'trôi dạt' (Mind Wandering) khi người khác đang nói chuyện trực tiếp với bạn?",
    scenario: "Trong một cuộc trò chuyện 1-1 hoặc khi đang họp trực tiếp với đồng nghiệp, người thân...",
    scientificReference: "WHO ASRS Part B - Item 9 & Mind Wandering Questionnaire (Mrazek et al. 2013)",
    options: [
      { text: "Rất hay bị 'nghe bằng một tai': đầu gật gù nhưng trong đầu đang nghĩ về chuyện khác trên mạng.", score: 2 },
      { text: "Luôn lắng nghe chăm chú, thấu cảm và nắm bắt trọn vẹn thông điệp của người đối diện.", score: 0 },
      { text: "Hoàn toàn mất kết nối; người khác nói xong một tràng dài mà bạn không hề biết họ vừa nói gì.", score: 3 },
      { text: "Đôi lúc có một vài suy nghĩ thoáng qua nhưng nhanh chóng kéo tâm trí quay lại cuộc trò chuyện.", score: 1 },
    ],
  },
  {
    id: 13,
    stageId: 3,
    stageName: "Nhàn Rỗi & Buồn Chán",
    stageIcon: "🧘",
    question: "Bạn có bắt buộc phải có âm thanh/hình ảnh kích thích nền khi ăn uống hoặc làm các việc thường ngày không?",
    scenario: "Khi ăn cơm một mình, rửa bát, dọn dẹp phòng hoặc đi bộ ngoài trời...",
    scientificReference: "Brown & Ryan (MAAS Item 14 - Mindless Snacking & Background Stimulation)",
    options: [
      { text: "Thường xuyên vừa ăn vừa lướt mạng xã hội đọc tin tức lặt vặt.", score: 2 },
      { text: "Thưởng thức trọn vẹn bữa ăn hoặc cảm nhận bước chân đi dạo trong sự tĩnh lặng thuần khiết.", score: 0 },
      { text: "Bắt buộc phải có video YouTube, phim review hoặc TikTok bật trước mặt thì mới nuốt nổi miếng cơm.", score: 3 },
      { text: "Thỉnh thoảng nghe một bản nhạc nhẹ hoặc một podcast có chiều sâu để thư giãn đầu óc.", score: 1 },
    ],
  },
  {
    id: 14,
    stageId: 3,
    stageName: "Nhàn Rỗi & Buồn Chán",
    stageIcon: "🧘",
    question: "Cảm xúc bên trong của bạn khi phải đối diện với sự im lặng hoàn toàn mà KHÔNG CÓ bất kỳ thiết bị công nghệ nào?",
    scenario: "Khi bị mất điện, mất mạng internet, hoặc ngồi trong một căn phòng trống không màn hình...",
    scientificReference: "Dr. Anna Lembke (Stanford University - Dopamine Deficit & Restlessness)",
    options: [
      { text: "Hơi bỡ ngỡ lúc đầu nhưng sau đó thích nghi nhanh và tìm được việc thú vị thủ công để làm.", score: 1 },
      { text: "Cảm thấy đây là một món quà tuyệt vời: tâm hồn lắng dịu, bình yên và nhẹ nhõm như được giải thoát.", score: 0 },
      { text: "Cảm thấy trống trải, buồn chán, liên tục đi ra đi vào không biết làm gì cho hết thời gian.", score: 2 },
      { text: "Hoảng loạn, bồn chồn cực độ; cảm giác như bị cô lập khỏi thế giới và bức bối muốn phát điên.", score: 3 },
    ],
  },
  {
    id: 15,
    stageId: 3,
    stageName: "Nhàn Rỗi & Buồn Chán",
    stageIcon: "🧘",
    question: "Tần suất bạn trải qua hội chứng 'Ảo giác máy rung' (Phantom Vibration) và ám ảnh sợ bỏ lỡ thông tin (FOMO)?",
    scenario: "Chiếc điện thoại để trong túi quần hoặc trên mặt bàn làm việc...",
    scientificReference: "Rothberg et al. (Phantom Vibration Syndrome & Digital Hypervigilance)",
    options: [
      { text: "Thường xuyên giật thót tưởng máy rung hoặc có tin nhắn mới, rút máy ra kiểm tra liên tục.", score: 2 },
      { text: "Tôi hiếm khi hoặc không bao giờ có cảm giác ảo giác này; tâm trí hoàn toàn tự do và thư thái.", score: 0 },
      { text: "Luôn ở trong trạng thái cảnh giác cao độ; lo sợ mình chỉ cần buông máy 1 tiếng là sẽ bỏ lỡ tin nóng.", score: 3 },
      { text: "Thỉnh thoảng tưởng máy rung nhưng nhận ra ngay là do va chạm cơ thể bình thường và bỏ qua.", score: 1 },
    ],
  },

  // =========================================================================
  // CHẶNG 4: CHỨC NĂNG ĐIỀU HÀNH & TRÌ HOÃN (16-20)
  // Cơ sở khoa học: Barkley (BDEFS), WHO ASRS Part A (Item 2 & 4), Dr. Piers Steel
  // =========================================================================
  {
    id: 16,
    stageId: 4,
    stageName: "Điều Hành & Khởi Động",
    stageIcon: "⚡",
    question: "Rào cản khởi động (Activation Energy) của bạn lớn đến mức nào khi đứng trước một công việc phức tạp cần nhiều tư duy?",
    scenario: "Khi bạn cần bắt tay vào một bài luận, dự án mới hoặc một bản kế hoạch quan trọng...",
    scientificReference: "WHO ASRS Part A - Item 4 (Avoid or delay getting started on effortful tasks)",
    options: [
      { text: "Đắn đo suy nghĩ một lúc, chuẩn bị tài liệu rồi bắt đầu vào việc suôn sẻ sau 5-10 phút.", score: 1 },
      { text: "Chia nhỏ công việc thành các bước vi mô và bắt tay vào làm ngay không chút chần chừ.", score: 0 },
      { text: "Trì hoãn hàng giờ: dọn dẹp bàn, pha trà, lướt tin tức, kiếm đủ mọi lý do để chưa phải bắt đầu.", score: 2 },
      { text: "Tê liệt hoàn toàn (Task Paralysis): ngồi đờ đẫn ôm điện thoại suốt cả ngày trong nỗi lo âu tột độ.", score: 3 },
    ],
  },
  {
    id: 17,
    stageId: 4,
    stageName: "Điều Hành & Khởi Động",
    stageIcon: "⚡",
    question: "Khả năng sắp xếp trật tự và thiết lập thứ tự ưu tiên khi có nhiều việc cùng lúc dồn đến?",
    scenario: "Khi bạn có 4-5 đầu việc khác nhau cần giải quyết trong một ngày làm việc bận rộn...",
    scientificReference: "WHO ASRS Part A - Item 2 (Difficulty getting things in order when organizing tasks)",
    options: [
      { text: "Bối rối không biết bắt đầu từ đâu; việc gì cũng muốn làm một tí rồi bỏ dở giữa chừng.", score: 2 },
      { text: "Xác định rõ ràng việc nào quan trọng nhất, làm lần lượt từng việc theo thứ tự ưu tiên dứt khoát.", score: 0 },
      { text: "Đầu óc ngổn ngang như một mớ bòng bong; cuống cuồng chạy vòng quanh và cảm thấy hoàn toàn bị quá tải.", score: 3 },
      { text: "Có danh sách việc cần làm nhưng đôi khi bị đảo lộn thứ tự một chút khi có việc gấp phát sinh.", score: 1 },
    ],
  },
  {
    id: 18,
    stageId: 4,
    stageName: "Điều Hành & Khởi Động",
    stageIcon: "⚡",
    question: "Mức độ linh hoạt của não bộ khi bạn phải chuyển từ công việc này sang một công việc hoàn toàn khác biệt (Cognitive Shifting)?",
    scenario: "Khi vừa hoàn thành xong việc A và phải bắt đầu ngay việc B đòi hỏi cách tư duy khác...",
    scientificReference: "Derryberry & Reed (ACS Shifting Subscale - Cognitive Flexibility & Task Transition)",
    options: [
      { text: "Mất vài phút để não bộ làm quen với ngữ cảnh công việc mới trước khi vào guồng trôi chảy.", score: 1 },
      { text: "Chuyển đổi mượt mà; đóng lại hồ sơ cũ và hoàn toàn mở tâm trí cho công việc mới trong tĩnh tại.", score: 0 },
      { text: "Tâm trí vẫn bị mắc kẹt ở việc cũ; đầu óc lấn cấn khiến việc mới không thể tập trung làm nổi.", score: 2 },
      { text: "Rất khó khăn để thích ứng; mỗi lần đổi việc là một lần não bộ rơi vào tình trạng kiệt sức và bế tắc.", score: 3 },
    ],
  },
  {
    id: 19,
    stageId: 4,
    stageName: "Điều Hành & Khởi Động",
    stageIcon: "⚡",
    question: "Khả năng kiểm soát xung động trì hoãn và tâm lý 'nước đến chân mới nhảy' khi đối diện với Deadline?",
    scenario: "Khi mốc hạn chót (Deadline) của dự án còn khoảng 2-3 ngày nữa...",
    scientificReference: "Piers Steel (Temporal Motivation Theory) & Barkley (Impulse Inhibition Deficit)",
    options: [
      { text: "Luôn chờ đến đêm sát deadline mới cuống cuồng thức trắng đêm làm trong hoảng loạn và kiệt sức.", score: 2 },
      { text: "Luôn phân bổ tiến độ đều đặn mỗi ngày và hoàn thành trước hạn một cách thảnh thơi, chủ động.", score: 0 },
      { text: "Ngay cả khi deadline cận kề vẫn không thể tập trung; vừa lo sợ vừa tiếp tục lướt video trong tuyệt vọng.", score: 3 },
      { text: "Đôi khi có dồn việc một chút vào ngày cuối nhưng vẫn trong tầm kiểm soát an toàn và chất lượng tốt.", score: 1 },
    ],
  },
  {
    id: 20,
    stageId: 4,
    stageName: "Điều Hành & Khởi Động",
    stageIcon: "⚡",
    question: "Tần suất xảy ra hiện tượng đãng trí ngắn hạn và suy giảm trí nhớ làm việc (Working Memory Slips)?",
    scenario: "Vừa mở một tab trình duyệt mới hoặc vừa bước sang một phòng khác để lấy đồ...",
    scientificReference: "Broadbent et al. (Cognitive Failures Questionnaire - CFQ) & Baddeley (Working Memory)",
    options: [
      { text: "Thỉnh thoảng có thoáng quên nhưng chỉ cần dừng lại 3 giây hít thở là nhớ lại được ngay.", score: 1 },
      { text: "Trí nhớ làm việc sắc bén; tôi luôn nắm rõ mục đích của từng thao tác và hành động mình đang làm.", score: 0 },
      { text: "Rất hay đứng ngẩn tò te tự hỏi 'mình vừa định làm gì nhỉ?' sau khi chuyển đổi màn hình hoặc ứng dụng.", score: 2 },
      { text: "Xảy ra liên tục hàng ngày: quên đồ đạc, quên việc vừa định nói, não như bị mất trí nhớ tạm thời.", score: 3 },
    ],
  },

  // =========================================================================
  // CHẶNG 5: SƯƠNG MÙ NÃO & PHỤC HỒI THẦN KINH (21-25)
  // Cơ sở khoa học: Matthew Walker (Why We Sleep), Roy Baumeister, Dr. Anna Lembke
  // =========================================================================
  {
    id: 21,
    stageId: 5,
    stageName: "Sương Mù Não & Phục Hồi",
    stageIcon: "🌫️",
    question: "Mức độ sương mù não (Brain Fog) và độ tỉnh táo của thùy trán vào khoảng 9h - 10h sáng hàng ngày?",
    scenario: "Khi bạn bắt đầu bước vào guồng công việc quan trọng nhất trong ngày...",
    scientificReference: "Matthew Walker (Circadian Rhythm & Prefrontal Cortex Restoration)",
    options: [
      { text: "Đầu nặng như đeo chì, ngáp ngắn ngáp dài, cần 2-3 cốc cà phê đậm mới gượng ép làm được.", score: 2 },
      { text: "Đầu óc thanh thoát, sắc bén, tập trung cao độ và tràn đầy năng lượng tư duy sáng tạo.", score: 0 },
      { text: "Sương mù não dày đặc: người rệu rã, mắt cay xè, não đóng băng hoàn toàn và chỉ muốn nằm gục.", score: 3 },
      { text: "Hơi lờ đờ một chút lúc mới đến bàn, nhưng sau khi uống nước hoặc cà phê là tập trung rất tốt.", score: 1 },
    ],
  },
  {
    id: 22,
    stageId: 5,
    stageName: "Sương Mù Não & Phục Hồi",
    stageIcon: "🌫️",
    question: "Hành vi sử dụng màn hình điện thoại đêm muộn triệt tiêu sóng ngủ sâu (Melatonin Suppression)?",
    scenario: "Khoảng thời gian từ 23h00 trở đi khi bạn đã nằm lên giường tắt đèn...",
    scientificReference: "Matthew Walker (Why We Sleep - Ánh sáng xanh & Phá hủy giấc ngủ sóng chậm SWS)",
    options: [
      { text: "Nhắn tin hoặc kiểm tra tin tức nhẹ nhàng khoảng 15 phút rồi tắt máy đi ngủ đúng giờ.", score: 1 },
      { text: "Để điện thoại cách xa giường, nhắm mắt thả lỏng và chìm vào giấc ngủ sâu trong 15-20 phút.", score: 0 },
      { text: "Lướt mạng xã hội/video ngắn 30-60 phút, nhiều hôm thấy mỏi mắt cay xè mới chịu buông máy.", score: 2 },
      { text: "Lướt vô thức đến 1-2h sáng; máy nóng ran pin yếu, sợ đi ngủ vì sợ ngày mai lại phải đối mặt với công việc.", score: 3 },
    ],
  },
  {
    id: 23,
    stageId: 5,
    stageName: "Sương Mù Não & Phục Hồi",
    stageIcon: "🌫️",
    question: "Sự kiệt quệ năng lượng ý chí (Ego Depletion) và sự sụt giảm kiên nhẫn với người thân vào cuối ngày?",
    scenario: "Khi tan ca về nhà vào khoảng 18h - 20h tối gặp gỡ bố mẹ, người yêu hoặc con cái...",
    scientificReference: "Roy Baumeister (Ego Depletion Theory) & Neuro-emotional Regulation",
    options: [
      { text: "Rất dễ cáu bẳn, gắt gỏng với người thân xung quanh vì những chuyện vụn vặt không đâu.", score: 2 },
      { text: "Tôi luôn giữ được sự bình tĩnh, ấm áp, thấu cảm và hiện diện trọn vẹn bên gia đình.", score: 0 },
      { text: "Bùng nổ giận dữ: ai hỏi gì lúc đang cầm máy là cảm thấy cực kỳ bực bội, muốn đóng sầm cửa lại.", score: 3 },
      { text: "Người hơi mệt nhưng biết cách nghỉ ngơi thả lỏng để không xả cảm xúc tiêu cực lên người khác.", score: 1 },
    ],
  },
  {
    id: 24,
    stageId: 5,
    stageName: "Sương Mù Não & Phục Hồi",
    stageIcon: "🌫️",
    question: "Cảm giác 'bội thực thông tin' nhưng rỗng tuếch sau một ngày dài liên tục tiêu thụ nội dung số?",
    scenario: "Nhìn lại khoảng thời gian 2-3 tiếng bạn vừa dành ra để lướt điện thoại trong ngày...",
    scientificReference: "Sweller (Cognitive Load Theory) & Hội chứng Bội thực thông tin (Information Gluttony)",
    options: [
      { text: "Đôi khi có lướt giải trí nhưng vẫn nhận thức rõ giới hạn và dừng lại đúng lúc để làm việc khác.", score: 1 },
      { text: "Tôi chỉ tiêu thụ thông tin có chọn lọc cao, phục vụ trực tiếp cho công việc và sự phát triển bản thân.", score: 0 },
      { text: "Cảm thấy một ngày trôi qua quá nhanh trong vô nghĩa; lướt nhiều nhưng không đọng lại được gì trong đầu.", score: 2 },
      { text: "Trống rỗng và tội lỗi tột độ: người mệt lử, đầu nhức buốt, cảm giác như mình vừa đốt cháy sinh mệnh vô ích.", score: 3 },
    ],
  },
  {
    id: 25,
    stageId: 5,
    stageName: "Sương Mù Não & Phục Hồi",
    stageIcon: "🌫️",
    question: "Năng lực cảm nhận niềm vui đời thực trước những điều bình dị mà không cần kích thích dopamine số?",
    scenario: "Một buổi chiều ngắm hoàng hôn, đi dạo dưới bóng cây, hay một bữa cơm ấm cúng bên người thân...",
    scientificReference: "Dr. Anna Lembke (Stanford University - Dopamine Reset & Hedonic Tone)",
    options: [
      { text: "Thấy hơi nhạt nhẽo; tâm trí luôn thôi thúc phải tìm thứ gì giật gân, kích thích mạnh hơn mới thấy sướng.", score: 2 },
      { text: "Cảm nhận rất sâu sắc, thấy ấm áp, rung động và trân trọng từng khoảnh khắc giản đơn của đời sống.", score: 0 },
      { text: "Chai sạn cảm xúc hoàn toàn: cuộc đời ngoài đời thực như một bức tranh đen trắng nhạt toẹt không chút sức sống.", score: 3 },
      { text: "Vẫn thấy vui dù đôi lúc đầu óc có thoáng nghĩ về công việc hoặc thông báo trên mạng xã hội.", score: 1 },
    ],
  },
];

export interface DetailedResult {
  level: "balance" | "mild" | "severe";
  title: string;
  badge: string;
  color: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  archetype: {
    name: string;
    tagline: string;
    description: string;
    icon: string;
  };
  hiddenTaxes: string[];
  scientificAnalysis: string;
  kaizenAction: {
    title: string;
    description: string;
    wabiSabiQuote: string;
  };
  stageScores: {
    stage1: number;
    stage2: number;
    stage3: number;
    stage4: number;
    stage5: number;
  };
}

export function calculateDetailedResult(answers: number[]): DetailedResult {
  const total = answers.reduce((acc, curr) => acc + (curr >= 0 ? curr : 0), 0);
  const maxScore = 75;
  const percentage = Math.round((total / maxScore) * 100);

  // Tính điểm 5 chặng (mỗi chặng 5 câu, max 15 điểm)
  const s1 = answers.slice(0, 5).reduce((a, b) => a + (b >= 0 ? b : 0), 0);
  const s2 = answers.slice(5, 10).reduce((a, b) => a + (b >= 0 ? b : 0), 0);
  const s3 = answers.slice(10, 15).reduce((a, b) => a + (b >= 0 ? b : 0), 0);
  const s4 = answers.slice(15, 20).reduce((a, b) => a + (b >= 0 ? b : 0), 0);
  const s5 = answers.slice(20, 25).reduce((a, b) => a + (b >= 0 ? b : 0), 0);

  // Tìm Hệ Trạng Thái Tập Trung nổi trội nhất dựa trên chặng có điểm số cao nhất
  let archetype = {
    name: "Kẻ Đứt Gãy Chú Ý Sâu",
    tagline: "The Deep Work Dropout",
    description: "Thùy trán của bạn đã mất dần khả năng duy trì sự chú ý bền bỉ. Bạn chỉ tập trung được 3-5 phút là bồn chồn; khó có thể đọc trọn vẹn một cuốn sách hay làm việc khó mà không bỏ cuộc giữa chừng.",
    icon: "🥀",
  };

  const maxStageScore = Math.max(s1, s2, s3, s4, s5);
  if (maxStageScore === s2) {
    archetype = {
      name: "Kẻ Đa Nhiệm Phân Mảnh",
      tagline: "The Tab-Hopper & Attention Fragmenter",
      description: "Tâm trí bạn không thể ngồi yên với một việc duy nhất. Bạn mở hàng chục tab trình duyệt, nhảy qua lại liên tục. Bạn lầm tưởng mình làm được nhiều việc cùng lúc nhưng thực chất não bạn đang bị băm nhỏ bởi chi phí tàn dư chú ý (Attention Residue).",
      icon: "⚡",
    };
  } else if (maxStageScore === s3) {
    archetype = {
      name: "Tâm Trí Trôi Dạt & Bồn Chồn Số",
      tagline: "The Restless Mind Wanderer",
      description: "Bạn mắc hội chứng không thể chịu đựng sự tĩnh lặng tự nhiên (Boredom Intolerance). Chỉ 30 giây rảnh rỗi cũng khiến bạn bứt rứt phải rút điện thoại ra quẹt. Tâm trí bạn luôn trôi dạt vô định và phải liên tục tìm kiếm dopamine rẻ tiền để khỏa lấp khoảng trống.",
      icon: "🌀",
    };
  } else if (maxStageScore === s4) {
    archetype = {
      name: "Người Bị Tê Liệt Khởi Động",
      tagline: "The Task Paralysis & Initiation Staller",
      description: "Chức năng điều hành (Executive Function) của bạn đang bị nghẽn ở khâu nạp năng lượng khởi động. Cứ gặp việc khó là bạn tìm cớ dọn bàn, lướt tin tức, dồn ứ mọi thứ đến sát deadline mới cuống cuồng làm trong kiệt sức và tự sỉ vả bản thân.",
      icon: "🧱",
    };
  } else if (maxStageScore === s5) {
    archetype = {
      name: "Nạn Nhân Của Sương Mù Não",
      tagline: "The Brain-Fogged & Neuro-Exhausted",
      description: "Thùy trán của bạn đang ở trạng thái kiệt quệ thần kinh và thiếu hụt dopamine thứ phát do ánh sáng xanh đêm muộn và bão thông báo. Đầu óc bạn nặng như đeo chì, đãng trí lặp lại và dễ bùng nổ cáu gắt vô cớ với những người thân yêu nhất.",
      icon: "🌫️",
    };
  }

  if (total <= 20) {
    return {
      level: "balance",
      title: "Vùng Tỉnh Thức & Làm Chủ Sự Chú Ý",
      badge: "Mức độ: Kiểm Soát Xuất Sắc (Xanh Lá)",
      color: "emerald",
      totalScore: total,
      maxScore,
      percentage,
      archetype,
      hiddenTaxes: [
        "Bạn gần như không phải trả khoản thuế vô hình nào về sự chú ý.",
        "Khả năng làm việc sâu (Deep Work) và năng suất tư duy của bạn ở mức vượt trội.",
        "Mối quan hệ gia đình và sự bình yên nội tâm được bảo toàn nguyên vẹn.",
      ],
      scientificAnalysis: "Hệ thống chú ý và chức năng điều hành thùy trán của bạn đang ở trạng thái cân bằng nội môi tuyệt vời (Homeostasis). Bạn không bị phụ thuộc vào các kích thích dopamine ngắn để duy trì động lực hành động.",
      kaizenAction: {
        title: "Bảo vệ 60 phút buổi sáng không màn hình",
        description: "Duy trì phong độ hiện tại bằng việc tiếp tục giữ 60 phút đầu ngày hoàn toàn không điện thoại: uống một cốc nước ấm, thở sâu và chỉ làm việc quan trọng nhất.",
        wabiSabiQuote: "Sự bình yên không phải là không có cám dỗ, mà là khi cám dỗ đi qua, tâm bạn vẫn phẳng lặng như mặt nước hồ thu.",
      },
      stageScores: { stage1: s1, stage2: s2, stage3: s3, stage4: s4, stage5: s5 },
    };
  } else if (total <= 48) {
    return {
      level: "mild",
      title: "Vùng Phân Mảnh & Chớm Quá Tải Nhận Thức",
      badge: "Mức độ: Cảnh Báo Vàng (Chớm Lệch Chú Ý)",
      color: "amber",
      totalScore: total,
      maxScore,
      percentage,
      archetype,
      hiddenTaxes: [
        "Khoản thuế 1: Chi phí tàn dư chú ý — mất 15-20 phút để tập trung lại sau mỗi lần nhảy tab.",
        "Khoản thuế 2: Sự kiệt sức và bực bội vô cớ với người thân vào buổi tối khi hết năng lượng ý chí.",
        "Khoản thuế 3: Các dự án lớn bị trì hoãn nhiều tuần vì rào cản năng lượng khởi động quá nặng.",
      ],
      scientificAnalysis: "Theo Dr. Gloria Mark (UC Irvine) và Dr. Anna Lembke (Stanford), bộ não của bạn đang bắt đầu rơi vào vòng lặp phân mảnh chú ý và kích thích ngắn. Đây là lý do bạn thường xuyên thấy ngày trôi qua nhanh nhưng không làm được việc gì ra hồn.",
      kaizenAction: {
        title: "Quy tắc 2 mét sạc pin & Chặn xao nhãng đơn nhiệm 45 phút",
        description: "Tối nay cắm sạc điện thoại cách giường ngủ đúng 2 mét. Ngày mai khi làm việc, úp điện thoại xuống và cài đặt đồng hồ tập trung 45 phút duy nhất cho một tác vụ quan trọng.",
        wabiSabiQuote: "Đừng dùng búa tạ để đập vỡ thói quen xao nhãng; hãy dùng giọt nước Kaizen 1% để xói mòn nó êm ả mỗi ngày.",
      },
      stageScores: { stage1: s1, stage2: s2, stage3: s3, stage4: s4, stage5: s5 },
    };
  } else {
    return {
      level: "severe",
      title: "Báo Động Đỏ: Khủng Hoảng Tập Trung & Sương Mù Não",
      badge: "Mức độ: Báo Động Đỏ (Kiệt Quệ Sinh Học)",
      color: "rose",
      totalScore: total,
      maxScore,
      percentage,
      archetype,
      hiddenTaxes: [
        "Khoản thuế 1: Tê liệt chức năng làm việc sâu — không thể tư duy liền mạch quá 5 phút.",
        "Khoản thuế 2: Chai sạn cảm xúc — không còn rung động trước những niềm vui bình dị đời thực.",
        "Khoản thuế 3: Rạn nứt âm thầm với gia đình vì sự hiện diện nửa vời và những cơn cáu gắt vô cớ.",
        "Khoản thuế 4: Mắc kẹt trong 'Bất lực tập nhiễm' — tự trách mình yếu đuối và buông xuôi ước mơ.",
      ],
      scientificAnalysis: "Thùy trán của bạn đang ở trạng thái thiếu hụt dopamine thứ phát (Secondary Dopamine Deficit State) và kiệt quệ nhận thức nghiêm trọng. Bạn KHÔNG HỀ LƯỜI hay kém cỏi! Bộ não sinh học của bạn chỉ đang gào thét vì bị thuật toán công nghiệp vắt kiệt mà thôi.",
      kaizenAction: {
        title: "Giao thức Tái sinh Thùy trán: Tha thứ hoàn toàn & Hạ liều vi mô",
        description: "Tuyệt đối không cắt đột ngột (Cold-turkey) gây sốc thần kinh. Hãy tha thứ cho bản thân. Hôm nay chỉ làm 2 việc: Tắt màn hình trước khi ngủ 30 phút và tập đứng nhìn không gian xung quanh 60 giây khi vào thang máy.",
        wabiSabiQuote: "Vết rạn nứt là nơi ánh sáng đi vào. Người Nhật dùng vàng ròng để hàn lại gốm vỡ Kintsugi, và bạn cũng có thể vá lại sự tập trung của mình từng chút một.",
      },
      stageScores: { stage1: s1, stage2: s2, stage3: s3, stage4: s4, stage5: s5 },
    };
  }
}
