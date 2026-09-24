export default function DashboardLoading() {
  return (
    <main className="learning-main" aria-busy="true" aria-label="Đang tải lộ trình học">
      <div className="learning-content-container" role="status">
        <p className="text-sm text-muted-foreground">Đang tải tiến độ học tập...</p>
        <div className="learning-stats-grid mt-6" aria-hidden="true">
          {[0, 1, 2].map((item) => <div key={item} className="stat-card min-h-36 animate-pulse bg-muted" />)}
        </div>
      </div>
    </main>
  );
}
