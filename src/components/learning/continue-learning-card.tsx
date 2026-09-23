import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import type { Course } from "@/data/curriculum";
import { getStarterLessonForLanguage } from "@/data/lessons";

type ContinueLearningCardProps = {
  course: Course;
  learningLanguage: "english" | "chinese";
};

export function ContinueLearningCard({
  course,
  learningLanguage,
}: ContinueLearningCardProps) {
  const currentStage = course.stages[0];
  const firstTopic = currentStage?.topics[0] ?? "";
  const starterLessonId = getStarterLessonForLanguage(learningLanguage);

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
            {currentStage?.title}
          </h2>
          <p className="continue-card-description">
            {currentStage?.description}
          </p>
        </div>

        <div className="continue-card-topic-preview">
          <span className="topic-preview-label">Chủ đề mở đầu:</span>
          <span className="topic-preview-pill">
            <BookOpen size={14} aria-hidden="true" />
            {firstTopic}
          </span>
        </div>

        <div className="continue-card-actions">
          <Link
            href={`/app/lesson/${starterLessonId}`}
            className="continue-card-cta"
            aria-label={`Bắt đầu bài đầu tiên: ${currentStage?.title}`}
          >
            <span>Bắt đầu bài đầu tiên</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <span className="continue-card-hint">Khoảng 3-5 phút</span>
        </div>
      </div>

      {/* Decorative graphic card */}
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
