# Multi-stage build for Saruman AI application
# Stage 1: Build frontend (React with Vite + Tailwind v4)
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY vite.config.js ./
COPY src ./src
COPY public ./public
COPY index.html ./
RUN npm run build

# Stage 2: Runtime - Python Flask backend with built frontend
FROM python:3.12-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY app.py config.py ./
COPY services/ ./services/
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 5000

ENV HOST=0.0.0.0
ENV PORT=5000
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/levels || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--threads", "4", "--timeout", "140", "--keep-alive", "75", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
