# Phase 4 — Lesson Engine

## 1. Objective
Xây dựng và hoàn thiện **Lesson Engine** tương tác hoạt động thật cho nền tảng Zhonglish.
Lesson Engine thay thế hoàn toàn trải nghiệm preview ở Phase 3, cho phép người dùng bắt đầu và hoàn thành phiên học trực tiếp từ Learning Dashboard (`/app`) cho cả hai ngôn ngữ: **English** và **Chinese**.

---

## 2. Route & Auth Guards

- **Route**: `/app/lesson/[lessonId]` (Server Component, `force-dynamic`)
- **Bảo vệ xác thực (Auth Guard)**:
  - Nếu chưa đăng nhập: chuyển hướng về `/sign-in`.
  - Nếu đã đăng nhập nhưng chưa hoàn tất Onboarding: chuyển hướng về `/onboarding?resume=1`.
- **Bảo vệ ngôn ngữ (Language Guard)**:
  - Nếu `lessonId` không tồn tại trong hệ thống: chuyển hướng an toàn về `/app`.
  - Nếu ngôn ngữ của bài học không khớp với `profile.learning_language`: tự động chuyển hướng về bài học khởi đầu tương ứng với ngôn ngữ của người dùng (ví dụ user học English truy cập bài Chinese sẽ được chuyển hướng về `english-survival-1`).

---

## 3. Kiến trúc & Cấu trúc mã nguồn

```text
src/
├── app/
│   └── app/
│       ├── page.tsx                             # Dashboard kết nối CTA bài học
│       └── lesson/
│           └── [lessonId]/
│               └── page.tsx                     # Route bài học server-guarded
├── components/
│   ├── learning/
│   │   └── continue-learning-card.tsx           # CTA điều hướng trực tiếp vào bài học thật
│   └── lesson/
│       ├── lesson-header.tsx                    # Thanh điều hướng trên cùng, nút thoát, progress bar
│       ├── exit-lesson-dialog.tsx               # Hộp thoại xác nhận thoát khi có tiến độ
│       ├── exercise-renderer.tsx                # Dispatcher điều phối các dạng bài tập
│       ├── exercise-feedback.tsx                # Khung phản hồi đúng/sai khích lệ, hiện đáp án đúng
│       ├── lesson-result.tsx                    # Màn hình kết quả, độ chính xác %, học lại
│       ├── lesson-player.tsx                    # State machine điều phối toàn bộ phiên học
│       └── exercises/
│           ├── multiple-choice.tsx              # Bài tập trắc nghiệm chọn 1 đáp án
│           ├── text-input.tsx                   # Bài tập gõ từ / pinyin
│           ├── matching.tsx                     # Bài tập ghép cặp từ vựng hai cột
│           └── listening.tsx                    # Bài tập nghe phát âm qua Web Speech API
├── data/
│   ├── curriculum.ts                            # Khung chương trình đào tạo
│   └── lessons.ts                               # Dữ liệu bài học starter typed (English & Chinese)
└── features/
    └── lesson/
        ├── types.ts                             # Discriminated union types cho bài học và bài tập
        └── evaluation.ts                        # Logic chấm điểm thuần túy và chuẩn hoá văn bản
```

---

## 4. Cấu trúc dữ liệu bài tập (Exercise Primitives)

Sử dụng TypeScript Discriminated Union rõ ràng, không dùng `any`:

1. **Multiple Choice (`multiple_choice`)**:
   - `prompt`: Câu hỏi.
   - `options`: Mảng các lựa chọn.
   - `correctAnswer`: Đáp án chính xác.
   - `explanation`: Giải thích ngắn gọn bằng tiếng Việt.
2. **Matching (`matching`)**:
   - `prompt`: Yêu cầu ghép cặp.
   - `pairs`: Mảng các cặp `{ id, left, right }`.
   - Cơ chế trộn cột phải (pseudo-shuffle) đảm bảo tính ngẫu nhiên nhất quán.
   - Cho phép chọn, ghép và gỡ ghép trước khi bấm Kiểm tra.
3. **Listening (`listening`)**:
   - `speechText`: Chuỗi cần phát âm (`Thank you` / `谢谢`).
   - `speechLang`: Mã ngôn ngữ phát âm (`en-US` hoặc `zh-CN`).
   - `fallbackTextAlternative`: Văn bản gợi ý thay thế khi trình duyệt không hỗ trợ phát âm.
   - `options` & `correctAnswer`: Lựa chọn văn bản nghe được.
4. **Text Input (`text_input`)**:
   - `prompt`: Câu hỏi.
   - `placeholder`: Gợi ý nhập liệu.
   - `acceptedAnswers`: Mảng các câu trả lời được chấp nhận.
   - `displayAnswer`: Chuỗi hiển thị đáp án chuẩn mực khi người dùng trả lời sai.

---

## 5. Logic chấm điểm & Chuẩn hoá (Evaluation & Normalization)

Tách biệt hoàn toàn logic đánh giá khỏi giao diện React trong `src/features/lesson/evaluation.ts`:
- **Chuẩn hoá chuỗi (`normalizeText`)**:
  - `trim()` khoảng trắng đầu/cuối.
  - Rút gọn khoảng trắng thừa liên tiếp thành 1 dấu cách (`replace(/\s+/g, " ")`).
  - Chuyển chữ thường (`toLowerCase()`).
  - Bảo toàn trọn vẹn ký tự Unicode (tiếng Việt có dấu, chữ Hán Hanzi và pinyin).
