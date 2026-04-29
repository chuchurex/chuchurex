# 🤖 CLAUDE CODE: READ THIS FIRST

## Automatic Deploy - Chuchurex

### ⚡ Quick Reference

```bash
# Changes in frontend/ → Git push
git add frontend/
git commit -m "message"
git push origin main

# Changes in backend → Fly.io
fly deploy
```

### 🎯 Golden Rule

**Frontend = Git push | Backend = fly deploy**

### 📚 Complete Documentation

- **Detailed instructions:** `.claude-instructions.md`
- **Complete deploy guide:** `DEPLOY.md`
- **Project summary:** `README.md`

### ⚠️ Common Mistakes to Avoid

❌ Don't use `rsync` or `scp` for frontend
❌ Don't ask "how do I publish this?"

✅ Frontend always → `git push origin main`
✅ Backend always → `fly deploy`
✅ Deploy automatically when user requests it

### 🚀 When User Says:

- "Publish" → Execute appropriate deploy (git push or fly deploy)
- "Deploy" → Execute appropriate deploy
- "Push to production" → Execute appropriate deploy

**DON'T ask how to do it. You already know.**

---

**Hosting:**
- Frontend: Cloudflare Pages (auto-deploy from GitHub)
- Backend: Fly.io (app `chuchurex-api`, region `gru`)

**Infrastructure designed for you to deploy automatically.**
