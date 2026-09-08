import time
import http.client
import json
import statistics
import os
from concurrent.futures import ThreadPoolExecutor

API_HOST = os.getenv("API_HOST", "127.0.0.1")
API_PORT = int(os.getenv("API_PORT", "5000"))

def measure_endpoint(method, path, payload=None):
    conn = http.client.HTTPConnection(API_HOST, API_PORT, timeout=5)
    headers = {"Content-Type": "application/json"} if payload else {}
    body = json.dumps(payload) if payload else None
    
    start = time.perf_counter()
    try:
        conn.request(method, path, body=body, headers=headers)
        resp = conn.getresponse()
        resp_data = resp.read()
        duration_ms = (time.perf_counter() - start) * 1000
        parsed = None
        if method == "POST" and resp.status == 201:
            try:
                parsed = json.loads(resp_data.decode("utf-8"))
            except:
                pass
        conn.close()
        return resp.status, duration_ms, parsed
    except Exception as e:
        conn.close()
        return 0, 0, None

def benchmark_single_requests(iterations=30):
    endpoints = [
        ("GET", "/api/books", None),
        ("GET", "/api/test", None),
        ("POST", "/api/books", {"title": "Benchmark Sample", "author": "QA Benchmark", "rating": 4.2, "pages": 200, "status": "want-to-read"}),
    ]
    results = {}
    created_ids = []

    for method, path, payload in endpoints:
        durations = []
        status_codes = []
        for _ in range(iterations):
            status, duration, parsed = measure_endpoint(method, path, payload)
            durations.append(duration)
            status_codes.append(status)
            if parsed and "id" in parsed:
                created_ids.append(parsed["id"])
            time.sleep(0.01)

        durations.sort()
        results[f"{method} {path}"] = {
            "iterations": iterations,
            "min_ms": round(min(durations), 2),
            "max_ms": round(max(durations), 2),
            "avg_ms": round(statistics.mean(durations), 2),
            "p50_ms": round(statistics.median(durations), 2),
            "p90_ms": round(durations[int(len(durations) * 0.90)], 2),
            "p95_ms": round(durations[int(len(durations) * 0.95)], 2),
            "p99_ms": round(durations[int(len(durations) * 0.99)], 2),
            "success_rate": round((status_codes.count(200) + status_codes.count(201)) / len(status_codes) * 100, 2)
        }

    # Clean up test creations
    for book_id in created_ids:
        measure_endpoint("DELETE", f"/api/books/{book_id}")

    return results

def benchmark_concurrent_requests(total_requests=50, concurrency=5):
    start_total = time.perf_counter()
    durations = []
    status_codes = []

    def task(_):
        status, duration, _ = measure_endpoint("GET", "/api/books")
        return status, duration

    with ThreadPoolExecutor(max_workers=concurrency) as executor:
        for status, duration in executor.map(task, range(total_requests)):
            status_codes.append(status)
            durations.append(duration)

    total_time = time.perf_counter() - start_total
    rps = round(total_requests / total_time, 2)
    durations.sort()

    return {
        "concurrency": concurrency,
        "total_requests": total_requests,
        "total_time_sec": round(total_time, 3),
        "throughput_rps": rps,
        "min_ms": round(min(durations), 2),
        "max_ms": round(max(durations), 2),
        "avg_ms": round(statistics.mean(durations), 2),
        "p50_ms": round(statistics.median(durations), 2),
        "p90_ms": round(durations[int(len(durations) * 0.90)], 2),
        "p95_ms": round(durations[int(len(durations) * 0.95)], 2),
        "p99_ms": round(durations[int(len(durations) * 0.99)], 2),
        "success_rate": round(status_codes.count(200) / len(status_codes) * 100, 2)
    }

if __name__ == "__main__":
    print("=== Single Request Latency Benchmarks (30 iterations per endpoint) ===")
    single = benchmark_single_requests(30)
    print(json.dumps(single, indent=2))

    print("\n=== Concurrent Throughput Benchmark (50 requests, 5 concurrent workers) ===")
    concurrent = benchmark_concurrent_requests(50, 5)
    print(json.dumps(concurrent, indent=2))
