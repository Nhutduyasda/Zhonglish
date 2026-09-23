import { Clock, Flame, Zap } from "lucide-react";

type LearningStatsProps = {
  dailyGoalMinutes: number;
};

export function LearningStats({ dailyGoalMinutes }: LearningStatsProps) {
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
            0 <span className="stat-unit">/ {dailyGoalMinutes} phút</span>
          </div>
          <p className="stat-subtext">0% hoàn thành hôm nay</p>
        </div>

        <div
          className="stat-progress-bar"
          role="progressbar"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={dailyGoalMinutes}
          aria-label={`Tiến độ mục tiêu hằng ngày: 0 trên ${dailyGoalMinutes} phút`}
        >
          <div className="stat-progress-fill" style={{ width: "0%" }} />
        </div>
      </div>

      {/* 2. Streak Card */}
      <div className="stat-card stat-card-streak">
        <div className="stat-card-top">
          <span className="stat-label">Chuỗi ngày (Streak)</span>
          <div className="stat-icon-wrapper stat-icon-streak" aria-hidden="true">
            <Flame size={18} />
          </div>
        </div>

        <div className="stat-value-group">
          <div className="stat-number">
            0 <span className="stat-unit">ngày</span>
          </div>
          <p className="stat-subtext">Học hôm nay để bắt đầu chuỗi</p>
        </div>

        <div className="stat-streak-badge">
          <span>Chưa kích hoạt</span>
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
            0 <span className="stat-unit">XP</span>
          </div>
          <p className="stat-subtext">Hoàn thành bài để tích luỹ</p>
        </div>

        <div className="stat-xp-level">
          <span>Hạng khởi đầu</span>
        </div>
      </div>
    </section>
  );
}
