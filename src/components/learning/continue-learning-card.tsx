import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, CheckCircle2, RotateCcw } from "lucide-react";
import type { Course, LearningLanguage } from "@/data/curriculum";
import type { Lesson } from "@/features/lesson/types";
import { getStarterLessonForLanguage } from "@/data/lessons";

type ContinueLearningCardProps = {
  course: Course;
  learningLanguage: LearningLanguage;
  nextLesson: Lesson | null;
  hasAnyCompletion: boolean;
};

export function ContinueLearningCard({
  course,
  learningLanguage,
  nextLesson,
  hasAnyCompletion,
}: ContinueLearningCardProps) {
  const starterLessonId = getStarterLessonForLanguage(learningLanguage);

  if (!nextLesson) {
    // All available content completed
    return (
      <section
        className={`continue-card continue-card-${learningLanguage}`}
        aria-labelledby="continue-learning-title"
      >
        <div className="continue-card-content">
          <div className="continue-card-badge">
            <CheckCircle2 size={15} aria-hidden="true" />
            <span>XUẤT SẮC</span>
          </div>

          <div className="continue-card-header">
            <h2 id="continue-learning-title" className="continue-card-title">
              Bạn đã hoàn thành tất cả bài học hiện có 🎉
            </h2>
            <p className="continue-card-description">
              Bạn đã hoàn thành trọn vẹn các bài học trong giai đoạn này. Các bài học nâng cao tiếp theo đang được chuẩn bị!
            </p>
          </div>

          <div className="continue-card-actions">
            <Link
              href={`/app/lesson/${starterLessonId}`}
              className="continue-card-cta"
              aria-label="Ôn tập lại từ bài học đầu tiên"
            >
              <RotateCcw size={17} aria-hidden="true" />
              <span>Ôn tập lại từ đầu</span>
            </Link>
          </div>
        </div>

        <div className="continue-card-graphic" aria-hidden="true">
          <div className="graphic-greeting-bubble">
            <span className="graphic-greeting-word">{course.greeting}</span>
            <span className="graphic-greeting-translation">
              Hoàn thành lộ trình
            </span>
          </div>
        </div>
      </section>
    );
  }

  const topicPreview = nextLesson.topicsPracticed[0] ?? "";
  const ctaLabel = hasAnyCompletion ? "Tiếp tục học" : "Bắt đầu bài đầu tiên";

  return (
    <section
      className={`continue-card continue-card-${learningLanguage}`}
      aria-labelledby="continue-learning-title"
    >
      <div className="continue-card-content">
        <div className="continue-card-badge">
          <Sparkles size={15} aria-hidden="true" />
          <span>BÀI HỌC TIẾP THEO</span>
        </div>

        <div className="continue-card-header">
          <h2 id="continue-learning-title" className="continue-card-title">
            {nextLesson.title}
          </h2>
          <p className="continue-card-description">
            {nextLesson.description}
          </p>
        </div>

        <div className="continue-card-topic-preview">
          <span className="topic-preview-label">Chủ đề:</span>
          <span className="topic-preview-pill">
            <BookOpen size={14} aria-hidden="true" />
            {topicPreview}
          </span>
        </div>

        <div className="continue-card-actions">
          <Link
            href={`/app/lesson/${nextLesson.id}`}
            className="continue-card-cta"
            aria-label={`${ctaLabel}: ${nextLesson.title}`}
          >
            <span>{ctaLabel}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <span className="continue-card-hint">
            Khoảng {nextLesson.estimatedMinutes} phút
          </span>
        </div>
      </div>

      {/* Decorative graphic bubble */}
      <div className="continue-card-graphic" aria-hidden="true">
        <div className="graphic-greeting-bubble">
          <span className="graphic-greeting-word">{course.greeting}</span>
          {course.pronunciation && (
            <span className="graphic-greeting-pinyin">
              {course.pronunciation}
            </span>
          )}
          <span className="graphic-greeting-translation">
            {course.translation}
          </span>
        </div>
      </div>
    </section>
  );
}
