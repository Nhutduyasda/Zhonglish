# AGENTS.md

File này dành cho AI coding agent.

## Mandatory reading order

Trước khi thay đổi code:
1. `README.md`
2. `00_START_HERE.md`
3. `docs/05-rules/AI_AGENT_RULES.md`
4. `docs/05-rules/CODING_RULES.md`
5. `docs/05-rules/UI_UX_RULES.md`
6. tài liệu phase liên quan.

## Do

- Ưu tiên reusable components.
- Dùng Server Components mặc định khi phù hợp.
- Chỉ dùng Client Components khi có interaction/state/browser API.
- TypeScript strict.
- Mobile-first.
- Animation bằng Framer Motion ở nơi có giá trị UX.
- Tạo loading, empty, error, success state.
- Giữ visual language nhất quán.
- Tách content/data khỏi component trình bày khi hợp lý.
- Giữ page component gọn.

## Do not

- Không copy source code hoặc asset từ Skolla/Uizard/Duolingo/HelloChinese.
- Không dùng logo/mascot của họ.
- Không hard-code toàn bộ UI vào một file.
- Không thêm library chỉ để làm một việc CSS đơn giản.
- Không tạo animation gây chóng mặt hoặc chặn tương tác.
- Không thay đổi design system tùy ý giữa các trang.
- Không tự phát minh nghiệp vụ ngoài scope phase.

## Before finishing a task

Run:
- lint
- typecheck
- production build

Sau đó kiểm tra:
- desktop;
- tablet;
- mobile;
- light mode;
- main empty/loading/error state.
