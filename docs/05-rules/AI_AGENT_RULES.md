# AI Agent Rules

## Core behavior

AI Agent must first understand existing repo before changing architecture.

## Before coding

1. Read relevant docs.
2. Inspect existing components.
3. Reuse before creating duplicate.
4. State files to change.
5. Keep scope within requested phase.

## UI generation rule

When asked to make a page “like Skolla”:
- reproduce the **design characteristics**, hierarchy and section rhythm;
- do not scrape/copy template source;
- do not copy protected assets;
- use project-native content and branding.

## Refactoring

Allowed when:
- necessary for the requested feature;
- reduces clear duplication;
- fixes correctness.

Avoid broad unrelated rewrites.

## Data

No fake random data inside production feature code.
Seed/demo data must be clearly separated.

## Finish response

Agent should report:
- what changed;
- important files;
- validation performed;
- known limitations;
- next recommended phase.
