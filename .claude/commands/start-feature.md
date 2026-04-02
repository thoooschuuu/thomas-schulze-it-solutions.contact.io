# Start a new feature branch

Ensures a clean starting point from the latest main and creates a correctly named feature branch.

## Steps

### 1. Confirm clean state

```bash
git status
```

If there are uncommitted changes, stop and ask the user how to handle them before continuing.

### 2. Switch to main and pull latest

```bash
git checkout main && git pull
```

### 3. Gather branch info

Ask the user:
1. **Is this work related to a GitHub Issue?** If yes, what is the issue number?
2. **Short branch description** — lowercase, hyphen-separated (e.g., `add-contact-form-labels`)

### 4. Construct the branch name

- With issue: `feature/123-short-description`
- Without issue: `feature/short-description`

Show the constructed name.

### 5. Create and switch to the branch

```bash
git checkout -b feature/[name]
```

### 6. Confirm

Tell the user the branch is ready and development can begin.

If the branch is linked to a GitHub issue, suggest the next step:

> Branch is ready. Run `/implement-issue <number>` to plan and implement the issue.
