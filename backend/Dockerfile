### This dockerfile adjusted with multistage for reduce container size and security
# Stage 1 : Build image
FROM python:3.11-slim AS builder
WORKDIR /app

# Install dependencies system (build dependencies)
RUN apt-get update && apt-get install -y --no-install-recommends \
  libpq-dev \
  python3-dev \
  default-libmysqlclient-dev \
  build-essential \
  pkg-config \
  cron \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Isolate package build
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# install requirements to workdir
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# STAGE 2: Runner for lightweight image
FROM python:3.11-slim AS runner
WORKDIR /app

# Install runtime library
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    mariadb-client \
    && rm -rf /var/lib/apt/lists/*

# Set Environment Variables
ENV TZ=Asia/Jakarta
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1

# Get python package from builder
COPY --from=builder /opt/venv /opt/venv

# Copy all files
COPY . .

# Set as non-root user and grant access to directory /app
RUN useradd -u 8888 appuser && chown -R appuser:appuser /app
USER appuser

# Expose Port
EXPOSE 5001

# Start app.py
CMD ["python", "app.py"]