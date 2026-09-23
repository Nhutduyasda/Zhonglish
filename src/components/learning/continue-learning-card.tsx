"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, BookOpen, X, Info } from "lucide-react";
import type { Course } from "@/data/curriculum";

type ContinueLearningCardProps = {
  course: Course;
  learningLanguage: "english" | "chinese";
};

export function ContinueLearningCard({
  course,
  learningLanguage,
}: ContinueLearningCardProps) {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const currentStage = course.stages[0];
  const firstTopic = currentStage?.topics[0] ?? "";

  useEffect(() => {
    if (!showPreviewModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPreviewModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPreviewModal]);

  return (
    <>
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
            <button
              type="button"
              className="continue-card-cta"
              onClick={() => setShowPreviewModal(true)}
              aria-haspopup="dialog"
              aria-expanded={showPreviewModal}
            >
              <span>Bắt đầu bài đầu tiên</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
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

      {/* Phase 4 Preview Modal */}
      {showPreviewModal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="modal-container"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <Info size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 id="preview-modal-title" className="modal-title">
                    Sẵn sàng cho {currentStage?.title}
                  </h3>
                  <p className="modal-subtitle">{course.name} · Bước khởi đầu</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowPreviewModal(false)}
                aria-label="Đóng cửa sổ thông báo"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-notice-box">
                <p>
                  <strong>Lesson Engine đang được chuẩn bị ở Phase 4.</strong>
                </p>
                <p className="modal-notice-text">
                  Toàn bộ lộ trình và hồ sơ học tập của bạn đã sẵn sàng. Trình làm bài tập tương tác (trắc nghiệm, phát âm, ghép từ) sẽ chính thức hoạt động trong bản cập nhật kế tiếp!
                </p>
              </div>

              <div className="modal-topics-list">
                <h4>Các chủ đề trong giai đoạn này:</h4>
                <ul>
                  {currentStage?.topics.map((topic, index) => (
                    <li key={topic}>
                      <span className="topic-order">{index + 1}</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="modal-action-btn"
                onClick={() => setShowPreviewModal(false)}
              >
                Đã hiểu, quay lại Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
