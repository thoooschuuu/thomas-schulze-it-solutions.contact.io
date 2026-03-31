#!/usr/bin/env bash
# Check that all HTML pages have consistent nav links.
# Exits non-zero if any page's nav links differ from the reference (index.html).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PAGES=(index.html about.html projects.html contact.html impressum.html datenschutz.html)

# Extract sorted href values from the nav-links block
extract_nav_hrefs() {
  sed -n '/<ul class="nav-links">/,/<\/ul>/p' "$1" \
    | grep -oE 'href="[^"]*"' \
    | sort
}

# Extract sorted href values from footer links
extract_footer_hrefs() {
  sed -n '/<footer/,/<\/footer>/p' "$1" \
    | grep -oE 'href="[^"]*"' \
    | sort
}

ref_nav=""
ref_footer=""
ref_page=""
errors=0

for page in "${PAGES[@]}"; do
  file="$ROOT/$page"
  if [ ! -f "$file" ]; then
    echo "WARN: $page not found, skipping"
    continue
  fi

  nav=$(extract_nav_hrefs "$file")
  footer=$(extract_footer_hrefs "$file")

  if [ -z "$ref_nav" ]; then
    ref_nav="$nav"
    ref_footer="$footer"
    ref_page="$page"
  else
    if [ "$nav" != "$ref_nav" ]; then
      echo "FAIL: Nav links in $page differ from $ref_page"
      diff <(echo "$ref_nav") <(echo "$nav") || true
      errors=$((errors + 1))
    fi
    if [ "$footer" != "$ref_footer" ]; then
      echo "FAIL: Footer links in $page differ from $ref_page"
      diff <(echo "$ref_footer") <(echo "$footer") || true
      errors=$((errors + 1))
    fi
  fi
done

if [ $errors -gt 0 ]; then
  echo "FAIL: $errors sync issue(s) found across HTML files"
  exit 1
fi
echo "OK: Nav and footer links consistent across all ${#PAGES[@]} pages"
