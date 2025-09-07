# Product Requirements Document (PRD)

**Product Name**: PromptVault
**Tagline**: A self‑hosted, privacy‑friendly vault for AI prompts with tags, versions, and team sharing.

---

## 1. Vision & Goals

PromptVault is designed to be the go‑to open source solution for storing, organizing, and sharing AI prompts securely. The goal is to provide individuals and small teams with a lightweight, self‑hosted alternative to commercial SaaS prompt libraries.

**Key Goals:**

* Centralize and organize prompts for personal and team use
* Provide fast search and tagging
* Preserve version history of evolving prompts
* Enable optional sharing (team or public links)
* Keep it simple: easy to install, easy to back up, easy to contribute
* Deliver as a **single Docker container** for maximum simplicity

---

## 2. Target Audience & Personas

* **AI Enthusiasts / Developers**: Want to catalog and refine prompts they test across different models.
* **Small Teams / Startups**: Need a shared library of effective prompts for customer support, marketing, or content.
* **Researchers / Students**: Want versioned storage of prompt experiments.
* **Privacy‑minded users**: Prefer self‑hosted over SaaS for data control.

---

## 3. User Stories (MVP)

1. *As a user*, I can register/login securely so my prompts are private to me.
2. *As a user*, I can create, edit, and delete prompts.
3. *As a user*, I can tag prompts and filter/search by tag.
4. *As a user*, I can update a prompt and keep older versions accessible.
5. *As a user*, I can rate prompts and see which are most effective.
6. *As a user*, I can export/import my prompts to/from JSON.
7. *As a user*, I can share a prompt with a public link.

---

## 4. Scope & Features

### MVP Scope

* Authentication (JWT, local accounts)
* Prompt CRUD (title, body, variables, notes, model hints)
* Tagging system
* Search (full‑text)
* Auto‑versioning on update
* Ratings (1–5 stars)
* Sharing options (private, team, public)
* Import/Export (JSON)
* Dockerized as **one container** with backend + frontend bundled
* Automated **GitHub workflow** for build & push to GHCR

### Out of Scope (MVP)

* Prompt execution or model integrations
* Role‑based permissions beyond Admin/User
* Advanced analytics
* Multi‑tenant organizations

---

## 5. Success Criteria / Acceptance

* **Setup**: User can run PromptVault locally with Docker in under 5 minutes.
* **Storage**: Prompts persist in SQLite database, backed by Docker volume.
* **Usability**: User can add a prompt, tag it, update it, see version history, and export it.
* **Sharing**: User can generate a public read‑only link to a prompt.
* **Search**: Queries return relevant results by title, body, and tags.
* **Deployment**: Official container image automatically built & published via GitHub Actions to GHCR.

---

## 6. Technical Overview

* **Backend**: TypeScript (NestJS/Express) + Prisma ORM
* **DB**: SQLite with FTS5 (full‑text search)
* **Frontend**: React + Vite + Tailwind (shadcn/ui)
* **Containerization**: Single Docker container with backend + frontend bundled
* **CI/CD**: GitHub Actions workflow builds & pushes Docker image to **ghcr.io**
* **License**: AGPL‑3.0 (preferred) or MIT (for adoption)

---

## 7. Roadmap

**Milestone 1 (MVP)**

* Auth
* Prompt CRUD
* Tags + Search
* Auto‑versioning
* Ratings
* Import/Export (JSON)
* Public sharing
* Docker container build & GHCR publishing

**Milestone 2**

* YAML import/export
* Team visibility (simple member list)
* Diff viewer for versions
* Collections (folders)

**Milestone 3**

* Postgres option
* Extensions (VS Code / browser)
* CLI client
* API tokens

---

## 8. Risks & Mitigations

* **Name Conflicts**: Avoid overlap with existing SaaS (PromptBase) → using PromptVault.
* **Complexity Creep**: Focus MVP on storage, not execution or analytics.
* **Adoption**: Keep setup dead simple (single Docker container, GHCR image).

---

## 9. Next Steps

1. Scaffold repo (backend + frontend in one container).
2. Implement Auth + Prompt CRUD.
3. Add tags + search.
4. Build minimal UI for list + editor.
5. Add GitHub Actions workflow for GHCR publish.
6. Release v0.1.0 (alpha).