- **Trắc nghiệm & Nghe**: So khớp chính xác giá trị đã chọn.
- **Ghép cặp**: Đánh giá tất cả các cặp đã ghép, đảm bảo mỗi thẻ bên trái ghép đúng với thẻ tương ứng bên phải.

---

## 6. Máy trạng thái phiên học (State Machine)

```text
Loading / Active Exercise
   ↓ (Người dùng chọn đáp án / gõ từ / ghép cặp)
Enabled CTA "Kiểm tra"
   ↓ (Bấm "Kiểm tra" - đánh giá 1 lần duy nhất, khoá input)
Submitted & Feedback Visible
   - Đúng: Banner xanh, biểu tượng chúc mừng, giải thích ngắn
   - Sai: Banner vàng, "Gần đúng rồi.", hiển thị đáp án đúng & giải thích
   ↓ (Bấm "Tiếp tục")
Next Exercise (hoặc hoàn tất nếu là câu cuối cùng)
   ↓
Result Screen (Tổng kết phiên học)
```

- **Chống spam**: Nút "Kiểm tra" chỉ bật khi input hợp lệ. Ngay khi bấm, toàn bộ bài tập bị khóa để ngăn đổi đáp án hoặc gọi đánh giá nhiều lần.
- **Không lộ đáp án (Answer Leaking Prevention)**: Thuộc tính HTML không chứa đáp án (không dùng `data-correct-answer` trên DOM).

---

## 7. Màn hình kết quả (Result Screen)

- Hiển thị tỷ lệ chính xác: `Số câu đúng / Tổng số câu` và phần trăm `%` (xử lý an toàn mẫu số 0, không NaN).
- Danh sách các chủ đề đã thực hành trong bài học.
- Ghi nhận những câu chưa chính xác trong phiên học để nhắc nhở người học.
- **Học lại (`onRestart`)**: Cho phép làm lại bài tập ngay tại chỗ, reset toàn bộ chỉ số về câu 1 mà không cần tải lại trang.
- **Quay lại Dashboard**: Nút điều hướng về `/app`.
- **Thông báo Gamification trung lập**: *"Điểm thưởng và chuỗi ngày học sẽ được kết nối ở giai đoạn gamification."* (không đưa thuật ngữ kỹ thuật vào UI).

---

## 8. Trải nghiệm nghe (Listening Primitive)

- Tích hợp Web Speech API (`window.speechSynthesis`).
- Chỉ phát âm thanh khi người dùng chủ động bấm (không autoplay).
- Tự động gọi `speechSynthesis.cancel()` trước khi phát mới hoặc khi unmount component để tránh chồng chéo âm thanh hoặc rò rỉ bộ nhớ.
- Hỗ trợ nút nghe lại không giới hạn.
- Có fallback UI thân thiện và gợi ý nội dung nếu trình duyệt không hỗ trợ Web Speech API.

---

## 9. Thoát phiên học (Exit Handling)

- Nút `← Thoát` ở góc trên bên trái:
  - Nếu người dùng chưa trả lời câu nào: quay về Dashboard ngay lập tức.
  - Nếu người dùng đã làm ít nhất 1 câu và chưa hoàn thành: hiển thị hộp thoại xác nhận `ExitLessonDialog` với thông báo tiến độ phiên hiện tại sẽ bị mất.
  - Hỗ trợ đóng hộp thoại bằng phím `Escape` hoặc bấm backdrop.

---

## 10. Tiếp cận & Thích ứng (Accessibility & Responsive)

- **A11y**:
  - Thanh tiến độ có đầy đủ thuộc tính ARIA: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
  - Phím `Enter` trong ô nhập liệu kích hoạt nộp bài khi đã nhập nội dung.
  - Ghép cặp hỗ trợ hoàn toàn qua nhấp chuột / chạm cảm ứng, không bắt buộc kéo thả (drag-and-drop).
  - Tôn trọng thuộc tính hệ thống `prefers-reduced-motion`.
- **Responsive**:
  - **Mobile 375px**: Nút CTA tràn chiều rộng (touch target lớn), cột ghép cặp co giãn hợp lý không sinh cuộn ngang, thanh tiến độ hiển thị rõ.
  - **Tablet 768px**: Cân đối, khoảng cách thoáng đãng.
  - **Desktop 1440px**: Vùng làm bài tập giới hạn tối đa `660px` căn giữa tạo sự tập trung tối đa, không bị kéo dãn thị giác.

---

## 11. Các bài học khởi đầu (Starter Lessons)

1. **Tiếng Anh (`english-survival-1`)**:
   - Tiêu đề: *Chào hỏi cơ bản*
   - Gồm 6 bài tập: Multiple Choice, Listening (en-US), Matching, Multiple Choice, Text Input, Multiple Choice.
2. **Tiếng Trung (`chinese-survival-1`)**:
   - Tiêu đề: *Lời chào đầu tiên*
   - Gồm 6 bài tập: Multiple Choice, Listening (zh-CN), Matching, Multiple Choice, Text Input (pinyin), Multiple Choice.

---

## 12. Giới hạn đã biết & Hoãn có chủ đích (Phase 5+)

- **Chưa có lưu trữ DB tiến độ học**: Lịch sử phiên học không lưu vào cơ sở dữ liệu (thuộc Phase 7). F5 tải lại bài học sẽ bắt đầu lại phiên học mới.
- **Chưa cộng XP / tính chuỗi Streak thật**: Các chỉ số này giữ nguyên mức 0 của Phase 3 (thuộc Phase 6).
- **Chưa có Chinese handwriting / stroke order**: Thuộc Phase 5.
