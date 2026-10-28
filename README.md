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

Source files and Alembic configuration/migrations are mounted, so container dependencies are not overwritten by local folders. Vite forwards `/api` to the backend inside Docker. Run the frontend through Compose with this configuration.

## Team Git workflow

Choose a shared Git host and create a repository. Push this starter once; the other four teammates clone it. Never commit database files, secrets, node_modules, or virtual environments.

For each task: pull main, create a branch such as `feat/inventory-list`, implement one small change, validate it locally, push, and open a pull request. Ask another teammate to review before merging. Keep main runnable. Coordinate shared API schemas before implementing screens.

No remote repository is configured by this starter.

## Database evolution

SQLite is suitable for this initial local setup. SQLAlchemy models and Alembic migrations now provide initial roles, users, products, orders, order items, stock movements, and anomalies tables. The backend applies pending migrations before starting the API. Business workflows are not implemented. Review database requirements before multi-user deployment.

See [資料庫設計與操作說明](docs/DATABASE.md) for schema assumptions, team workflow, and validation commands.
