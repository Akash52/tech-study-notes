---

# GitHub Copilot Cloud Agent — Quick Notes

## What is it?
An AI agent that works **autonomously in the background** (like a human dev) to complete coding tasks on GitHub — without you being hands-on.

---

## What it can do
- Research a repository & create an implementation plan
- Fix bugs, add new features, improve test coverage
- Update docs, address technical debt, resolve merge conflicts

---

## How to trigger it
- **Agents panel** on GitHub.com → research, plan, code, then open a PR
- **GitHub Issues** → assign "Copilot" as the issue assignee
- **Existing PR** → comment `@copilot` with instructions
- **VS Code / External tools** (Jira, Slack, Teams, Linear, Azure Boards)

---

## Cloud Agent vs Agent Mode (IDE)
| | Cloud Agent | Agent Mode (IDE) |
|---|---|---|
| Runs on | GitHub Actions (cloud) | Your local machine |
| Entry point | GitHub.com / Issues | IDE (VS Code etc.) |
| Creates PR? | Yes | No |
| Async? | ✅ Works in background | ❌ Synchronous |

---

## Plans Required
- Copilot **Pro**, **Pro+**, **Business**, or **Enterprise**
- Business/Enterprise: admin must enable the policy first

---

## Costs
- Uses **GitHub Actions minutes** + **Copilot premium requests**
- Within monthly allowance = **no extra cost**

---

## Customization Options
| Option | Purpose |
|---|---|
| **Custom Instructions** | Guide Copilot on coding standards & project context |
| **MCP Servers** | Give access to external tools/data sources |
| **Custom Agents** | Specialized agents (e.g. frontend expert, test writer) |
| **Hooks** | Run shell commands at key points (validation, logging, etc.) |
| **Skills** | Enhance ability with scripts & resources |

---

## Limitations
- Can only work on **one repo** at a time
- Only **one branch / one PR** per task
- Does **not** respect content exclusions
- May be **blocked** by branch protection rules (add Copilot as bypass actor)
- Only works with **GitHub-hosted** repositories

---
