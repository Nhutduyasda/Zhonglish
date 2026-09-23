# Phase 3 — Learning Dashboard

## 1. Mục tiêu Phase 3
Xây dựng và hoàn thiện **Learning Dashboard** (`/app`) cho nền tảng Zhonglish sau khi người dùng hoàn thành quy trình Onboarding.

Dashboard giải quyết dứt khoát 4 câu hỏi trọng tâm của người học:
1. **Tôi đang học ngôn ngữ nào?** (Hiển thị rõ ngôn ngữ đang học: English / 中文 Chinese, mục tiêu học tập).
2. **Hôm nay tôi cần học gì?** (Mục tiêu học tập hằng ngày theo số phút đã cam kết).
3. **Tôi đang tiến bộ như thế nào?** (Hiển thị trung thực 0 ngày streak và 0 XP khi chưa có bài học hoàn thành).
4. **Tôi bấm đâu để học tiếp?** (Thẻ Hero CTA "Bắt đầu bài đầu tiên / Tiếp tục học" nổi bật nhất).

---

## 2. Kiến trúc & Cấu trúc thư mục

```text
src/
├── app/
│   └── app/
│       └── page.tsx                         # Dashboard server page (force-dynamic, auth guarded)
├── components/
│   └── learning/
│       ├── learning-header.tsx              # Header thanh điều hướng, huy hiệu ngôn ngữ, logout
│       ├── continue-learning-card.tsx       # Hero CTA card, thông tin bài học mở đầu & preview modal
│       ├── learning-stats.tsx               # Thống kê: Daily Goal progress, Streak, XP
│       └── course-path.tsx                  # Lộ trình học tập (Course roadmap) đa giai đoạn
├── data/
│   └── curriculum.ts                        # Dữ liệu giáo trình typed cho English & Chinese
└── lib/
    └── supabase/
        └── profile.ts                       # Helper truy vấn getUserProfile() và authStatus()
```

---

## 3. Thành phần Components

### 3.1 `LearningHeader` (`src/components/learning/learning-header.tsx`)
- Logo thương hiệu Zhonglish kết nối trực tiếp đến Dashboard.
- Huy hiệu ngôn ngữ học tập hiện tại (`English` hoặc `中文 Chinese`), tự động chuyển đổi theo dữ liệu hồ sơ.
- Khu vực tài khoản hiển thị email của user.
- Form và Server Action đăng xuất (`signOut`), chuyển hướng an toàn về trang chủ `/`.

### 3.2 `ContinueLearningCard` (`src/components/learning/continue-learning-card.tsx`)
- Hero Card có trọng số thị giác cao nhất trên Dashboard.
- Hiển thị giai đoạn đầu tiên của khoá học (Tiêu đề, mô tả, chủ đề mở đầu).
- Bong bóng đồ hoạ trực quan hiển thị câu chào và phiên âm (`Hello! · Xin chào` hoặc `你好 (nǐ hǎo) · Xin chào`).
- Nút CTA chính: "Bắt đầu bài đầu tiên" với icon mũi tên.
- Modal preview thông tin: Giải thích trạng thái sẵn sàng và thông báo Lesson Engine tương tác đang được chuẩn bị ở Phase 4, hoàn toàn không giả lập tiến độ.

### 3.3 `LearningStats` (`src/components/learning/learning-stats.tsx`)
- **Mục tiêu hôm nay (Daily Goal)**: Đọc giá trị `profiles.daily_goal_minutes` (5, 10 hoặc 15 phút), hiển thị `0 / {goal} phút` kèm thanh tiến độ 0%.
- **Chuỗi ngày học (Streak)**: Hiển thị trung thực `0 ngày`, trạng thái chưa kích hoạt.
- **Điểm kinh nghiệm (XP)**: Hiển thị trung thực `0 XP`, hạng khởi đầu.

### 3.4 `CoursePath` (`src/components/learning/course-path.tsx`)
- Tiêu thụ trực tiếp dữ liệu từ `src/data/curriculum.ts`.
- Hiển thị danh sách các Stage theo tiến trình dọc có đường nối timeline:
  - Giai đoạn 1: Huy hiệu **Sẵn sàng** (`ready`), icon Play nổi bật.
  - Các giai đoạn tiếp theo: Huy hiệu **Sắp mở** (`upcoming`), icon Khoá (`Lock`).
  - Danh sách chủ đề bài học dạng tag/chip dễ đọc.

