# ============================================================
# Stage 1: Builder — install build deps & compile packages
# ============================================================
FROM python:3.11-slim AS builder

# Install build dependencies (hanya di stage ini, tidak dibawa ke final)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    python3-dev \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

# Install ke folder khusus agar mudah di-copy ke stage berikutnya
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --prefix=/install -r requirements.txt

# ============================================================
# Stage 2: Final — image ringan tanpa build tools
# ============================================================
FROM python:3.11-slim AS final

# Install hanya runtime dependencies (bukan build tools)
RUN apt-get update && apt-get install -y \
    libpq5 \
    libmariadb3 \
    cron \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV TZ=Asia/Jakarta
ENV PYTHONPATH=/install/lib/python3.11/site-packages

WORKDIR /app

# Copy hasil install pip dari stage builder
COPY --from=builder /install /usr/local

# Copy source code aplikasi
COPY . .

EXPOSE 5001

CMD ["python", "app.py"]