import type { ChineseTerm } from "@/features/lesson/types";

export const CHINESE_VOCABULARY: Record<string, ChineseTerm> = {
  "ni-hao": {
    id: "ni-hao",
    hanzi: "你好",
    pinyin: "nǐ hǎo",
    meaning: "Xin chào",
    speechText: "你好",
  },
  "xie-xie": {
    id: "xie-xie",
    hanzi: "谢谢",
    pinyin: "xiè xie",
    meaning: "Cảm ơn",
    speechText: "谢谢",
  },
  "zai-jian": {
    id: "zai-jian",
    hanzi: "再见",
    pinyin: "zài jiàn",
    meaning: "Tạm biệt",
    speechText: "再见",
  },
  "wo": {
    id: "wo",
    hanzi: "我",
    pinyin: "wǒ",
    meaning: "Tôi / Mình",
    speechText: "我",
  },
  "ni": {
    id: "ni",
    hanzi: "你",
    pinyin: "nǐ",
    meaning: "Bạn / Cậu",
    speechText: "你",
  },
  "ta-he": {
    id: "ta-he",
    hanzi: "他",
    pinyin: "tā",
    meaning: "Anh ấy / Cậu ấy",
    speechText: "他",
  },
  "ta-she": {
    id: "ta-she",
    hanzi: "她",
    pinyin: "tā",
    meaning: "Cô ấy / Chị ấy",
    speechText: "她",
  },
  "shi": {
    id: "shi",
    hanzi: "是",
    pinyin: "shì",
    meaning: "Là / Đúng",
    speechText: "是",
  },
  "bu-shi": {
    id: "bu-shi",
    hanzi: "不是",
    pinyin: "bú shì",
    meaning: "Không phải",
    speechText: "不是",
  },
  "jiao": {
    id: "jiao",
    hanzi: "叫",
    pinyin: "jiào",
    meaning: "Tên là / Gọi là",
    speechText: "叫",
  },
  "zhong-guo": {
    id: "zhong-guo",
    hanzi: "中国",
    pinyin: "zhōng guó",
    meaning: "Trung Quốc",
    speechText: "中国",
  },
  "yue-nan": {
    id: "yue-nan",
    hanzi: "越南",
    pinyin: "yuè nán",
    meaning: "Việt Nam",
    speechText: "越南",
  },
  "ren": {
    id: "ren",
    hanzi: "人",
    pinyin: "rén",
    meaning: "Người",
    speechText: "人",
  },
  "jia": {
    id: "jia",
    hanzi: "家",
    pinyin: "jiā",
    meaning: "Gia đình / Nhà",
    speechText: "家",
  },
  "ba-ba": {
    id: "ba-ba",
    hanzi: "爸爸",
    pinyin: "bà ba",
    meaning: "Bố / Cha",
    speechText: "爸爸",
  },
  "ma-ma": {
    id: "ma-ma",
    hanzi: "妈妈",
    pinyin: "mā ma",
    meaning: "Mẹ",
    speechText: "妈妈",
  },
  "chi": {
    id: "chi",
    hanzi: "吃",
    pinyin: "chī",
    meaning: "Ăn",
    speechText: "吃",
  },
  "he": {
    id: "he",
    hanzi: "喝",
    pinyin: "hē",
    meaning: "Uống",
    speechText: "喝",
  },
  "shui": {
    id: "shui",
    hanzi: "水",
    pinyin: "shuǐ",
    meaning: "Nước",
    speechText: "水",
  },
  "fan": {
    id: "fan",
    hanzi: "饭",
    pinyin: "fàn",
    meaning: "Cơm / Bữa ăn",
    speechText: "饭",
  },
  "jin-tian": {
    id: "jin-tian",
    hanzi: "今天",
    pinyin: "jīn tiān",
    meaning: "Hôm nay",
    speechText: "今天",
  },
  "ming-tian": {
    id: "ming-tian",
    hanzi: "明天",
    pinyin: "míng tiān",
    meaning: "Ngày mai",
    speechText: "明天",
  },
  "xian-zai": {
    id: "xian-zai",
    hanzi: "现在",
    pinyin: "xiàn zài",
    meaning: "Bây giờ",
    speechText: "现在",
  },
};

export function getChineseTerm(id: string): ChineseTerm | undefined {
  return CHINESE_VOCABULARY[id];
}

export function getAllChineseTerms(): ChineseTerm[] {
  return Object.values(CHINESE_VOCABULARY);
}
