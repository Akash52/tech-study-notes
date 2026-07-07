---

# 📝 Asking Copilot to Create a Pull Request — Quick Notes

## Where You Can Trigger It From
| Entry Point | How |
|---|---|
| **GitHub Issues** | Assign "Copilot" as the issue assignee |
| **Agents tab / panel** | Type a prompt → click Send |
| **GitHub Dashboard** | Click "Task" button → type prompt |
| **GitHub.com Chat** | Type `/task <description>` |
| **VS Code** | Type prompt → click "Delegate to cloud agent" button |
| **JetBrains IDE** | Type prompt → click "Delegate to Cloud Agent" |
| **Eclipse** | Type prompt → click delegate icon → select repo |
| **Visual Studio 2026** | Enable in Tools > Options > GitHub → click delegate button |
| **GitHub Mobile** | Tap ✦ icon → type prompt → Accept |
| **GitHub CLI** | `gh agent-task create "your prompt"` *(v2.80.0+)* |
| **GitHub MCP Server** | Use `create_pull_request_with_copilot` tool in any MCP-enabled IDE |
| **Raycast** | "Create Task" command → fill prompt + repo |
| **New Repository page** | Fill "Prompt" field when creating repo |

---

## Assigning an Issue to Copilot (GitHub.com)
1. Go to **Issues** → open the issue
2. Click **Assignees** → select **Copilot**
3. (Optional) Add a prompt with extra instructions, constraints, or coding preferences
4. (Optional) Change the target repo and base branch
5. (Optional) Select a custom agent or AI model
6. Submit → Copilot starts working in the background

> ⚠️ After assigning, Copilot won't see new comments on the issue. Add follow-ups in the **PR comments** instead.

---

## Via GitHub API
Both **GraphQL** and **REST** are supported. Key optional parameters:

| Parameter | Purpose |
|---|---|
| `target_repo` | Repo where Copilot works |
| `base_branch` | Branch to branch off from |
| `custom_instructions` | Extra guidance for Copilot |
| `custom_agent` | Use a specific custom agent |
| `model` | Select the AI model |

**REST example (add assignee):**
```bash
gh api --method POST /repos/OWNER/REPO/issues/ISSUE_NUMBER/assignees \
  --input - <<< '{"assignees": ["copilot-swe-agent[bot]"], "agent_assignment": {...}}'
```

---

## GitHub CLI (Quick Reference)
```bash
gh agent-task create "Your prompt here"   # basic
gh agent-task create "prompt" --base main  # specify branch
gh agent-task create "prompt" --repo owner/repo  # specify repo
gh agent-task create "prompt" --follow    # watch logs live
```

---

## What Happens After Triggering
1. Copilot starts a new session
2. Works on the task autonomously (runs in GitHub Actions)
3. Pushes commits to a new branch / draft PR
4. **Adds you as a reviewer** when done → you get notified

---

## Monitoring Progress
- **Agents panel / page**: `github.com/copilot/agents`
- **VS Code**: via Copilot Chat sidebar
- **GitHub CLI**: `gh agent-task list`

---

Share the next link whenever you're ready! 🚀
