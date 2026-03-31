# Handle Copilot PR review comments

Review all open Copilot comments on a pull request, apply valid fixes, respond to invalid ones, and resolve all threads.

## Arguments

Optional: PR number. If not provided, use the current branch's open PR.

## Steps

### 1. Find the PR

```bash
# If no PR number given, detect from current branch
gh pr view --json number,url,headRefName
```

### 2. Fetch all inline review comments

```bash
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments
```

Extract for each comment: `id`, `node_id`, `body`, `path`, `line`, `diff_hunk`.

### 3. Evaluate each comment

For each comment, decide:

**Apply the fix if:**
- The suggestion is technically correct
- It improves correctness, consistency, or robustness
- It catches a real edge case or bug

**Respond (don't apply) if:**
- The suggestion conflicts with an intentional architectural decision documented in CLAUDE.md or `.github/copilot-instructions.md`
- It adds complexity without clear benefit in this codebase
- It's stylistic and the current style is intentional

### 4. Apply valid fixes

Make the code changes. Group all fixes into a single commit:

```bash
git add <files>
git commit -m "fix: address Copilot review comments on <PR title>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

### 5. Reply to invalid comments

For each comment you are NOT applying, post a reply explaining why:

```bash
gh api repos/{owner}/{repo}/pulls/comments/{comment_id}/replies \
  -X POST -f body="<explanation>"
```

### 6. Resolve all threads

First get thread IDs (comment IDs ≠ thread IDs):

```bash
gh api graphql -f query='
{
  repository(owner: "{owner}", name: "{repo}") {
    pullRequest(number: {pr_number}) {
      reviewThreads(first: 20) {
        nodes {
          id
          isResolved
          comments(first: 1) {
            nodes { databaseId }
          }
        }
      }
    }
  }
}'
```

Then resolve each thread:

```bash
gh api graphql -f query='
  mutation($id: ID!) {
    resolveReviewThread(input: {threadId: $id}) {
      thread { isResolved }
    }
  }' -f id="{thread_node_id}"
```

### 7. Confirm

Report back: how many comments were applied, how many responded to, and confirm all threads are resolved.
