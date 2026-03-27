# Security

## Is it safe to push to GitHub?

Yes, as long as you do NOT publish secrets.

## Never commit

- `.env.local` and local env variants
- API keys (NanoBanana, Google OAuth)
- authentication secrets
- local IDE/tooling folders

## Applied protections

- `.gitignore` excludes `.env*` files
- `.gitignore` excludes `.cursor/`, `.vscode/`, `.idea/`
- local build/cache artifacts stay ignored

## Pre-push checklist

1. Run `git status` and confirm `.env.local` is not staged
2. Confirm `NANOBANANA_API_KEY` is not present in tracked files
3. Ensure only `.env.example` is published
