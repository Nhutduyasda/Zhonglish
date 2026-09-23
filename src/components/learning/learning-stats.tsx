import { Clock, Flame, Zap } from "lucide-react";

type LearningStatsProps = {
  dailyGoalMinutes: number;
  todayLearningMinutes: number;
  totalXp: number;
  currentStreak: number;
};

export function LearningStats({
  dailyGoalMinutes,
  todayLearningMinutes,
  totalXp,
  currentStreak,
}: LearningStatsProps) {
  const progressPercent =
    dailyGoalMinutes > 0
      ? Math.min(100, Math.round((todayLearningMinutes / dailyGoalMinutes) * 100))
      : 0;

  return (
    <section className="learning-stats-grid" aria-label="Thống kê học tập">
      {/* 1. Daily Goal Card */}
      <div className="stat-card stat-card-goal">
        <div className="stat-card-top">
          <span className="stat-label">Mục tiêu hôm nay</span>
          <div className="stat-icon-wrapper stat-icon-goal" aria-hidden="true">
            <Clock size={18} />
          </div>
        </div>

        <div className="stat-value-group">
          <div className="stat-number">
            {todayLearningMinutes}{" "}
            <span className="stat-unit">/ {dailyGoalMinutes} phút</span>
          </div>
          <p className="stat-subtext">{progressPercent}% hoàn thành hôm nay</p>
        </div>

        <div
          className="stat-progress-bar"
          role="progressbar"
          aria-valuenow={todayLearningMinutes}
          aria-valuemin={0}
          aria-valuemax={dailyGoalMinutes}
          aria-label={`Tiến độ mục tiêu hằng ngày: ${todayLearningMinutes} trên ${dailyGoalMinutes} phút`}
        >
          <div
            className="stat-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Streak Card */}
      <div className="stat-card stat-card-streak">
        <div className="stat-card-top">
          <span className="stat-label">Chuỗi ngày (Streak)</span>
          <div
            className={`stat-icon-wrapper stat-icon-streak ${
              currentStreak > 0 ? "streak-active" : ""
            }`}
            aria-hidden="true"
          >
            <Flame size={18} />
          </div>
        </div>

        <div className="stat-value-group">
          <div className="stat-number">
            {currentStreak} <span className="stat-unit">ngày</span>
          </div>
          <p className="stat-subtext">
            {currentStreak > 0
              ? "Tuyệt vời! Tiếp tục duy trì phong độ"
              : "Học hôm nay để bắt đầu chuỗi"}
          </p>
        </div>

        <div
          className={`stat-streak-badge ${
            currentStreak > 0 ? "badge-active" : ""
          }`}
        >
          <span>{currentStreak > 0 ? "Đang duy trì 🔥" : "Chưa kích hoạt"}</span>
        </div>
      </div>

      {/* 3. XP Card */}
      <div className="stat-card stat-card-xp">
        <div className="stat-card-top">
          <span className="stat-label">Điểm kinh nghiệm</span>
          <div className="stat-icon-wrapper stat-icon-xp" aria-hidden="true">
            <Zap size={18} />
          </div>
        </div>

        <div className="stat-value-group">
          <div className="stat-number">
            {totalXp} <span className="stat-unit">XP</span>
          </div>
          <p className="stat-subtext">
            {totalXp > 0 ? "Điểm tích lũy từ bài học" : "Hoàn thành bài để nhận XP"}
          </p>
        </div>

        <div className="stat-xp-level">
          <span>{totalXp >= 20 ? "Tập sự" : "Khởi đầu"}</span>
        </div>
      </div>
    </section>
  );
}