---

## 4. Nguồn dữ liệu (Data Source)

1. **User Profile**:
   - Truy vấn từ bảng `public.profiles` qua helper `getUserProfile()` trên Server Component.
   - Các trường sử dụng: `learning_language`, `learning_goal`, `daily_goal_minutes`, `experience_level`, `onboarding_completed`.
   - Áp dụng triệt để Row Level Security (RLS) của Supabase, không sử dụng secret key phía client.

2. **Giáo trình (Curriculum)**:
   - Tái sử dụng nguồn duy nhất `src/data/curriculum.ts` (`courses.english` và `courses.chinese`).

3. **Gamification & Stats (Phase 3)**:
   - XP: `0`.
   - Streak: `0`.
   - Daily progress: `0`.

---

## 5. Auth & Onboarding Guard

Route `/app` được bảo vệ nghiêm ngặt:
1. **Chưa đăng nhập**: Tự động chuyển hướng về `/sign-in`.
2. **Đã đăng nhập nhưng chưa hoàn thành Onboarding** (`onboarding_completed === false` hoặc chưa có bản ghi profile): Chuyển hướng về `/onboarding?resume=1`.
3. **Đã đăng nhập và hoàn thành Onboarding**: Hiển thị đầy đủ giao diện Dashboard.
4. **Đăng xuất**: Kích hoạt server action gọi `supabase.auth.signOut()` và chuyển hướng về `/`.

---

## 6. Responsive Behavior

Được kiểm tra và tối ưu cho các kích thước màn hình tiêu chuẩn:
- **Mobile (375px)**:
  - Header thu gọn: Ẩn bớt email dài, giữ logo và nút đăng xuất gọn gàng.
  - Thẻ Continue Learning xếp dọc, nút CTA tràn chiều rộng (full-width touch target), ẩn bớt bong bóng đồ hoạ phụ để tập trung vào nội dung bài học.
  - Thống kê (Stats) chuyển sang dạng lưới 1 cột thoáng đãng.
  - Thẻ lộ trình (Course Path) co giãn vừa vặn, không phát sinh thanh cuộn ngang (horizontal overflow).
- **Tablet (768px - 820px)**:
  - Bố cục thích ứng linh hoạt, thẻ thống kê sắp xếp hợp lý.
- **Desktop (1440px)**:
  - Độ rộng nội dung tối đa `860px` căn giữa chuẩn phong cách học tập tập trung (calm & focused), đồ hoạ bong bóng phiên âm hiển thị trọn vẹn.

---

## 7. Accessibility (A11y)

- Sử dụng thẻ ngữ nghĩa HTML5: `<header>`, `<main>`, `<section>`, `<article>`, `<h1>`, `<h2>`, `<h3>`, `<ul>`, `<li>`.
- Trạng thái `:focus-visible` với outline rõ ràng cho tất cả các nút bấm và liên kết.
- Hỗ trợ đóng Modal xem trước bằng phím `Escape` hoặc nhấp vào backdrop.
- Thanh tiến độ Daily Goal có đầy đủ thuộc tính ARIA: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Tôn trọng thuộc tính hệ thống `prefers-reduced-motion: reduce`.
- Không mã hoá trạng thái hoàn toàn bằng màu sắc (kết hợp nhãn văn bản + icon + màu sắc).

---

## 8. Known Limitations & Intentionally Deferred (Phase 4+)

Theo đúng phạm vi yêu cầu, các tính năng sau **chưa triển khai và được hoãn có chủ đích**:
- **Phase 4 — Lesson Engine**: Chưa có bộ render câu hỏi trắc nghiệm, ghép từ, phát âm, nghe nói. CTA "Bắt đầu bài đầu tiên" hiện mở bản tin xem trước thay vì làm bài tập giả.
- **Phase 5 — Chinese Foundation**: Chưa có cơ chế luyện viết chữ Hán stroke order, audio pinyin động.
- **Phase 6 — Gamification**: Chưa có logic tăng XP thật, tính toán streak qua ngày, danh hiệu (achievements), bảng xếp hạng (leaderboard).
- **Phase 7 — Persistence & Spaced Repetition**: Chưa có bảng ghi nhận lịch sử hoàn thành bài học và ôn tập ngắt quãng.
