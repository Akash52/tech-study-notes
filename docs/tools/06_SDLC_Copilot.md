# Complete Interview Preparation — GitHub Copilot Features

---

## 📌 How to Use This Guide
> Each question has: **Question → Scenario → How to Answer → Key Points to Mention**

---

# SECTION 1 — BASIC LEVEL QUESTIONS

---

### Q1: "Have you used GitHub Copilot in a real project? How?"

**Scenario:**
> You joined a team building an e-commerce app. Copilot kept suggesting wrong patterns — using TypeORM instead of your team's Drizzle ORM, wrong error handling, wrong folder structure.

**How to Answer:**
> "Yes. When I joined the project, Copilot didn't know our conventions at all. It kept suggesting TypeORM but we use Drizzle ORM. It used try-catch everywhere but we use Result types for error handling. So I set up Custom Instructions that told Copilot our exact tech stack and patterns. After that, every suggestion was aligned with our project style and PR rejections dropped significantly."

**Key Points:**
- Mention a specific wrong suggestion Copilot made
- Mention how you fixed it
- Mention the result/impact

---

### Q2: "What problem do Custom Instructions solve?"

**Scenario:**
> You are a senior dev. Every week in PR reviews you write the same comments — "don't use console.log, use our logger", "API responses must follow our format", "use Bun not npm".

**How to Answer:**
> "Custom Instructions solve the repetition problem. In my last project, I noticed I was leaving the same 3 PR comments every single week. That told me Copilot didn't know our rules. So I wrote those rules once in a Custom Instructions file. After that, Copilot followed our logger, our API format, and our package manager automatically. I basically converted my repeated PR comments into a permanent rule file."

**Key Points:**
- The trigger is repeated corrections
- Instructions live in the repo like code
- Real impact — fewer wrong suggestions, faster reviews

---

### Q3: "How do you know WHAT to put in Custom Instructions?"

**Scenario:**
> Your team has been using Copilot for 2 months. You notice developers are still correcting the same things manually.

**How to Answer:**
> "I use a simple trick — I look at the last 5 PR review comments from the team. Any feedback that appears more than once belongs in Custom Instructions. For example, in one project we kept commenting — always validate inputs using Zod, never use any type in TypeScript, always handle empty states in UI components. All three became instructions. Another approach is asking new developers what confused them in the first week — if it confuses humans, it will confuse Copilot too."

**Key Points:**
- Repeated PR comments = instruction candidates
- What confuses new devs = instruction candidates
- Keep updating them as conventions evolve

---

# SECTION 2 — INTERMEDIATE LEVEL QUESTIONS

---

### Q4: "Can you give me a real example of when you would create an Agent?"

**Scenario:**
> Your team is building a healthcare app. Every time someone needs a PR reviewed, they ask you — the senior dev — to manually check security, HIPAA compliance, naming conventions, test coverage.

**How to Answer:**
> "In a healthcare project, I was the only one reviewing PRs for security and compliance. It was taking 2-3 hours per PR. So I created a PR Reviewer Agent specifically trained on our checklist — it checked for hardcoded patient data, missing input validation, uncovered critical paths, and naming conventions. Developers could run it before even requesting my review. My actual review time dropped to 30 minutes because the obvious issues were already caught. The Agent basically did the first pass every time."

**Key Points:**
- Agent saved measurable time
- Had a specific job/role
- Consistent — didn't miss steps like humans do

---

### Q5: "What is the difference between an Agent and a Skill in a real project?"

**Scenario:**
> You are building a food delivery app. Every new feature needs the same files created in the same structure.

**How to Answer:**
> "In our food delivery app, I created a Feature Builder Agent — its job was to scaffold new features. But the Agent alone wasn't enough. I also created a Skill that defined exactly HOW to scaffold — Step 1 create the controller, Step 2 create the service, Step 3 create the repository, Step 4 create DTOs, Step 5 create test files. The Agent knew its job was feature building. The Skill told it exactly how to do that job. Without the Skill, the Agent would scaffold differently every time. Together, every new feature — whether it was Orders, Payments or Reviews — came out with identical structure."

**Key Points:**
- Agent = the role, Skill = the procedure
- Without Skill, Agent is inconsistent
- Together they produce predictable output every time

---

### Q6: "When would you use a Hook? Give a real scenario."

**Scenario:**
> Your team is using Copilot in agent mode. A developer accidentally lets Copilot generate code with a hardcoded AWS secret key. It gets committed to the repo.

**How to Answer:**
> "This actually happened in a project I know of — a secret key got committed because the developer trusted AI-generated code without checking. After that incident, we set up a Secret Scanning Hook. Every time Copilot edited a file, the hook automatically scanned for patterns matching API keys, tokens, and .env values. If found, it blocked the edit completely before it could be saved. We also added a hook to prevent rm -rf commands in agent mode after Copilot once tried to clean up files it shouldn't have touched. Hooks are basically your safety net for things that would cause incidents."

