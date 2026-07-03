# Antonio Colomba Site

This is the single source repository for `acolomba.site`.

GitHub Pages serves this repository from the root of `main`, so the live site files live at the repo root:

- `index.html`
- `antonio-colomba-bio.html`
- `main-resume.html`
- `operations-support-resume.html` (redirect compatibility)
- `fast-resume.html`
- `antonio-resume.html` (legacy compatibility copy)
- `antonio-bio.html`
- `Antonio_Colomba_Main_Resume.pdf`
- `Antonio_Colomba_Operations_Support_Resume.docx`
- `Antonio_Colomba_Fast_Resume.docx`
- `Antonio_Colomba_Modern_Resume.docx`
- `CNAME`

Project notes, drafts, setup docs, and helper scripts live in `docs/`, `scripts/`, `workers/`, and `telegram-endpoint/`.

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

The build scripts write the working DOCX in `docs/` and also refresh the root-level files used by the live site.

```bash
python3 scripts/build_operations_support_resume_docx.py
python3 scripts/build_fast_resume_docx.py
python3 scripts/build_modern_resume_docx.py
node scripts/build_main_resume_pdf.mjs
```
