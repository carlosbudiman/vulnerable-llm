# Multi-stage build for vulnerable-llm application
# Stage 1: Build frontend (React with Vite)
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY vite.config.js postcss.config.js tailwind.config.js ./
COPY src ./src
COPY public ./public
COPY index.html ./
RUN npm run build

# Stage 2: Runtime - Python Flask backend with built frontend
FROM python:3.12-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy backend application
COPY app.py .

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/dist ./dist

# Expose port
EXPOSE 5000

# Set environment variables for production
ENV HOST=0.0.0.0
ENV PORT=5000
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/api/levels').read()" || exit 1

# Run with gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--threads", "2", "--timeout", "60", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
