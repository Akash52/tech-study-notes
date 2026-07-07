---

# 📝 Reviewing a Pull Request Created by Copilot — Quick Notes

## The Golden Rule
**Always review Copilot's PR thoroughly before merging.** You are still responsible for the code that gets merged.

---

## Reviewing Copilot's Changes

- Review the diff just like any other PR
- Use **`@copilot`** in PR comments to ask for changes → Copilot pushes commits directly to the same branch
- Prefer a separate PR instead? Ask in plain English: `"@copilot open a new PR for this fix"`
- Want to fix something yourself? Just **check out the branch** and push manually
- Use the **model picker** when submitting a plain PR comment to change the AI model *(not available in review comments)*

> 💡 **Tip:** Batch your review comments together rather than submitting them one by one — it's more efficient for Copilot to handle them all at once.

---

## How to Know Copilot Has Seen Your Comment
When Copilot picks up your comment and starts a new session:
- 👀 **Eyes emoji** is added as a reaction to your comment
- A **"Copilot has started work"** event appears in the PR timeline

---

## Important Notes on Approvals
> ⚠️ If your repo requires a minimum number of PR approvals:
> - **Your own approval does NOT count** toward the required number on a Copilot-created PR
> - Someone **else** must approve before it can be merged

---

## Custom Agents & Context
- If the PR was created by a **custom agent**, mentioning `@copilot` will continue using **that same custom agent** (not the default one)
- Copilot **remembers context** from previous sessions on the same PR — it gets faster and more reliable over time

---

## Managing GitHub Actions Workflows
- By default, **GitHub Actions will NOT run automatically** when Copilot pushes changes
- This is a **security measure** — Copilot's changes could affect workflow files with access to secrets
- To allow workflows to run → click **"Approve and run workflows"** button in the PR merge box
- You can optionally **configure auto-approval** of workflows in agent settings

---

## Giving Feedback on Copilot's Work
- Use 👍 / 👎 buttons on Copilot's PRs and comments
- 👎 prompts you for a reason + optional comment → helps Anthropic improve Copilot

---
