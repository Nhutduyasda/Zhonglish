import { courses, type LearningLanguage } from "./curriculum";
import type { Lesson } from "@/features/lesson/types";

export const lessons: Record<string, Lesson> = {
  "english-survival-1": {
    id: "english-survival-1",
    language: "english",
    stageId: "survival",
    order: 1,
    estimatedMinutes: 5,
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

  "english-me-1": {
    id: "english-me-1",
    language: "english",
    stageId: "me",
    order: 2,
    estimatedMinutes: 5,
    title: "Giới thiệu bản thân",
    description: "Học cách nói tên, quê quán và giới thiệu đơn giản về mình.",
    topicsPracticed: ["My name is... · Tên tôi là...", "I am from... · Đến từ...", "Family · Gia đình"],
    exercises: [
      {
        id: "en2-1-mc",
        type: "multiple_choice",
        prompt: "Cụm từ “My name is Linh” có nghĩa là gì?",
        options: ["Tên của tôi là Linh", "Tôi sống ở Linh", "Tôi quen Linh", "Chào bạn Linh"],
        correctAnswer: "Tên của tôi là Linh",
        explanation: "“My name is...” là mẫu câu chuẩn mực nhất để giới thiệu tên của mình.",
      },
      {
        id: "en2-2-lis",
        type: "listening",
        prompt: "Nghe phát âm và chọn câu giới thiệu bạn nghe thấy:",
        speechText: "I am from Vietnam",
        speechLang: "en-US",
        fallbackTextAlternative: "Gợi ý: Câu nói về quê hương Việt Nam.",
        options: ["I am from Vietnam", "I live in Vietnam", "I love Vietnam", "I visit Vietnam"],
        correctAnswer: "I am from Vietnam",
        explanation: "“I am from Vietnam” có nghĩa là “Tôi đến từ Việt Nam”.",
      },
      {
        id: "en2-3-match",
        type: "matching",
        prompt: "Ghép các từ tiếng Anh với nghĩa tiếng Việt tương ứng:",
        pairs: [
          { id: "en2-p1", left: "Name", right: "Tên" },
          { id: "en2-p2", left: "From", right: "Đến từ" },
          { id: "en2-p3", left: "Family", right: "Gia đình" },
        ],
        explanation: "Các từ vựng cơ bản khi bắt đầu giới thiệu về bản thân.",
      },
      {
        id: "en2-4-mc",
        type: "multiple_choice",
        prompt: "Từ nào dưới đây có nghĩa là “Gia đình” trong tiếng Anh?",
        options: ["Family", "Friend", "Teacher", "House"],
        correctAnswer: "Family",
        explanation: "“Family” nghĩa là “Gia đình”.",
      },
      {
        id: "en2-5-input",
        type: "text_input",
        prompt: "Nhập từ tiếng Anh có nghĩa là “Tên” (danh từ):",
        placeholder: "Ví dụ: Name",
        acceptedAnswers: ["name", "my name"],
        displayAnswer: "Name",
        explanation: "“Name” nghĩa là họ tên / tên gọi.",
      },
      {
        id: "en2-6-mc",
        type: "multiple_choice",
        prompt: "Để hỏi tên người khác một cách lịch sự, bạn dùng câu nào?",
        options: ["What is your name?", "Where are you?", "How are you?", "Who is that?"],
        correctAnswer: "What is your name?",
        explanation: "“What is your name?” nghĩa là “Tên bạn là gì?”."
      },
    ],
  },

  "chinese-survival-1": {
    id: "chinese-survival-1",
    language: "chinese",
    stageId: "survival",
    order: 1,
    estimatedMinutes: 5,
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

  "chinese-me-1": {
    id: "chinese-me-1",
    language: "chinese",
    stageId: "me",
    order: 2,
    estimatedMinutes: 5,
    title: "Nói về mình",
    description: "Làm quen với đại từ xưng hô và cách giới thiệu tên bằng tiếng Trung.",
    topicsPracticed: ["我 · Tôi", "你 · Bạn", "我叫... · Tên tôi là..."],
    exercises: [
      {
        id: "zh2-1-mc",
        type: "multiple_choice",
        prompt: "Chữ Hán “我” (wǒ) có nghĩa là gì?",
        options: ["Tôi / Mình", "Bạn / Cậu", "Anh ấy", "Chúng tôi"],
        correctAnswer: "Tôi / Mình",
        explanation: "“我” (wǒ) là đại từ nhân xưng ngôi thứ nhất: Tôi, mình, bản thân.",
      },
      {
        id: "zh2-2-lis",
        type: "listening",
        prompt: "Nghe phát âm và chọn cụm từ bạn nghe thấy:",
        speechText: "我叫",
        speechLang: "zh-CN",
        fallbackTextAlternative: "Gợi ý: Cụm từ nói về tên gọi (phiên âm: wǒ jiào).",
        options: ["我叫 (wǒ jiào)", "你好 (nǐ hǎo)", "再见 (zài jiàn)", "谢谢 (xiè xie)"],
        correctAnswer: "我叫 (wǒ jiào)",
        explanation: "“我叫...” (wǒ jiào...) có nghĩa là “Tôi tên là / Tôi gọi là...”.",
      },
      {
        id: "zh2-3-match",
        type: "matching",
        prompt: "Ghép chữ Hán với nghĩa tiếng Việt tương ứng:",
        pairs: [
          { id: "zh2-p1", left: "我", right: "Tôi" },
          { id: "zh2-p2", left: "你", right: "Bạn" },
          { id: "zh2-p3", left: "叫", right: "Tên là / Gọi là" },
        ],
        explanation: "Các đại từ và động từ cơ bản: 我 (Tôi), 你 (Bạn), 叫 (Tên là).",
      },
      {
        id: "zh2-4-mc",
        type: "multiple_choice",
        prompt: "Chữ Hán nào dưới đây có nghĩa là “Bạn / Cậu” (ngôi thứ 2)?",
        options: ["你 (nǐ)", "我 (wǒ)", "他 (tā)", "好 (hǎo)"],
        correctAnswer: "你 (nǐ)",
        explanation: "“你” (nǐ) là đại từ ngôi thứ hai: Bạn, anh, chị.",
      },
      {
        id: "zh2-5-input",
        type: "text_input",
        prompt: "Nhập pinyin của chữ “我” (không cần nhập dấu thanh điệu):",
        placeholder: "Ví dụ: wo",
        acceptedAnswers: ["wo", "wǒ"],
        displayAnswer: "wo (wǒ)",
        explanation: "“我” có pinyin là “wǒ” (thanh 3).",
      },
      {
        id: "zh2-6-mc",
        type: "multiple_choice",
        prompt: "Khi ai đó nói “我叫 An”, câu này mang ý nghĩa gì?",
        options: ["Tôi tên là An", "Bạn tên là An", "Chào bạn An", "An là bạn tôi"],
        correctAnswer: "Tôi tên là An",
        explanation: "“我叫 An” dịch sang tiếng Việt là “Tôi tên là An”."
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

export function getLessonsForLanguage(language: LearningLanguage): Lesson[] {
  return Object.values(lessons)
    .filter((l) => l.language === language)
    .sort((a, b) => a.order - b.order);
}

export function getLessonsForStage(language: LearningLanguage, stageId: string): Lesson[] {
  return getLessonsForLanguage(language).filter((l) => l.stageId === stageId);
}

export function getNextLessonForUser(
  language: LearningLanguage,
  completedLessonIds: string[],
): Lesson | null {
  const languageLessons = getLessonsForLanguage(language);
  for (const lesson of languageLessons) {
    if (!completedLessonIds.includes(lesson.id)) {
      return lesson;
    }
  }
  return null;
}

export function getStageStatus(
  language: LearningLanguage,
  stageId: string,
  completedLessonIds: string[],
): "completed" | "ready" | "upcoming" {
  const stageLessons = getLessonsForStage(language, stageId);
  const isAllCompleted =
    stageLessons.length > 0 &&
    stageLessons.every((l) => completedLessonIds.includes(l.id));

  if (isAllCompleted) {
    return "completed";
  }

  const stages = courses[language]?.stages ?? [];
  const stageIndex = stages.findIndex((s) => s.id === stageId);

  // If first stage, or all previous stages are fully completed
  const allPreviousCompleted =
    stageIndex <= 0 ||
    stages.slice(0, stageIndex).every((prevStage) => {
      const prevLessons = getLessonsForStage(language, prevStage.id);
      return (
        prevLessons.length > 0 &&
        prevLessons.every((l) => completedLessonIds.includes(l.id))
      );
    });

  if (allPreviousCompleted && stageLessons.length > 0) {
    return "ready";
  }

  return "upcoming";
}

