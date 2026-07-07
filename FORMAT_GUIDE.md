You are reformatting a technical documentation file to follow a strict MDN-inspired format.
Do NOT change technical content, code examples, or meaning — only restructure and reformat.

RULES:

1. TITLE: Single `# Title` with no emojis. Follow immediately with a plain summary
   paragraph (not a blockquote). Include a prerequisites table if the topic has dependencies.

2. SECTIONS — use this exact order, skip sections marked optional if not relevant:
   - Syntax (always) — at-a-glance shape, signature, or command table
   - Description (always) — how it works, key characteristics, callouts
   - Examples (always) — basic, real-world, common patterns
   - Comparison (optional) — table contrasting with alternatives
   - Interview guidance (optional) — what to say, follow-ups, difficulty word
   - See also (always) — cross-links to related docs

3. HEADINGS: `##` for sections, `###` for subsections, `####` for details.
   No emojis in any heading. Never skip heading levels.

4. CODE BLOCKS: Always fenced with language tag. Use `// ✅` and `// ❌` markers.
   Comment non-obvious lines. Keep under 30 lines per block.

5. CALLOUTS — only two kinds:
   - `> **Note:** helpful context`
   - `> **Warning:** gotcha or caution`

6. TABLES: Use for all comparisons, references, prerequisites, and summaries.

7. INTERVIEW GUIDANCE section structure:
   - **How to explain it:** — a quoted 1–3 sentence answer
   - **Common follow-ups:** — table of question / key points
   - **Difficulty:** — one word: Beginner, Intermediate, or Advanced

8. NO:
   - Emojis anywhere (except ✅ / ❌ inside code blocks)
   - "Strong Answer" / "Weak Answer" labels
   - Stars, badges, or decorative symbols in text
   - Bare URLs — always use `[link text](url)`
   - Heading level skips

9. CROSS-REFERENCES: Use relative paths `[Name](./file.md)`.

10. TONE: Clear, direct, neutral — like MDN. No marketing language,
    no "master this!" phrasing. State facts, show code, move on.
