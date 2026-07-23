# bhargav-skills — Claude Code plugin marketplace

Claude Code skills by Bhargav.

## Install

```
/plugin marketplace add <YOUR_GITHUB_USERNAME>/claude-skills-marketplace
/plugin install saas-teaser-video@bhargav-skills
```

## Plugins

### saas-teaser-video

Make short (20–25s), upbeat, brand-accurate SaaS teaser videos with [Remotion](https://remotion.dev).

- **Research first, never invent** — extracts brand tokens from the live site, frontend code, or media kit
- **Reference-video analysis** — give it YouTube links or local videos; it scene-detects unique shots with ffmpeg and learns pacing/style
- **Full pipeline** — creative brief → storyboard (frame math) → build → still-verification → h264 render
- **Reel psychology** — cold-open word slams, contrast switches, continuous motion, no dead frames
- **Self-improving** — distills your revision feedback into a per-user learnings log applied on every future run

Requirements: Node ≥ 18. The skill installs Remotion, yt-dlp, and headless browser on demand.

Usage: `/saas-teaser-video` then answer the source questions (URL, code path, media kit, references).
