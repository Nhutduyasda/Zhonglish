export type LearningLanguage = "english" | "chinese";
export type CourseStage = { id: string; title: string; description: string; topics: readonly string[] };
export type Course = { name: string; greeting: string; pronunciation?: string; translation: string; stages: readonly CourseStage[] };

export const courses: Record<LearningLanguage, Course> = {
  english: { name: "Tiếng Anh", greeting: "Hello!", translation: "Xin chào", stages: [
    { id: "survival", title: "Bắt đầu trò chuyện", description: "Những câu đầu tiên bạn có thể dùng ngay.", topics: ["Chào hỏi", "Tên của tôi", "Cảm ơn", "Con số và đồ vật"] },
    { id: "me", title: "Giới thiệu bản thân", description: "Kể một chút về bạn và người thân.", topics: ["Quê quán", "Công việc", "Gia đình", "Tuổi tác"] },
    { id: "daily", title: "Một ngày thường", description: "Nói về những điều gần gũi hằng ngày.", topics: ["Đồ ăn", "Thời gian", "Thói quen", "Địa điểm"] },
    { id: "practical", title: "Ra ngoài và khám phá", description: "Giao tiếp trong các tình huống thực tế.", topics: ["Mua sắm", "Hỏi đường", "Gọi món", "Du lịch"] },
  ] },
  chinese: { name: "Tiếng Trung", greeting: "你好", pronunciation: "nǐ hǎo", translation: "Xin chào", stages: [
    { id: "survival", title: "Lời chào đầu tiên", description: "Làm quen với âm đọc và những câu đơn giản.", topics: ["你好 · Xin chào", "谢谢 · Cảm ơn", "再见 · Tạm biệt", "Âm đọc và pinyin"] },
    { id: "me", title: "Nói về mình", description: "Giới thiệu bản thân từng bước một.", topics: ["我 · Tôi", "你 · Bạn", "Tên của tôi", "Quốc tịch và con số"] },
    { id: "daily", title: "Cuộc sống thường ngày", description: "Nhận ra các từ thường gặp quanh bạn.", topics: ["Đồ ăn", "Gia đình", "Thời gian", "Câu hỏi thường dùng"] },
    { id: "practical", title: "Giao tiếp thực tế", description: "Chuẩn bị cho những cuộc trò chuyện ngoài đời.", topics: ["Mua sắm", "Nhà hàng", "Du lịch", "Hỏi đường"] },
  ] },
};
