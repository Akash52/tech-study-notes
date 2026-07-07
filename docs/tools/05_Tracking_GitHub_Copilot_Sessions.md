---

# 📋 Tracking GitHub Copilot Sessions

**Source:** [GitHub Docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/track-copilot-sessions)

---

## 🔑 Key Concept
Copilot works **autonomously in the background** after you assign it a task. You can monitor, steer, or stop it from multiple places.

---

## 📍 Where to Track Sessions

| Tool | How |
|---|---|
| **Agents Tab** | Go to any GitHub page → click agents panel icon → **View all** |
| **GitHub CLI** | `gh agent-task list` / `gh agent-task view --repo owner/repo 123` |
| **VS Code** | GitHub Pull Requests extension → **GitHub** sidebar button |
| **JetBrains** | **GitHub Cloud Agent Jobs** button in sidebar |
| **Eclipse** | Top-right icon in chat window → **Open Job List** |
| **GitHub Mobile** | Home → Agents section → **Agent Tasks** |
| **Raycast** | Install Copilot extension → search "Copilot" → **View Tasks** |

---

## 📄 Session Logs
- View Copilot's **internal monologue** + tools it used
- Available in GitHub, VS Code, or Raycast
- Copilot can run **automated tests & linters** before pushing changes

---

## 📝 Commit Traits
- Authored by **Copilot**, with you as co-author
- Each commit message has a **link to session logs**
- Commits are **signed & verified** on GitHub

---

## 🎯 Steering a Session
1. Open Agents Tab → select the task
2. Type in the prompt box while Copilot is still working
3. Copilot picks up your input after finishing its current step
> ⚠️ Each steering message costs **1 premium request**

---

## 🛑 Stopping a Session
- Click **Stop session** in the session log viewer
- Use when you made a mistake in the task description or the change is no longer needed

---
