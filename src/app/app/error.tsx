"use client";

import { useEffect } from "react";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Dashboard unavailable", error); }, [error]);
  return (
    <main className="learning-main">
      <div className="learning-content-container" role="alert">
        <h1 className="text-2xl font-bold">Chưa tải được tiến độ học tập</h1>
        <p className="mt-2 text-muted-foreground">Dữ liệu của bạn vẫn được giữ nguyên. Vui lòng thử lại.</p>
        <button type="button" onClick={reset} className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Thử lại</button>
      </div>
    </main>
  );
}
