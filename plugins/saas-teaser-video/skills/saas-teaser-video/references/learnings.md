# Learnings — feedback-driven improvements

PER-USER FILE — this log belongs to whoever runs the skill. It ships empty; your own feedback fills it over time. Don't copy entries between machines when redistributing the skill — reset the Entries section to "(none yet)" before sharing.

Append-only log of user feedback distilled into reusable rules. Read this file at the START of every run (Phase 1) and apply every `promoted` entry as if it were written in SKILL.md. Append at the END of a run whenever the user gave feedback or requested revisions.

## Entry format

```
## YYYY-MM-DD — <product / video>
Feedback (verbatim gist): "<what the user actually said/changed>"
Learning (generalized): <rule that would have prevented the revision>
Scope: all | icp:<row> | format:<16:9|9:16>
Status: candidate | promoted
```

## Rules for writing entries

- Generalize: "user wanted Acme's logo bigger" → NOT a learning. "CTA logo at 48px read as timid at 1080p; 64px landed" → learning.
- One-off brand preferences stay in that project's files, not here.
- Dedupe before appending — same lesson already logged? Bump it instead: add date, and if now seen 2+ times, change Status to `promoted` and ALSO edit the matching rule in SKILL.md (or scene-library/patterns) so the main flow carries it. Note in the entry which file was updated.
- Contradicting entries: newest wins; mark the old one `superseded`.
- Keep entries ≤ 5 lines. This file is loaded every run — bloat here is a tax on every future video.

## Entries

(none yet)
