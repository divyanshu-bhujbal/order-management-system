# Order Management System

Full-stack Order Management System with a React frontend, FastAPI backend, and PostgreSQL database.

## Tech Stack

- Frontend: React + TypeScript + Vite + Nginx
- Backend: FastAPI + SQLAlchemy + Alembic
- Database: PostgreSQL 16
- Orchestration: Docker Compose

## Project Structure

- `frontend/`: React UI (Dashboard, Products, Customers, Orders)
- `backend/`: FastAPI API, DB models, services, migrations
- `docker-compose.yml`: Local full-stack runtime definition

## Quick Start (Docker)

### 1. Set database password for local run

PowerShell:

```powershell
$env:POSTGRES_PASSWORD = "your_local_password"
```

Bash:

```bash
export POSTGRES_PASSWORD="your_local_password"
```

### 2. Start services

```bash
docker compose up -d --build
```

### 3. Open the app

- Frontend: http://localhost
- Backend API docs: http://localhost:8000/docs
- Backend health: http://localhost:8000/api/v1/health

## Database Migrations

Run migrations to latest revision:

```bash
docker compose run --rm backend alembic upgrade head
```

Check current revision:

```bash
docker compose run --rm backend alembic current
```

## Useful Commands

```bash
# Stop services
docker compose down

# Stop services and delete volumes (fresh DB)
docker compose down -v

# View backend logs
docker logs -f oms-backend

# View frontend logs
docker logs -f oms-frontend
```

## Security Notes

- Do not commit real secrets to Git.
- Use environment variables for local credentials.
- Keep `.env` files local only; commit only `.env.example` templates.
- Rotate credentials immediately if a secret is ever pushed.

## Development Notes

- Frontend API calls are routed through Nginx at `/api/*` to backend.
- Backend API base path is `/api/v1`.
- Root frontend route redirects to `/dashboard`.

## License

No license file is currently included. Add one before public distribution if needed.
