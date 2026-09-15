# SprintHost FTP Deploy Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore automatic deployment of the successful Astro build to SprintHost after every push to `main`.

**Architecture:** Keep the existing build, artifact, deploy, and IndexNow jobs unchanged. Replace the unsupported explicit FTPS connection with an explicit ordinary FTP connection matching the working local `sk-rosa` GitHub Actions configuration, then make the deployment documentation describe the actual transport and its security tradeoff.

**Tech Stack:** GitHub Actions, `SamKirkland/FTP-Deploy-Action@v4.3.5`, Astro, Node.js 24, SprintHost FTP

**Spec:** `docs/superpowers/specs/2026-09-15-sprinthost-ftp-deploy-design.md`

## Global Constraints

- The canonical production domain remains `https://truetell-retail.ru`.
- Deployment remains limited to successful non-pull-request runs on `main`.
- Existing repository Secrets remain `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, and `FTP_REMOTE_PATH`.
- `dangerous-clean-slate` remains `false`.
- Do not change the working CI or IndexNow flow.
- Ordinary FTP is accepted for parity with the working `sk-rosa` workflow even though it does not encrypt credentials or files in transit.

---

### Task 1: Use the SprintHost-compatible FTP transport

**Files:**
- Modify: `.github/workflows/deploy.yml`
- Modify: `docs/deployment.md`

**Interfaces:**
- Consumes: GitHub repository Secrets `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, and `FTP_REMOTE_PATH`; build artifact named `site` containing `dist/`.
- Produces: An FTP deployment to `FTP_REMOTE_PATH` after a successful `main` build, followed by the existing `indexnow` job.

- [ ] **Step 1: Record the failing configuration evidence**

Run:

```sh
rg -n -C 3 "protocol: ftps|uses: SamKirkland/FTP-Deploy-Action" .github/workflows/deploy.yml
rg -n "FTPS|FTP" docs/deployment.md
```

Expected: the workflow contains `protocol: ftps`, while the documentation says explicit FTPS is used; this matches the failed run error `FTPError: 500 This security scheme is not implemented` supplied in the task.

- [ ] **Step 2: Confirm the working reference uses ordinary FTP**

Run:

```sh
rg -n -C 5 "uses: SamKirkland/FTP-Deploy-Action" /Users/ivan/sk-rosa/.github/workflows/deploy.yml
```

Expected: the `sk-rosa` action has the FTP server, username, password, local directory, and server directory inputs but no `protocol` input, so the action uses its default `ftp` transport.

- [ ] **Step 3: Apply the minimal workflow fix**

Change the upload inputs in `.github/workflows/deploy.yml` from:

```yaml
          protocol: ftps
```

to:

```yaml
          protocol: ftp
```

Do not change any other workflow input, trigger, job dependency, or condition.

- [ ] **Step 4: Correct the deployment documentation**

In `docs/deployment.md`, replace the statement that explicit FTPS is used with this description:

```markdown
Используется обычный FTP на стандартном порту 21, как в рабочем workflow `sk-rosa`: SprintHost отклоняет explicit FTPS ошибкой `500 This security scheme is not implemented`. FTP не шифрует логин, пароль и файлы при передаче; доступ ограничен отдельными GitHub Secrets и каталогом сайта из `FTP_REMOTE_PATH`.
```

Keep the existing remote-path warning and the rest of the operational documentation intact.

- [ ] **Step 5: Inspect the exact change**

Run:

```sh
git diff --check
git diff -- .github/workflows/deploy.yml docs/deployment.md
```

Expected: no whitespace errors; the diff contains only the FTPS-to-FTP workflow change and the matching documentation correction.

- [ ] **Step 6: Run the repository tests**

Run:

```sh
node --test scripts/*.test.mjs
```

Expected: all Node test files pass.

- [ ] **Step 7: Run lint**

Run:

```sh
npm run lint
```

Expected: ESLint exits successfully.

- [ ] **Step 8: Build the production site**

Run:

```sh
npm run build
```

Expected: Astro creates `dist/` successfully for `https://truetell-retail.ru`.

- [ ] **Step 9: Validate deployment metadata and output**

Run:

```sh
node scripts/indexnow.mjs --check
```

Expected: sitemap, canonical URLs, robots rules, and the IndexNow verification key pass validation.

- [ ] **Step 10: Commit the implementation**

```sh
git add .github/workflows/deploy.yml docs/deployment.md
git commit -m "fix: use SprintHost-compatible FTP deploy"
```

- [ ] **Step 11: Verify the live pipeline after push**

Push the new commits to `main`, then open GitHub Actions → **CI and SprintHost deploy**.

Expected: jobs `build`, `deploy`, and `indexnow` all finish successfully; `https://truetell-retail.ru/` serves the deployed Astro build over HTTPS. If `deploy` fails, preserve its complete FTP error log before changing another connection setting.
