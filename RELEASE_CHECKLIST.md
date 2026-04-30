# Release Checklist

Use this checklist before publishing a FunPlay Skill release.

## 1. Repository Hygiene

- [ ] `git status` only shows intended release changes
- [ ] No local junk is present, such as `.DS_Store`, temp files, or scratch outputs
- [ ] `package.json` version matches the intended release when a version bump is planned
- [ ] `CHANGELOG.md` includes release notes for user-visible changes
- [ ] `README.md` lists all shipped skills and commands

## 2. Validation

- [ ] `npx pnpm install` succeeds from a clean checkout
- [ ] `npx pnpm test` passes
- [ ] `npx pnpm validate:workspace` passes
- [ ] Asset-processing scripts were tested with representative sample inputs
- [ ] Missing-system-tool cases are clear for workflows such as `ffmpeg`

## 3. Skill Review

- [ ] Every `skills/*/SKILL.md` has complete frontmatter
- [ ] Skill names match their directory names
- [ ] New workflows use direct instructional language
- [ ] Runnable examples work as documented
- [ ] README and install docs match the shipped skill layout

## 4. Publish

- [ ] Commit with a short imperative subject
- [ ] Create and push the release tag when applicable
- [ ] Verify GitHub renders README and skill docs correctly
- [ ] Verify installation instructions for Claude Code, Cursor, Codex, OpenCode, and Gemini remain accurate
