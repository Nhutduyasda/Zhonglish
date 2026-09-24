import { Award, CheckCircle2, LockKeyhole } from "lucide-react";
import { achievements, type AchievementId } from "@/data/achievements";

export function Achievements({ earnedIds }: { earnedIds: AchievementId[] }) {
  return (
    <section className="achievements-section" aria-labelledby="achievements-heading">
      <div>
        <h2 id="achievements-heading">Thành tích của bạn</h2>
        <p>Mỗi thành tích được ghi nhận một lần. Thành tích không cộng thêm XP.</p>
      </div>
      <div className="achievements-grid">
        {achievements.map((achievement) => {
          const earned = earnedIds.includes(achievement.id);
          return (
            <article className={`achievement-item ${earned ? "achievement-earned" : ""}`} key={achievement.id}>
              <div className="achievement-icon" aria-hidden="true"><Award size={22} /></div>
              <div>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <span className="achievement-state">
                  {earned ? <CheckCircle2 size={15} aria-hidden="true" /> : <LockKeyhole size={15} aria-hidden="true" />}
                  {earned ? "Đã đạt" : "Chưa đạt"}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
