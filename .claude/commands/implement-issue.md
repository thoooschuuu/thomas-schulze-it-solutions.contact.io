# Implement a GitHub Issue

Plan an issue with an expensive model, then implement the plan with a cheaper model, commit atomically, and open a PR when done.

## Arguments

Optional: Issue number. If not provided, ask the user which issue to implement.

---

## Phase 0 — Verify branch state

Before doing anything else, run:

```bash
git status
git branch --show-current
```

- If there are **uncommitted changes**, stop and ask the user how to handle them.
- If the current branch is **`main`**, stop and tell the user to run `/start-feature` first to create a properly named feature branch.

---

## Phase 1 — Gather context

### 1. Resolve the issue number

If an issue number was provided as an argument, use it. Otherwise ask:

> Which GitHub issue should I implement? Please provide the issue number.

### 2. Fetch the issue

```bash
gh issue view <number>
```

Read `CLAUDE.md` for project conventions before planning.

---

## Phase 2 — Plan (use Opus model)

Use the **`opus`** model (via `Agent` tool with `subagent_type: "Plan"`) to produce a detailed implementation plan.

The plan must cover:

- **Goal** — one-sentence summary of what the issue asks for
- **Files to change** — list every file that needs to be created or modified, with a brief reason
- **Step-by-step implementation** — ordered, atomic steps; each step should map to roughly one commit
- **Test strategy** — which existing tests to run and what new tests (if any) to add, referencing the testing rules in `CLAUDE.md`
- **Definition of Done** — checklist the implementer can tick off

Write the plan to `.plan-issue-<number>.md` in the repository root. Do **not** stage or commit this file (it is covered by `.gitignore`).

---

## Phase 3 — Implement (use Sonnet model)

Work through the plan step by step using the **`sonnet`** model.

### Implementation rules

- Follow every convention in `CLAUDE.md` exactly.
- After each logical, self-contained change, create a commit:
  ```
  git add <specific files — never .plan-issue-*.md>
  git commit -m "<type>: <description>"
  ```
- **Never stage or commit `.plan-issue-<number>.md`.**
- If the plan references updating all 6 HTML files or other cross-cutting changes, use parallel agents as described in the "Agent patterns" section of `CLAUDE.md`.

### Commit types

| Prefix | Use when |
|--------|----------|
| `feat:` | New user-visible feature |
| `fix:` | Bug fix |
| `chore:` | Tooling, config, dependency update |
| `test:` | Test-only change |
| `style:` | CSS / visual-only change |
| `refactor:` | Internal restructuring, no behaviour change |

---

## Phase 4 — Definition of Done

Before proceeding to the PR, verify every item:

- [ ] All steps in the plan are implemented
- [ ] Run the full test suite and confirm it is green:
  ```bash
  cd tests && npx playwright test
  ```
- [ ] No `.plan-issue-*.md` file is staged or committed

If any test fails, fix the root cause and re-run before continuing.

---

## Phase 5 — Cleanup & PR

### 1. Delete the plan file

```bash
rm .plan-issue-<number>.md
```

### 2. Open a pull request

```bash
gh pr create \
  --title "<concise title matching the issue — under 70 chars>" \
  --body "$(cat <<'EOF'
## Summary
- <bullet 1>
- <bullet 2>
- <bullet 3>

Closes #<number>

## Test plan
- [ ] Full Playwright suite passes
- [ ] <any manual check specific to this issue>

EOF
)"
```

### 3. Confirm

Report the PR URL to the user.

---

## Phase 6 — Copilot review handoff

### 1. Wait for CI

```bash
gh pr checks --watch
```

Wait until all checks complete. If any check fails, report it to the user and stop.

### 2. Check for Copilot review comments

```bash
gh api repos/{owner}/{repo}/pulls/<number>/comments \
  --jq '[.[] | select(.user.login | startswith("copilot"))] | length'
```

Replace `{owner}` and `{repo}` by first running:

```bash
gh repo view --json owner,name --jq '"\(.owner.login)/\(.name)"'
```

### 3. Handoff

- If Copilot comments are found: tell the user how many were posted and offer to run `/review-pr` immediately to address them.
- If no Copilot comments: confirm CI is green and the PR is ready for human review.
