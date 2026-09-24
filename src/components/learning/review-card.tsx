import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";

export function ReviewCard({ dueReviewCount }: { dueReviewCount: number }) {
  return (
    <section className="review-summary-card" aria-labelledby="review-summary-title">
      <div className="review-summary-icon" aria-hidden="true"><Brain size={24} /></div>
      <div className="review-summary-copy">
        <h2 id="review-summary-title">Ôn tập</h2>
        <p>{dueReviewCount > 0 ? `${dueReviewCount} nội dung cần ôn` : "Bạn chưa có nội dung cần ôn hôm nay."}</p>
      </div>
      {dueReviewCount > 0 && (
        <Link href="/app/review" className="review-summary-link">
          Ôn tập ngay <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}
