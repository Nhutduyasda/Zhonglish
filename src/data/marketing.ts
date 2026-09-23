export const benefits = [
  { icon: "◎", title: "Bắt đầu từ số 0", detail: "Không cần biết A1 hay HSK." },
  { icon: "↗", title: "3–5 phút mỗi bài", detail: "Một bước nhỏ mỗi ngày." },
  { icon: "◌", title: "Học để dùng", detail: "Từ và câu trong đời sống." },
  { icon: "✦", title: "Phản hồi ngay", detail: "Hiểu câu trả lời của mình." },
  { icon: "✳", title: "Thấy mình tiến bộ", detail: "Từng bài học đều có ý nghĩa." },
] as const;

export const steps = [
  { number: "01", title: "Chọn ngôn ngữ", description: "English hay 中文? Bắt đầu với điều bạn cần hôm nay." },
  { number: "02", title: "Học một chút", description: "Mỗi bài tập trung vào một điều nhỏ, dễ hoàn thành." },
  { number: "03", title: "Đi tiếp mỗi ngày", description: "Nhìn lại những gì đã học và biết bước tiếp theo." },
] as const;

export const methods = [
  { glyph: "👀", title: "Nhìn", description: "Nhận diện từ và ý nghĩa trong ngữ cảnh." },
  { glyph: "🎧", title: "Nghe", description: "Làm quen với âm thanh trước khi đi sâu." },
  { glyph: "🗣", title: "Nói", description: "Luyện câu ngắn, dùng được trong đời sống." },
  { glyph: "✍", title: "Nhớ", description: "Ôn lại vừa đủ để kiến thức ở lại." },
] as const;

export const faqs = [
  { question: "Tôi chưa biết gì có học được không?", answer: "Có. Zhonglish được thiết kế để bắt đầu từ những từ và câu đầu tiên, với hướng dẫn bằng tiếng Việt." },
  { question: "Tôi nên học English hay Chinese trước?", answer: "Chọn ngôn ngữ phù hợp mục tiêu hiện tại. Bạn có thể đổi khi muốn học ngôn ngữ còn lại." },
  { question: "Mỗi ngày cần học bao lâu?", answer: "Mỗi bài học hướng tới khoảng 3–5 phút. Bạn có thể học thêm khi có thời gian." },
  { question: "Tôi có cần biết HSK hoặc CEFR không?", answer: "Không. Bạn sẽ được hướng dẫn bằng những bước dễ hiểu trước khi cần đến tên gọi các cấp độ." },
  { question: "Zhonglish có học phát âm không?", answer: "Nghe và nói nằm trong định hướng học tập. Tính năng chấm phát âm nâng cao sẽ được phát triển ở phase sau." },
  { question: "Zhonglish có miễn phí không?", answer: "Mô hình sử dụng chính thức sẽ được công bố sau." },
] as const;
