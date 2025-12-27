# GearGuard — The Ultimate Maintenance Tracker ✅

**GearGuard** is a maintenance and equipment management web app for teams to track equipment, schedule and log maintenance, view reports, and manage work centers and teams.

---

## 🔧 Key Features

- Equipment inventory and detailed pages (`/equipment`)
- Maintenance scheduling, tasks and history (`/maintenance`)
- Calendar view for scheduled work and reminders (`/calendar`)
- Reports and analytics (`/reports`)
- Teams, work centers and vendor management (`/teams`, `/work-centers`, `/vendors`)
- Authentication and simple role handling (`/login`)
- Reusable UI primitives and design system in `/components/ui`

---

## 🧰 Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** FastAPI (ASGI), Python
- **DB:** PostgreSQL
- **UI primitives:** Radix UI, react-hook-form, zod
- **Charts:** Recharts
- **Tooling:** npm, ESLint, Prettier

---

## 🚀 Quick start

Follow these steps to run the app locally (frontend + backend).

### 1) Frontend (Next.js)

Prerequisites: Node.js 18+, npm (recommended)

```bash
# from repository root
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

Linting:

```bash
npm run lint
```

> Tip: If you prefer `pnpm` or `yarn`, replace the `npm` commands accordingly.

### 2) Backend (FastAPI)

Prerequisites: Python 3.10+ (or supported), PostgreSQL

```bash
# from repository root
cd backend
python -m venv env
# Windows PowerShell
.\env\Scripts\Activate.ps1
# or on CMD: .\env\Scripts\activate.bat
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# API available at http://localhost:8000
```

Database and migrations

- See `backend/POSTGRES_SETUP.md` for PostgreSQL setup and connection details.
- Add database credentials and other secrets in a local `.env` (do not commit `.env`).

---

## 🧪 Tests & Quality

- Frontend: run unit and lint checks with `npm run lint` and your preferred test command if configured.
- Backend: run `pytest` from the `backend` directory (if tests are present).

---

## 🛠️ Development notes

- The Next.js App Router lives in `/frontend/app` — add pages/routes there.
- Shared design primitives are implemented under `/frontend/components/ui`.
- Backend API endpoints are in `backend/app/api` (versioned under `v1`).
- Use `backend/POSTGRES_SETUP.md` and `frontend/API_SETUP.md` for integration details and environment variables.

---

## 🚢 Deployment

- Frontend: Recommended to deploy on Vercel or any platform that supports Next.js.
- Backend: Deploy to any ASGI-capable host (e.g., Uvicorn/Gunicorn on Linux hosts, or containerized with Docker).

---

## 🤝 Contributing

Thanks for your interest! To contribute:

1. Fork the repo and create a new branch for your feature/fix.
2. Run and test locally (both frontend and backend if relevant).
3. Open a PR with a clear description and testing steps.
4. Run linters and ensure tests pass.

Please open an issue first for larger changes.

---

## 👥 Contributors

- Shivam Bhatt
- Shreyansh Joshi
- Ronak Javiya
- Maitri Joshi

If you'd like to add yourself to this list, open a PR with your name and contributions.
