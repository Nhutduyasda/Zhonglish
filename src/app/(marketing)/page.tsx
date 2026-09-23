import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function FoundationPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-6 px-5 py-16 sm:px-8">
      <p className="text-sm font-semibold tracking-wide text-primary">Zhonglish</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Nền tảng đã sẵn sàng.</h1>
      <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
        English + 中文 cho người mới bắt đầu. Phase 1 sẽ xây dựng trang giới thiệu tại đây.
      </p>
      <Button asChild>
        <a href="https://github.com/Nhutduyasda/Zhonglish#readme">
          <BookOpen aria-hidden="true" size={18} />
          Xem tài liệu dự án
        </a>
      </Button>
    </main>
  );
}
