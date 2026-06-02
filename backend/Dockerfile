# syntax=docker/dockerfile:1.7

FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Build dependencies only in builder stage.
RUN apt-get update \
    && apt-get install --yes --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create an isolated virtual environment for dependencies.
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies first for better layer caching.
COPY requirements.txt ./
RUN pip install --upgrade pip \
    && pip install -r requirements.txt


FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    APP_ENV=production \
    APP_DEBUG=false \
    HOST=0.0.0.0 \
    PORT=8000

WORKDIR /app

# Create an unprivileged user and group for runtime security.
RUN addgroup --system app \
    && adduser --system --ingroup app --home /home/app app

# Copy pre-built virtual environment and application code.
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY app ./app
COPY alembic ./alembic
COPY alembic.ini ./alembic.ini

# Ensure the app user owns runtime files.
RUN chown -R app:app /app
USER app

EXPOSE 8000

# Run with a single Uvicorn process; scale replicas at orchestrator level.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
