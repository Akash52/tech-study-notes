---

# Asking Copilot to Make Changes to an Existing PR — Quick Notes

## The Core Idea
Mention **`@copilot`** in any PR comment or review to ask Copilot to make changes to that pull request.

---

## Default Behaviour
- Copilot **pushes commits directly** to the PR's existing branch
- Once done, it **requests your review** automatically

> Want a separate PR instead? Just say so in plain English:
> `"@copilot open a PR to fix the tests"`

---

## How to Trigger It
1. Open the pull request
2. Write a comment or review and mention `@copilot` with your instructions
3. (Optional) Select an AI model using the model picker *(only available on plain PR comments, not review comments)*
4. Submit the comment/review → Copilot starts working

---

## Resolving Merge Conflicts
Two ways to get Copilot to fix merge conflicts:

| Method | How |
|---|---|
| **"Fix with Copilot" button** | Appears in the merge box when conflicts exist — just click it |
| **`@copilot` mention** | Comment `@copilot resolve the merge conflicts on this PR` |

After resolving, Copilot will:
- Ensure the **build, tests, and linter** still pass
- Request your **review** before merging

---

## Monitoring Progress
- **Agents panel / page**: `github.com/copilot/agents`
- **VS Code**: via Copilot Chat sidebar
- Track all current and past sessions from these entry points

---

> **Plans required:** Copilot Pro, Pro+, Business, or Enterprise. Must be enabled for the repository.

---
