# Git Day-to-Day Tricks & Scenarios

A quick reference for common Git situations you'll face regularly.

---

## 1. Move a Commit to Another Branch (Cherry-pick)

**Scenario:** You committed on the wrong branch, or need the same commit on another branch.

```bash
# Step 1: Note the commit hash you want
git log --oneline

# Step 2: Switch to the target branch
git checkout <target-branch>

# Step 3: Cherry-pick the commit
git cherry-pick <commit-hash>
```

> **Tip:** Cherry-pick copies the commit — it stays on the original branch too.

---

## 2. Stash Uncommitted Changes

**Scenario:** You have local changes but need to switch branches quickly without committing.

```bash
# Stash current changes
git stash

# Switch branch, do your work, come back
git checkout <other-branch>
git checkout <original-branch>

# Re-apply stashed changes
git stash pop

# List all stashes
git stash list

# Apply a specific stash (without removing it)
git stash apply stash@{0}

# Drop a stash
git stash drop stash@{0}
```

> **Note:** Stash only works on **uncommitted** changes (staged or unstaged).

---

## 3. Undo the Last Commit (Keep Changes)

**Scenario:** You committed too early and want to edit before committing again.

```bash
# Undo last commit, keep changes staged
git reset --soft HEAD~1

# Undo last commit, keep changes unstaged
git reset --mixed HEAD~1  # (default behavior)

# Undo last commit AND discard all changes (DANGEROUS)
git reset --hard HEAD~1
```

---

## 4. Undo a Commit That's Already Pushed

**Scenario:** The commit is on the remote and you want to reverse it safely.

```bash
# Creates a new "undo" commit — safe for shared branches
git revert <commit-hash>
git push
```

> **Avoid** `git reset --hard` + force push on shared branches — it rewrites history for everyone.

---

## 5. Edit the Last Commit Message

```bash
git commit --amend -m "Your corrected message"

# If already pushed, force push is needed
git push --force
```

---

## 6. Add Forgotten Files to the Last Commit

```bash
git add <forgotten-file>
git commit --amend --no-edit   # keeps the same commit message
git push --force               # if already pushed
```

---

## 7. Squash Multiple Commits into One

**Scenario:** Clean up messy WIP commits before merging a PR.

```bash
# Interactive rebase — last N commits
git rebase -i HEAD~<N>

# In the editor, change 'pick' to 'squash' (or 's') for commits to merge
# Save & close → edit the final commit message
```

---

## 8. Sync Your Branch with Main/Master

```bash
# Option A: Merge (safer, preserves history)
git checkout <your-branch>
git merge main

# Option B: Rebase (cleaner, linear history)
git checkout <your-branch>
git rebase main
```

---

## 9. Delete a Branch

```bash
# Delete local branch
git branch -d <branch-name>       # safe (won't delete if unmerged)
git branch -D <branch-name>       # force delete

# Delete remote branch
git push origin --delete <branch-name>
```

---

## 10. Find Which Commit Introduced a Bug (Bisect)

```bash
git bisect start
git bisect bad                  # current commit is broken
git bisect good <commit-hash>   # last known good commit

# Git checks out middle commits — test each one, then mark:
git bisect good    # or
git bisect bad

# When found, Git tells you the culprit commit
git bisect reset   # go back to HEAD
```

---

## 11. See What Changed in a Commit

```bash
# Show commit details + diff
git show <commit-hash>

# Show only changed file names
git show <commit-hash> --stat
```

---

## 12. Recover a Deleted Branch or Lost Commit

```bash
# Find the lost commit hash
git reflog

# Restore it
git checkout -b <recovered-branch> <commit-hash>
```

---

## 13. Temporarily Ignore a Tracked File's Changes

```bash
# Stop tracking changes locally
git update-index --assume-unchanged <file>

# Resume tracking
git update-index --no-assume-unchanged <file>
```

---

## 14. Pull Without Merge Commit (Rebase Pull)

```bash
git pull --rebase origin main
```

> Set as default: `git config --global pull.rebase true`

---

## 15. Compare Two Branches

```bash
# See commits in branch-B that are NOT in branch-A
git log branch-A..branch-B --oneline

# See file diff between two branches
git diff branch-A..branch-B
```

---

## Quick Reference Cheatsheet

| Situation | Command |
|---|---|
| Copy commit to another branch | `git cherry-pick <hash>` |
| Stash changes | `git stash` / `git stash pop` |
| Undo last commit (keep changes) | `git reset --soft HEAD~1` |
| Undo pushed commit safely | `git revert <hash>` |
| Edit last commit message | `git commit --amend -m "msg"` |
| Squash commits | `git rebase -i HEAD~N` |
| Delete remote branch | `git push origin --delete <branch>` |
| Recover lost commit | `git reflog` |
| See commit changes | `git show <hash>` |
| Sync with main | `git rebase main` |

---

> **Golden Rule:** Use `revert` for public/shared branches. Use `reset` only for local/private branches.
