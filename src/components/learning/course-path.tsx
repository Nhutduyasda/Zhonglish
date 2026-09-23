import Link from "next/link";
import { Play, Lock, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import type { Course, LearningLanguage } from "@/data/curriculum";
import { getLessonsForStage } from "@/data/lessons";

type CoursePathProps = {
  course: Course;
  learningLanguage: LearningLanguage;
  completedLessonIds: string[];
};

export function CoursePath({
  course,
  learningLanguage,
  completedLessonIds,
}: CoursePathProps) {
  const stageEntries = course.stages.map((stage, index, allStages) => {
    const stageLessons = getLessonsForStage(learningLanguage, stage.id);
    const hasLessons = stageLessons.length > 0;
    const isAllCompleted =
      hasLessons &&
      stageLessons.every((lesson) => completedLessonIds.includes(lesson.id));

    // A stage can only be ready if all previous stages are fully completed
    const allPreviousCompleted = allStages.slice(0, index).every((prevStage) => {
      const prevLessons = getLessonsForStage(learningLanguage, prevStage.id);
      return (
        prevLessons.length > 0 &&
        prevLessons.every((l) => completedLessonIds.includes(l.id))
      );
    });

    let stageStatus: "completed" | "ready" | "upcoming" = "upcoming";
    if (isAllCompleted) {
      stageStatus = "completed";
    } else if (allPreviousCompleted && hasLessons) {
      stageStatus = "ready";
    }

    const targetLesson = isAllCompleted
      ? stageLessons[0]
      : stageLessons.find((l) => !completedLessonIds.includes(l.id)) ??
        stageLessons[0];

    return {
      stage,
      index,
      stageStatus,
      targetLesson,
      hasLessons,
    };
  });

  return (
    <section className="course-path-section" aria-labelledby="course-path-heading">
      <div className="course-path-header">
        <div>
          <h2 id="course-path-heading" className="course-path-title">
            Lộ trình học tập
          </h2>
          <p className="course-path-subtitle">
            Các giai đoạn học từ con số 0 của khoá học {course.name}.
          </p>
        </div>
      </div>

      <div className="course-stages-list">
        {stageEntries.map(
          ({ stage, index, stageStatus, targetLesson, hasLessons }) => {
            return (
              <article
                key={stage.id}
                className={`stage-card stage-card-${stageStatus}`}
              aria-label={`Giai đoạn ${index + 1}: ${stage.title} - ${
                stageStatus === "completed"
                  ? "Đã hoàn thành"
                  : stageStatus === "ready"
                  ? "Sẵn sàng học"
                  : "Sắp mở"
              }`}
            >
              {/* Timeline Indicator */}
              <div className="stage-card-indicator">
                <div
                  className={`stage-node stage-node-${stageStatus}`}
                  aria-hidden="true"
                >
                  {stageStatus === "completed" ? (
                    <CheckCircle2 size={18} className="stage-node-icon" />
                  ) : stageStatus === "ready" ? (
                    <Play size={18} className="stage-node-icon fill-current" />
                  ) : (
                    <Lock size={16} className="stage-node-icon" />
                  )}
                </div>
                {index < course.stages.length - 1 && (
                  <div className="stage-connector-line" aria-hidden="true" />
                )}
              </div>

              {/* Card Body */}
              <div className="stage-card-body">
                <div className="stage-meta-row">
                  <span className="stage-index-tag">GIAI ĐOẠN {index + 1}</span>
                  <span
                    className={`stage-status-badge stage-badge-${stageStatus}`}
                  >
                    {stageStatus === "completed" && "✓ Hoàn thành"}
                    {stageStatus === "ready" && "▶ Sẵn sàng"}
                    {stageStatus === "upcoming" && "🔒 Sắp mở"}
                  </span>
                </div>

                <h3 className="stage-title">{stage.title}</h3>
                <p className="stage-description">{stage.description}</p>

                {/* Topics List */}
                <div className="stage-topics-group">
                  <span className="topics-heading">Chủ đề bài học:</span>
                  <div className="topics-chips-list">
                    {stage.topics.map((topic) => (
                      <span key={topic} className="topic-chip">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button for Stage */}
                <div className="stage-action-row">
                  {stageStatus === "completed" && targetLesson && (
                    <Link
                      href={`/app/lesson/${targetLesson.id}`}
                      className="stage-action-btn stage-action-replay"
                      aria-label={`Học lại giai đoạn ${index + 1}: ${stage.title}`}
                    >
                      <RotateCcw size={15} aria-hidden="true" />
                      <span>Học lại</span>
                    </Link>
                  )}

                  {stageStatus === "ready" && targetLesson && (
                    <Link
                      href={`/app/lesson/${targetLesson.id}`}
                      className="stage-action-btn stage-action-start"
                      aria-label={`Bắt đầu học giai đoạn ${index + 1}: ${stage.title}`}
                    >
                      <span>Bắt đầu bài học</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  )}

                  {stageStatus === "upcoming" && (
                    <span className="stage-locked-hint">
                      {hasLessons
                        ? "Hoàn thành giai đoạn trước để mở khóa"
                        : "Nội dung đang được cập nhật"}
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
