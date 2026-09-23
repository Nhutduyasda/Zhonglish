# Zhonglish — English + Chinese Learning Platform

Bộ tài liệu này là **single source of truth** cho AI Agent khi vibe coding website học tiếng Anh – tiếng Trung dành cho người bắt đầu từ số 0.

## Product direction

- Public/marketing pages: lấy **Skolla** làm chuẩn cảm giác thị giác, nhịp layout, độ thoáng, hierarchy và cách dẫn dắt người dùng.
- Learning experience: lấy cảm hứng từ **Uizard Language Learning Web App**, **Duolingo** và **HelloChinese**.
- Không sao chép source code, logo, mascot, illustration, ảnh, font trả phí hoặc asset độc quyền của bất kỳ sản phẩm/template nào.
- Mọi UI phải được viết lại bằng code riêng và dùng branding riêng.
- Mục tiêu deploy: **Vercel**.
- Frontend framework đề xuất: **Next.js + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion**.

## Start here

1. Đọc `00_START_HERE.md`
2. Đọc `AGENTS.md`
3. Đọc `docs/00-product/`
4. Đọc `docs/01-design/`
5. Đọc `docs/05-rules/`
6. Đọc `docs/06-roadmap/` và [`PROJECT_STATUS.md`](docs/06-roadmap/PROJECT_STATUS.md)

## Core principle

> Beginner first. One clear action per screen. Every learning session should feel achievable in 3–5 minutes.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`. Trang gốc hiện là trang kiểm tra nền tảng; landing page sẽ được xây ở Phase 1.

## Kiểm tra

```bash
npm run lint
npm run typecheck
npm run build
```

Các biến môi trường dự kiến cho các phase sau nằm trong `.env.example`; Phase 0 không cần cấu hình chúng.
