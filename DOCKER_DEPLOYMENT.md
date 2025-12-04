# Docker Deployment Guide

## Prerequisites
- Docker and Docker Compose installed on your VPS
- Google Gemini API key

## Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd vulnerable-llm
```

### 2. Create `.env` file
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
nano .env
```

### 3. Build and run with Docker Compose
```bash
docker-compose up -d
```

The application will be accessible at:
- `http://your-domain.com` (or `http://your-vps-ip`)
- API endpoints available at `http://your-domain.com/api/`

### 4. View logs
```bash
docker-compose logs -f app
```

### 5. Stop the application
```bash
docker-compose down
```

## Configuration

### Environment Variables
Edit `.env` file with these options:

- `GEMINI_API_KEY` (required): Your Google Gemini API key
- `FLASK_ENV`: Set to `production` for deployment (default: production)
- `FLASK_DEBUG`: Set to `False` for production (default: False)

### Port Configuration
By default, the app runs on port 80. To change it, edit `docker-compose.yml`:
```yaml
ports:
  - "0.0.0.0:8080:5000"  # Changes to port 8080
```

## SSL/HTTPS Setup with Nginx Reverse Proxy

### 1. Stop the current setup
```bash
docker-compose down
```

### 2. Create `docker-compose.yml` with Nginx:
```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: vulnerable-llm
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - HOST=0.0.0.0
      - PORT=5000
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:latest
    container_name: nginx-reverse-proxy
    ports:
      - "0.0.0.0:80:80"
      - "0.0.0.0:443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### 3. Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name your-domain.com;
        
        location / {
            proxy_pass http://app:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## Troubleshooting

### Port already in use
```bash
# Find what's using port 80
sudo lsof -i :80
# Use a different port in docker-compose.yml
```

### API key not working
- Verify the `GEMINI_API_KEY` in `.env`
- Check logs: `docker-compose logs app`

### Application not responding
```bash
# Check if container is running
docker-compose ps

# Check logs for errors
docker-compose logs app

# Restart
docker-compose restart app
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

## Production Best Practices

1. **Never commit `.env`**: Keep API keys private
2. **Use strong passwords**: If adding authentication
3. **Enable HTTPS**: Use Let's Encrypt with Nginx or Traefik
4. **Monitor logs**: Set up log rotation or monitoring
5. **Resource limits**: Add memory/CPU limits in docker-compose.yml:
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
           reservations:
             cpus: '0.5'
             memory: 256M
   ```

## Scaling

For multiple instances with load balancing:

```yaml
services:
  app:
    # ... config ...
    deploy:
      replicas: 3
```

Then use Nginx or another load balancer to distribute traffic.
