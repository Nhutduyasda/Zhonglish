import { Play, Lock } from "lucide-react";
import type { Course } from "@/data/curriculum";

type CoursePathProps = {
  course: Course;
};

export function CoursePath({ course }: CoursePathProps) {
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
        {course.stages.map((stage, index) => {
          const isFirstStage = index === 0;
          const stageStatus = isFirstStage ? "ready" : "upcoming";

          return (
            <article
              key={stage.id}
              className={`stage-card stage-card-${stageStatus}`}
              aria-label={`Giai đoạn ${index + 1}: ${stage.title} - ${
                isFirstStage ? "Sẵn sàng học" : "Sắp mở"
              }`}
            >
              <div className="stage-card-indicator">
                <div
                  className={`stage-node stage-node-${stageStatus}`}
                  aria-hidden="true"
                >
                  {isFirstStage ? (
                    <Play size={18} className="stage-node-icon fill-current" />
                  ) : (
                    <Lock size={16} className="stage-node-icon" />
                  )}
                </div>
                {index < course.stages.length - 1 && (
                  <div className="stage-connector-line" aria-hidden="true" />
                )}
              </div>

              <div className="stage-card-body">
                <div className="stage-meta-row">
                  <span className="stage-index-tag">
                    GIAI ĐOẠN {index + 1}
                  </span>
                  <span
                    className={`stage-status-badge stage-badge-${stageStatus}`}
                  >
                    {isFirstStage ? "Sẵn sàng" : "Sắp mở"}
                  </span>
                </div>

                <h3 className="stage-title">{stage.title}</h3>
                <p className="stage-description">{stage.description}</p>

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
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
