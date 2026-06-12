# ===== STAGE 1: Builder =====
FROM python:3.11-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
  libpq-dev \
  python3-dev \
  default-libmysqlclient-dev \
  build-essential \
  pkg-config \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir --default-timeout=1000 -r requirements.txt

# ===== STAGE 2: Runtime =====
FROM python:3.11-slim

# Install only runtime dependencies
RUN apt-get update && apt-get install -y \
  libpq5 \
  curl \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV TZ=Asia/Jakarta \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Create non-root user for security
RUN useradd -m -u 1000 appuser

# Set working directory
WORKDIR /app

# Copy Python dependencies from builder
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local

# Copy application code
COPY --chown=appuser:appuser . .

# Set PATH to include user's local bin
ENV PATH=/home/appuser/.local/bin:$PATH

# Switch to non-root user
USER appuser

# Expose Port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5001/api/health || exit 1

# Start app.py
CMD ["python", "app.py"]