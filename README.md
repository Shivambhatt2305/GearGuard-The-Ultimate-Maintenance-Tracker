# GearGuard — The Ultimate Maintenance Tracker ✅

**GearGuard** is a maintenance and equipment management web app built with Next.js, React, TypeScript, and Tailwind CSS. It helps teams track equipment, schedule maintenance, view reports, and organize work centers and teams.

---

## 🔧 Key Features

- Equipment inventory and details (`/equipment`)
- Maintenance scheduling and history (`/maintenance`)
- Calendar view for scheduled tasks (`/calendar`)
- Reports and analytics (`/reports`)
- Teams and work centers management (`/teams`, `/work-centers`)
- Authentication / login (`/login`)
- Reusable UI components and app layout

---

## 🧰 Tech Stack

- **Framework:** Next.js (App Router) 16
- **Language:** TypeScript
- **UI:** Tailwind CSS, Radix UI primitives
- **State & Forms:** react-hook-form, zod
- **Charts:** Recharts
- **Tooling:** pnpm (lockfile included), ESLint

---

## 🚀 Quick start

Prerequisites:
- Node.js 18+ (recommended)
- pnpm (preferred) or npm / yarn

Clone and run locally:

```bash
npm install
npm run dev
# Open http://localhost:3000
```

Build for production:

```bash
npm build
npm start
```

Linting:

```bash
npm run lint
```

> Tip: If you use `pnpm` or `yarn`, replace `npm` with the corresponding command.

---

## 📁 Project structure (high level)

- `/app` — Next.js App Router pages and layouts
- `/components` — Shared UI components and layout pieces
- `/components/ui` — Design system primitives
- `/hooks`, `/lib` — Utilities and hooks
- `/public` — Static assets
- `/styles` — Global styles and Tailwind config

---

## 🛠️ Development notes

- The project uses the Next.js App Router. Add routes under `/app`.
- UI primitives are in `/components/ui` and intended to be reusable across pages.
- Tailwind and PostCSS are configured in the repo.
- Add environment variables in a local `.env` (not committed) as needed for services.

---

## 🤝 Contributing

Contributions are welcome. Please open an issue or a pull request with a clear description of changes and testing steps. Run `npm lint` before submitting.


## 🤝 Contributors

- Shivam Bhatt
- Shreyansh Joshi
- Ronak Javiya
- Maitri Joshi

---

## �📄 License

No license file is included by default. Add a `LICENSE` to define usage permissions (e.g., MIT).

---

If you'd like, I can add a basic `LICENSE` (MIT) and a `CONTRIBUTING.md` template — tell me if you want those. 💡
