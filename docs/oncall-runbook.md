# On-Call Runbook — Book App Production Incidents

> For monitoring access: Grafana at `http://<host>:3000` (admin/admin), Prometheus at `http://<host>:9090`

---

## Incident 1: Service Down (Backend Unreachable)

### Symptoms
- Alert: `BackendDown` firing in Grafana/Prometheus
- `probe_success{instance="http://nginx/api/test"} == 0`
- Users getting 502 Bad Gateway or API calls failing

### Triage (do in order)

**1. Verify the alert is real**
```bash
curl -sf http://<host>/api/test
# Expected: {"message": "CORS is working!"}
# If 502/timeout → confirmed down
```

**2. Check container status**
```bash
docker compose ps
# Look for backend state — should be "Up (healthy)"
docker compose logs --tail=50 backend
```

**3. Common causes and fixes**

| Cause | Signal | Fix |
|-------|--------|-----|
| Container crashed (OOM/panic) | `State: Exited (137)` | `docker compose restart backend` |
| books.json corrupt/missing | `FileNotFoundError` in logs | `docker compose exec backend ls /data/` — restore from backup or `echo '{"books":[]}' > /data/books.json` |
| Port conflict | `Address already in use` | `lsof -i :5001` → kill conflicting process |
| Nginx misconfigured | `connect() failed` in nginx logs | `docker compose logs nginx` → check upstream config |

**4. Restart and verify**
```bash
docker compose restart backend
bash scripts/healthcheck.sh http://localhost/api/test 15 2
```

**5. If still failing — full stack restart**
```bash
docker compose down
docker compose up -d
bash scripts/healthcheck.sh http://localhost/api/test 30 2
```

### Rollback (if new deploy caused the outage)
```bash
# Pull previous image by SHA (get SHA from GHCR or last known good commit)
docker pull ghcr.io/ndanhd/book-app-backend:<previous-sha>
BACKEND_IMAGE=ghcr.io/ndanhd/book-app-backend:<previous-sha> docker compose up -d backend
```

### Escalation
If service is still down after rollback: escalate to engineering lead. Attach:
- `docker compose logs backend` (last 200 lines)
- `docker compose ps` output
- Prometheus query: `probe_duration_seconds{job="blackbox-http"}` last 1h

---

## Incident 2: High Memory Usage

### Symptoms
- Alert: `HighContainerMemory` firing
- `container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.85`
- Container possibly getting OOM-killed repeatedly

### Triage (do in order)

**1. Identify which container**
```bash
docker stats --no-stream
# Shows MEM USAGE / LIMIT per container
```

**2. Check Grafana — Container Memory Usage panel**
- Look at the trend: sudden spike vs. gradual leak
- Sudden spike → likely a bad request / large payload
- Gradual climb → memory leak, needs restart + investigation

**3. Check for OOM kills**
```bash
docker inspect <container-name> | grep -A5 OOMKilled
# "OOMKilled": true → container was killed by kernel
docker compose logs --tail=100 backend | grep -i "error\|memory\|killed"
```

**4. Immediate relief — restart the container**
```bash
docker compose restart backend
docker stats --no-stream
# Verify memory drops back to baseline (<50MB for backend)
```

**5. Investigate root cause**

*If backend:*
- Check if books.json has grown abnormally large: `docker compose exec backend ls -lh /data/books.json`
- Flask loads all books into memory on startup — large dataset = high baseline usage

*If frontend (nginx):*
- Nginx memory is nearly fixed; high usage is unusual — check for zombie worker processes
- `docker compose exec frontend ps aux`

**6. Adjust resource limits (if legitimate growth)**

Edit `docker-compose.yml` or `k8s/backend/deployment.yml`:
```yaml
# docker-compose.yml
resources:
  limits:
    memory: 512m   # increase from 256m
```
Then: `docker compose up -d --no-deps backend`

### Prevention
- Monitor `container_memory_usage_bytes` trend in Grafana over 24h
- Alert threshold is 85% — investigate before it hits 100%
- Consider migrating from books.json to a proper DB if dataset grows

### Escalation
If memory stays high after restart or OOM kills repeat every <10 minutes: escalate. Attach:
- `docker stats --no-stream` output
- Grafana screenshot of memory panel (last 3h)
- `docker inspect <container>` output

---

## General Commands Reference

```bash
# View all container logs
docker compose logs -f

# Check resource usage live
docker stats

# Restart single service
docker compose restart <service>   # backend | frontend | nginx

# Full restart
docker compose down && docker compose up -d

# Check Prometheus alerts
curl -s http://localhost:9090/api/v1/alerts | python3 -m json.tool

# Manually trigger healthcheck
bash scripts/healthcheck.sh http://localhost/api/test
```