**Key Points:**
- Hooks are automated — they don't rely on humans remembering
- Give a realistic consequence of NOT having the hook
- Mention specific hooks — secret scanning, command blocklist

---

### Q7: "What are MCP Servers and how did they help you?"

**Scenario:**
> Your team is fixing bugs. Every time there's an error in production, you go to Sentry, copy the stack trace, paste it into Copilot's chat, then ask for help debugging.

**How to Answer:**
> "We were wasting 10-15 minutes per bug just copying error information from Sentry into Copilot. So we set up the Sentry MCP Server. After that, Copilot could pull the stack trace directly from Sentry without us leaving the editor. We just told Copilot — check the latest error for the payment service — and it pulled the full trace, identified the file and line number, and suggested the fix. We also set up the Database MCP so Copilot could inspect our actual schema instead of us describing it. Context switching dropped significantly."

**Key Points:**
- MCP removes copy-pasting between tools
- Give specific tools — Sentry, Database, GitHub, Figma
- Mention time saved or efficiency gained

---

# SECTION 3 — ADVANCED LEVEL QUESTIONS

---

### Q8: "How do you maintain these files as the project grows?"

**Scenario:**
> Your team migrated from REST APIs to GraphQL after 6 months. All your Instructions and Skills still referenced REST patterns.

**How to Answer:**
> "This is where most teams fail. When we migrated to GraphQL, our Instructions still said — always follow REST response format with success, data, error fields. Copilot was generating REST-style responses for GraphQL resolvers. We had to treat the Instructions update as part of the migration task itself — not an afterthought. Now our rule is — whenever a convention changes, updating the relevant Instruction or Skill is part of the PR that makes the change. These files live in the repo, get reviewed like code, and evolve with the project. If you don't do this, the system degrades quietly and Copilot goes back to being a stranger."

**Key Points:**
- Treat instruction files like code — in repo, reviewed in PRs
- Updating them is part of the task, not separate
- Silent degradation is the danger — Copilot goes back to guessing

---

### Q9: "How would you set up Copilot for a brand new team joining a large project?"

**Scenario:**
> 5 new developers are joining a fintech project. The codebase has strict conventions, compliance requirements, and complex patterns.

**How to Answer:**
> "I would start by interviewing the existing senior developers with four questions — what do you keep re-explaining to new joiners? What do you do repeatedly with the same pattern? What mistakes would cause an incident? What tools do you keep switching between? The answers directly map to Instructions, Skills, Hooks and MCPs respectively. For a fintech project specifically, I'd prioritize Hooks first — secret scanning, blocking dangerous commands, protecting CI/CD config files — because the cost of mistakes is highest. Then Instructions for compliance patterns. Then Skills for the most repeated workflows like creating new transaction handlers. MCPs last for database and monitoring tools. I'd start with one from each category, use it for a week, then expand."

**Key Points:**
- Use the 4 questions framework to discover needs
- Prioritize by risk — Hooks first for high-stakes projects
- Start small, iterate — don't build everything on day one

---

### Q10: "How do you measure if your Copilot setup is actually working?"

**Scenario:**
> Your manager asks you to prove that the time spent setting up Agents, Instructions and Hooks was worth it.

**How to Answer:**
> "I track three things. First — PR review comments. If Instructions are working, repeated comments about the same issue should drop to near zero within 2 weeks. Second — time to scaffold a feature. Before Skills, creating a new module took 45 minutes of manual file creation. After, it takes under 5 minutes. Third — incidents from AI-generated code. Before Hooks, we had 2 secret-related incidents in 3 months. After secret scanning hooks, zero. These are concrete numbers I can show a manager. If I can't measure it, I can't prove it's worth maintaining."

**Key Points:**
- Measure PR comment repetition
- Measure time saved on repeated tasks
- Measure incidents prevented by Hooks
- Numbers make the case — not just "it feels better"

---

# 🎯 QUICK REFERENCE CARD

| Question Type | Your Strategy |
|---|---|
| Basic questions | Give a specific wrong thing Copilot did + how you fixed it |
| Agent vs Skill | Always use the Doctor + Surgery Procedure analogy |
| Hooks | Always mention a real consequence of NOT having one |
| MCPs | Always mention copy-pasting pain before + efficiency after |
| Maintenance | Always say "treat like code, lives in repo, reviewed in PRs" |
| Measurement | Always give 3 concrete metrics |

---

# 💬 POWER PHRASES TO USE IN INTERVIEW

> - *"The trigger for me was repeated PR comments on the same issue"*
> - *"I treat these files like code — they live in the repo and evolve with the project"*
> - *"Hooks are for things where being wrong would cause an incident"*
> - *"MCPs removed the copy-paste tax between tools"*
> - *"Silent degradation is the real danger — Copilot goes back to guessing"*
> - *"I start with one, use it, test it, then pick the next one"*

---

Want me to do a **full mock interview** now where I ask you these questions one by one and give feedback on your answers? 🎯
