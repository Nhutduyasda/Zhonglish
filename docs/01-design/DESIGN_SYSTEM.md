# Design System

## Suggested tokens

```css
--background: #FAFAF8;
--surface: #FFFFFF;
--text: #202124;
--muted: #6B7280;
--border: #E8E8E3;

--primary: #6C5CE7;
--primary-soft: #EEEAFE;

--english: #4F8CFF;
--chinese: #FF6257;

--success: #32C78D;
--warning: #FFB020;
--danger: #EF5350;
```

Final values may be tuned during implementation, but one centralized token system must be used.

## Typography

Use a modern highly readable sans-serif supporting:
- Vietnamese;
- Latin;
- Simplified Chinese.

Recommended implementation:
- `next/font`
- no random font loading per component.

Scale:
- Display: 56–72 desktop.
- H1: 44–56.
- H2: 32–40.
- H3: 24–28.
- Body: 16–18.
- Small: 13–14.

## Radius

- buttons: 12–16px;
- cards: 20–28px;
- large hero panels: 28–36px.

## Shadows

Soft only.
No heavy “dashboard admin template” shadow.

## Buttons

Primary button:
- one main action;
- strong contrast;
- clear hover/pressed/focus;
- minimum touch height 44px.

## Icons

Use one icon family only, preferably Lucide.
No mixed icon styles.
