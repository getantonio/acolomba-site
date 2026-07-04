# Antonio Colomba Site

This is the single source repository for `acolomba.site`.

GitHub Pages serves this repository from the root of `main`, so the live site files live at the repo root:

- `index.html`
- `resume.html`
- `main-resume.html`
- `retouching-resume.html`
- `fast-resume.html`
- `antonio-resume.html` (legacy compatibility copy)
- `antonio-bio.html`
- `docs/Antonio_Colomba_Main_Resume.pdf`
- `docs/Antonio_Colomba_Retouching_Resume.pdf`
- `docs/Antonio_Colomba_Fast_Resume.docx`
- `docs/Antonio_Colomba_Modern_Resume.docx`
- `CNAME`

Project notes, drafts, setup docs, and helper scripts live in `docs/`, `scripts/`, `workers/`, and `telegram-endpoint/`.

## Domain Redirect

`acolomba.com` uses Namecheap URL Redirect records to forward traffic to `https://acolomba.site/`.

In Namecheap Advanced DNS for `acolomba.com`, add or update:

| Type | Host | Value |
| --- | --- | --- |
| URL Redirect Record | `@` | `https://acolomba.site/` |
| URL Redirect Record | `www` | `https://acolomba.site/` |

Namecheap URL forwarding currently covers HTTP traffic. Direct HTTPS requests to `https://acolomba.com` or `https://www.acolomba.com` require a certificate-backed redirect service if that path needs to work too.

## Publish Workflow

Use normal Git from this repo:

```bash
git status
git add -A
git commit -m "Describe the site change"
git push origin main
```

No separate deploy repository or publish-copy step is needed.

After site updates, push `main` to `origin` so `acolomba.site` receives the change through GitHub Pages. If push is rejected with "fetch first", run `git fetch origin main`, rebase or otherwise integrate `origin/main`, then push again after confirming the site changes are still present.

## Rebuild Resume Downloads

The build scripts write the current resume downloads in `docs/`.

```bash
python3 scripts/build_fast_resume_docx.py
python3 scripts/build_modern_resume_docx.py
node scripts/build_main_resume_pdf.mjs
node scripts/build_retouching_resume_pdf.mjs
```
