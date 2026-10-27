# Order and Inventory Anomaly Detection System

Sprint 1 establishes the shared development environment. It includes a React page, FastAPI health endpoint, SQLAlchemy connection, and persistent SQLite storage. Business features and anomaly models are not implemented yet.

## Start

Install and start Docker Desktop, then run from this folder:

```sh
docker compose up --build
```

- Frontend: http://localhost:5173
- API documentation: http://localhost:8000/docs
- Health endpoint: http://localhost:8000/api/health

The page should show `API: ok · Database: connected`.

## Everyday development

Edit React files in `frontend/src` and Python files in `backend/app`; running containers reload automatically. Each teammate runs their own copy and local database. Containers do not need to be shared.

After changing Python dependencies, rebuild the backend. After changing frontend dependencies, update and commit `package-lock.json` with npm install, then rebuild the frontend. The lockfile keeps frontend installs consistent. Python dependencies currently use bounded version ranges; add a resolved lock before release.

```sh
docker compose up --build -d
```

Stop with `docker compose down`. The SQLite volume survives this command. `docker compose down -v` deletes the local database; only use it for an intentional reset.

Only source folders are mounted, so container dependencies are not overwritten by local folders. Vite forwards `/api` to the backend inside Docker. Run the frontend through Compose with this configuration.

## Team Git workflow

Choose a shared Git host and create a repository. Push this starter once; the other four teammates clone it. Never commit database files, secrets, node_modules, or virtual environments.

For each task: pull main, create a branch such as `feat/inventory-list`, implement one small change, validate it locally, push, and open a pull request. Ask another teammate to review before merging. Keep main runnable. Coordinate shared API schemas before implementing screens.

No remote repository is configured by this starter.

## Database evolution

SQLite is suitable for this initial local setup. Add Alembic migrations when introducing domain tables; do not rely on create_all to update existing tables. Review database requirements before multi-user deployment.

See `docs/SPRINT_1.md` for the first sprint plan and acceptance checklist.
