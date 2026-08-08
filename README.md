# Antonio Colomba Site

This is the single source repository for `acolomba.com`.

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

## Custom Domain

GitHub Pages serves the site directly at `https://acolomba.com/`. The repository's `CNAME` file sets the canonical domain, and Namecheap DNS points the apex and `www` host to GitHub Pages:

| Type | Host | Value |
| --- | --- | --- |
| A Record | `@` | `185.199.108.153` |
| A Record | `@` | `185.199.109.153` |
| A Record | `@` | `185.199.110.153` |
| A Record | `@` | `185.199.111.153` |
| CNAME Record | `www` | `getantonio.github.io` |

GitHub Pages provides HTTPS for the canonical domain and redirects `www.acolomba.com` to it.

## Publish Workflow

Use normal Git from this repo:

```bash
git status
git add -- <changed paths>
git diff --cached --check
git diff --cached
git commit -m "Describe the site change"
git push origin main
```

No separate deploy repository or publish-copy step is needed.

After site updates, push `main` to `origin` so `acolomba.com` receives the change through GitHub Pages. If push is rejected with "fetch first", run `git fetch origin main`, rebase or otherwise integrate `origin/main`, then push again after confirming the site changes are still present.

## Rebuild Resume Downloads

The build scripts write the current resume downloads in `docs/`.

```bash
python3 scripts/build_fast_resume_docx.py
python3 scripts/build_modern_resume_docx.py
node scripts/build_main_resume_pdf.mjs
node scripts/build_retouching_resume_pdf.mjs
```
