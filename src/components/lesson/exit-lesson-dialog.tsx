"use client";

import { useEffect } from "react";
import { AlertCircle, X } from "lucide-react";

type ExitLessonDialogProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ExitLessonDialog({
  isOpen,
  onCancel,
  onConfirm,
}: ExitLessonDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="modal-container exit-dialog-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-dialog-title"
        aria-describedby="exit-dialog-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge exit-icon-badge" aria-hidden="true">
              <AlertCircle size={22} />
            </div>
            <div>
              <h3 id="exit-dialog-title" className="modal-title">
                Thoát bài học?
              </h3>
              <p id="exit-dialog-desc" className="modal-subtitle">
                Tiến độ của phiên học hiện tại sẽ bị mất.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Đóng cửa sổ xác nhận"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-footer exit-dialog-footer">
          <button
            type="button"
            className="exit-dialog-cancel-btn"
            onClick={onCancel}
          >
            Tiếp tục học
          </button>
          <button
            type="button"
            className="exit-dialog-confirm-btn"
            onClick={onConfirm}
          >
            Thoát bài
          </button>
        </div>
      </div>
    </div>
  );
}
