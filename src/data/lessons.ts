import type { LearningLanguage } from "./curriculum";
import type { Lesson } from "@/features/lesson/types";

export const lessons: Record<string, Lesson> = {
  "english-survival-1": {
    id: "english-survival-1",
    language: "english",
    stageId: "survival",
    title: "Chào hỏi cơ bản",
    description: "Làm quen với các câu chào và cảm ơn thông dụng nhất trong tiếng Anh.",
    topicsPracticed: ["Hello · Xin chào", "Thank you · Cảm ơn", "Goodbye · Tạm biệt"],
    exercises: [
      {
        id: "en-1-mc",
        type: "multiple_choice",
        prompt: "Từ “Hello” trong tiếng Anh có nghĩa là gì?",
        options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
        correctAnswer: "Xin chào",
        explanation: "“Hello” là câu chào phổ biến và tự nhiên nhất trong tiếng Anh giao tiếp hằng ngày.",
      },
      {
        id: "en-2-lis",
        type: "listening",
        prompt: "Nghe phát âm và chọn cụm từ chính xác:",
        speechText: "Thank you",
        speechLang: "en-US",
        fallbackTextAlternative: "Gợi ý: Cụm từ lịch sự dùng khi ai đó giúp đỡ bạn.",
        options: ["Thank you", "Good morning", "Goodbye", "Please"],
        correctAnswer: "Thank you",
        explanation: "“Thank you” mang nghĩa là “Cảm ơn bạn”.",
      },
      {
        id: "en-3-match",
        type: "matching",
        prompt: "Ghép các cặp từ tiếng Anh với nghĩa tiếng Việt tương ứng:",
        pairs: [
          { id: "en-p1", left: "Hello", right: "Xin chào" },
          { id: "en-p2", left: "Thank you", right: "Cảm ơn" },
          { id: "en-p3", left: "Goodbye", right: "Tạm biệt" },
        ],
        explanation: "Ba câu mở đầu cơ bản: Hello (Xin chào), Thank you (Cảm ơn), Goodbye (Tạm biệt).",
      },
      {
        id: "en-4-mc",
        type: "multiple_choice",
        prompt: "Khi muốn nói lời “Tạm biệt” trong tiếng Anh, bạn dùng từ nào?",
        options: ["Goodbye", "Hello", "Thanks", "Sorry"],
        correctAnswer: "Goodbye",
        explanation: "“Goodbye” (hoặc cách gọi ngắn “Bye”) có nghĩa là “Tạm biệt”.",
      },
      {
        id: "en-5-input",
        type: "text_input",
        prompt: "Nhập từ tiếng Anh có nghĩa là “Cảm ơn”:",
        placeholder: "Ví dụ: Thank you",
        acceptedAnswers: ["thank you", "thanks", "thank you!"],
        displayAnswer: "Thank you (hoặc Thanks)",
        explanation: "Bạn có thể viết đầy đủ “Thank you” hoặc thân mật hơn là “Thanks”.",
      },
      {
        id: "en-6-mc",
        type: "multiple_choice",
        prompt: "Cụm từ “Good morning” được dùng để chào vào thời điểm nào?",
        options: ["Buổi sáng", "Buổi tối", "Buổi chiều", "Trước khi ngủ"],
        correctAnswer: "Buổi sáng",
        explanation: "“Good morning” nghĩa là “Chào buổi sáng”.",
      },
    ],
  },

  "chinese-survival-1": {
    id: "chinese-survival-1",
    language: "chinese",
    stageId: "survival",
    title: "Lời chào đầu tiên",
    description: "Nhận biết chữ Hán, phát âm pinyin và những câu chào hỏi nền tảng.",
    topicsPracticed: ["你好 · Xin chào", "谢谢 · Cảm ơn", "再见 · Tạm biệt"],
    exercises: [
      {
        id: "zh-1-mc",
        type: "multiple_choice",
        prompt: "Từ “你好” (nǐ hǎo) có nghĩa là gì?",
        options: ["Xin chào", "Cảm ơn", "Tạm biệt", "Không có chi"],
        correctAnswer: "Xin chào",
        explanation: "“你好” (nǐ hǎo) là lời chào thông dụng và thân thiện nhất trong tiếng Trung.",
      },
      {
        id: "zh-2-lis",
        type: "listening",
        prompt: "Nghe phát âm và chọn chữ Hán tương ứng:",
        speechText: "谢谢",
        speechLang: "zh-CN",
        fallbackTextAlternative: "Gợi ý: Lời cảm ơn trong tiếng Trung (phiên âm: xiè xie).",
        options: ["谢谢 (xiè xie)", "你好 (nǐ hǎo)", "再见 (zài jiàn)", "对不起 (duì bu qǐ)"],
        correctAnswer: "谢谢 (xiè xie)",
        explanation: "“谢谢” (xiè xie) có nghĩa là “Cảm ơn”.",
      },
      {
        id: "zh-3-match",
        type: "matching",
        prompt: "Ghép chữ Hán với nghĩa tiếng Việt tương ứng:",
        pairs: [
          { id: "zh-p1", left: "你好", right: "Xin chào" },
          { id: "zh-p2", left: "谢谢", right: "Cảm ơn" },
          { id: "zh-p3", left: "再见", right: "Tạm biệt" },
        ],
        explanation: "Các chữ Hán cơ bản: 你好 (Xin chào), 谢谢 (Cảm ơn), 再见 (Tạm biệt).",
      },
      {
        id: "zh-4-mc",
        type: "multiple_choice",
        prompt: "Chữ Hán nào dưới đây có nghĩa là “Tạm biệt”?",
        options: ["再见 (zài jiàn)", "你好 (nǐ hǎo)", "谢谢 (xiè xie)", "好 (hǎo)"],
        correctAnswer: "再见 (zài jiàn)",
        explanation: "“再见” (zài jiàn) mang ý nghĩa “Hẹn gặp lại / Tạm biệt”.",
      },
      {
        id: "zh-5-input",
        type: "text_input",
        prompt: "Nhập pinyin của chữ “你好” (không cần nhập dấu thanh điệu):",
        placeholder: "Ví dụ: ni hao",
        acceptedAnswers: ["ni hao", "nihao", "nǐ hǎo", "nǐhǎo"],
        displayAnswer: "ni hao (hoặc nǐ hǎo)",
        explanation: "“你好” có pinyin là “nǐ hǎo” (gồm chữ ni và hao).",
      },
      {
        id: "zh-6-mc",
        type: "multiple_choice",
        prompt: "Phiên âm pinyin của chữ “谢谢” là gì?",
        options: ["xiè xie", "nǐ hǎo", "zài jiàn", "bù kè qi"],
        correctAnswer: "xiè xie",
        explanation: "“谢谢” phiên âm chuẩn là “xiè xie”.",
      },
    ],
  },
};

export function getLessonById(id: string): Lesson | null {
  return lessons[id] ?? null;
}

export function getStarterLessonForLanguage(language: LearningLanguage): string {
  return language === "chinese" ? "chinese-survival-1" : "english-survival-1";
}
