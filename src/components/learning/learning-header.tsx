import Link from "next/link";
import { LogOut, Home } from "lucide-react";
import type { LearningLanguage } from "@/data/curriculum";

type LearningHeaderProps = {
  learningLanguage: LearningLanguage;
  userEmail?: string;
  signOutAction: () => Promise<void>;
};

export function LearningHeader({
  learningLanguage,
  userEmail,
  signOutAction,
}: LearningHeaderProps) {
  const languageLabel =
    learningLanguage === "chinese" ? "中文 Chinese" : "English";
  const languageFlag = learningLanguage === "chinese" ? "🇨🇳" : "🇬🇧";

  return (
    <header className="learning-header">
      <div className="learning-header-inner">
        {/* Brand & Language Group */}
        <div className="learning-header-brand-group">
          <Link
            href="/app"
            className="learning-brand"
            aria-label="Zhonglish Dashboard"
          >
            <span className="brand-symbol" aria-hidden="true">
              中
            </span>
            <span>Zhonglish</span>
          </Link>

          {/* Current Language Badge */}
          <div
            className="learning-language-badge"
            role="status"
            aria-label={`Ngôn ngữ đang học: ${languageLabel}`}
          >
            <span className="language-badge-flag" aria-hidden="true">
              {languageFlag}
            </span>
            <span className="language-badge-text">{languageLabel}</span>
          </div>
        </div>

        {/* User Account, Home Navigation & Actions */}
        <div className="learning-header-user-group">
          {/* Link back to Landing page */}
          <Link
            href="/"
            className="learning-nav-home"
            aria-label="Về trang chủ"
          >
            <Home size={16} aria-hidden="true" />
            <span className="learning-nav-home-text">Trang chủ</span>
          </Link>

          {userEmail && (
            <span className="learning-user-email" title={userEmail}>
              {userEmail}
            </span>
          )}

          <form action={signOutAction}>
            <button
              type="submit"
              className="learning-logout-btn"
              aria-label="Đăng xuất khỏi tài khoản"
            >
              <LogOut size={16} aria-hidden="true" />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
