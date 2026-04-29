# Instructions for Claude Code - Chuchurex

## 🚀 Automatic Deploy

### Frontend (HTML/CSS/JS in `frontend/`)

**SINGLE METHOD:** Git push to GitHub → Cloudflare Pages deploys automatically

```bash
git add frontend/
git commit -m "change description"
git push origin main
```

**Cloudflare Pages detects the push and deploys in ~1 minute**

### Backend (Python/Node in root and `pdf-generator/`)

**SINGLE METHOD:** Fly.io

```bash
fly deploy
```

Build desde `Dockerfile`, sube imagen y reinicia maquinas. Config en `fly.toml`.

---

## ❌ NEVER DO FOR FRONTEND

- DON'T use `rsync` for frontend
- DON'T use `scp` for frontend
- DON'T use `ssh` for frontend
- DON'T try to upload files manually to the server

---

## ✅ Correct Workflow

1. User requests frontend change → Make changes → `git push origin main` → Done
2. User requests backend change → Make changes → `fly deploy` → Done

---

## 📋 Summary

| Change in | Deploy with | Hosting |
|-----------|------------|---------|
| `frontend/` | `git push origin main` | Cloudflare Pages |
| `app_unified.py`, `pdf-generator/`, `Dockerfile` | `fly deploy` | Fly.io |

---

## 🎯 Critical Rules

1. **ALWAYS** read `DEPLOY.md` if you have doubts about deploy
2. **NEVER** try SSH/rsync for frontend
3. **ALWAYS** use git push for frontend
4. **ALWAYS** use `fly deploy` for backend
5. **DON'T ASK** "how do I publish this?" - follow this document
6. **DEPLOY AUTOMATICALLY** when user says "publish", "deploy", "push to production"

---

## 📝 Real Example

```bash
# User: "Add a button to the header and publish it"

# 1. Edit frontend/index.html
# 2. Without asking, execute:
git add frontend/index.html
git commit -m "feat: add button to header"
git push origin main

# 3. Confirm to user:
# "✅ Changes published. Automatic deploy on Cloudflare Pages (~1 min)"
```

---

**Last updated:** 2026-01-12
**Version:** 2.0 - Explicit instructions for Claude Code
