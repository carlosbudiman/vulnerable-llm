# Multi-stage build for vulnerable-llm application
# Stage 1: Build frontend (React with Vite)
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
COPY public ./public
COPY index.html vite.config.js ./
RUN npm run build

# Stage 2: Runtime - Python Flask backend with built frontend
FROM python:3.12-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements FIRST and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && pip install --no-cache-dir gunicorn

# Copy backend application
COPY app.py .

# Copy built frontend from builder stage (includes dist folder)
COPY --from=frontend-build /app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:5000/api/levels || exit 1

# Expose port
EXPOSE 5000

# Run with gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--threads", "4", "--timeout", "240", "--keep-alive", "5", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
