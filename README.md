# Antonio Colomba Site

This is the single source repository for `acolomba.site`.

GitHub Pages serves this repository from the root of `main`, so the live site files live at the repo root:

- `index.html`
- `antonio-colomba-bio.html`
- `antonio-resume.html`
- `antonio-bio.html`
- `Antonio_Colomba_Money_Resume.docx`
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

## Rebuild Resume Downloads

The build scripts write the working DOCX in `docs/` and also refresh the root-level files used by the live site.

```bash
python3 scripts/build_money_resume_docx.py
python3 scripts/build_modern_resume_docx.py
```
