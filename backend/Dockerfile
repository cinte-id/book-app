# Stage 1: Builder — install deps in isolation so runtime image stays lean
FROM python:3.11-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev python3-dev build-essential pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime — copy only installed packages, not build toolchain
FROM python:3.11-slim AS runtime
WORKDIR /app

# Only runtime system lib needed (libpq for potential DB use)
RUN apt-get update && apt-get install -y libpq-dev curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY . .

ENV TZ=Asia/Jakarta

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5001/api/test || exit 1

CMD ["python", "app.py"]
