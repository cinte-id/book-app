# Accessibility & Performance Audit: Book Tracker Application

**Author:** Sandy Yoga Prakasa Holley  
**Role:** QA Engineer  
**GitHub Profile:** [https://github.com/Sandy-YP-Holley](https://github.com/Sandy-YP-Holley)  
**Document Version:** 1.0.0  
**Date:** September 8, 2026  
**Audited Target:** Flask REST API (`http://localhost:5000`) & Browse Library UI (`http://localhost:5173`)  

---

## Part 1: Performance Benchmarks

Performance testing was conducted using the automated benchmark harness (`qa-tests/scripts/benchmark.py`) directly querying the running Flask application.

### 1.1 Single-Request Latency Profile

Metrics gathered across 30 sequential requests per endpoint with automated entity teardown:

| Endpoint & Method | Iterations | Min Latency | Max Latency | Mean (Avg) | p50 (Median) | p90 | p95 | p99 | Success Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET /api/books` | 30 | 1.44 ms | 21.90 ms | 6.23 ms | 1.88 ms | 20.63 ms | 21.01 ms | 21.90 ms | 100.0% |
| `GET /api/test` | 30 | 1.40 ms | 21.00 ms | 8.25 ms | 1.59 ms | 20.70 ms | 20.97 ms | 21.00 ms | 100.0% |
| `POST /api/books` | 30 | 1.96 ms | 24.00 ms | 8.03 ms | 2.43 ms | 23.39 ms | 23.95 ms | 24.00 ms | 100.0% |

### 1.2 Concurrent Throughput and Stress Profile

Metrics gathered under concurrent thread worker pool execution:

| Test Parameter | Measured Metric |
| :--- | :--- |
| **Concurrency Level** | 5 concurrent client threads |
| **Total Requests Dispatched** | 50 HTTP GET requests |
| **Total Test Duration** | 0.127 seconds |
| **Effective Throughput** | **394.75 requests/second** |
| **Minimum Response Time** | 2.18 ms |
| **Maximum Response Time** | 28.34 ms |
| **Average Response Time** | 11.92 ms |
| **p50 (Median Latency)** | 11.57 ms |
| **p90 Latency** | 21.79 ms |
| **p95 Latency** | 25.45 ms |
| **p99 Latency** | 28.34 ms |
| **HTTP Error Rate** | **0.0%** (50/50 returned HTTP 200) |

### 1.3 Performance Engineering Observation: Windows IPv6 Dual-Stack Latency

During network profiling on Windows, an empirical latency anomaly was identified:
- **Root Cause:** When client libraries resolve `localhost`, the Windows DNS resolver prioritizes IPv6 `::1`. Because the default Flask server bound exclusively to IPv4 `127.0.0.1`, client TCP handshakes experienced a 2,000 ms SYN-ACK timeout before falling back to IPv4.
- **Remediation:** Explicitly configure backend socket bindings to `0.0.0.0` or dual-stack IPv6/IPv4, or configure client baseURLs to explicit IPv4 loopback (`127.0.0.1`). This reduced baseline request latency from ~2,019 ms down to **3.8 ms** (a 99.8% latency reduction).

---

## Part 2: Accessibility Audit (WCAG 2.1 Level AA)

An accessibility audit of the "Browse Library" module was performed against the W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standard.

### 2.1 Compliance Summary Dashboard

| WCAG 2.1 Success Criterion | Level | Component Evaluated | Audit Status | Impact |
| :--- | :--- | :--- | :--- | :--- |
| **1.1.1 Non-text Content** | Level A | Filter Button, Card Action Buttons | **FAIL** | High |
| **1.3.1 Info and Relationships** | Level A | Search Input Form Element | **FAIL** | High |
| **1.4.3 Contrast (Minimum)** | Level AA | Search Input Placeholder & Badges | **FAIL** | Medium |
| **2.1.1 Keyboard Navigable** | Level A | Genre Horizontal Pill Scroll | **PARTIAL** | Medium |
| **2.4.7 Focus Visible** | Level AA | Genre Filter Buttons & Card Buttons | **PARTIAL** | Medium |
| **4.1.2 Name, Role, Value** | Level A | Custom Action Buttons | **FAIL** | High |
| **4.1.3 Status Messages** | Level AA | Dynamic Search & Filter Results Counter | **FAIL** | Low |

---

### 2.2 Detailed Accessibility Findings and Remediation

#### 1. Missing Accessible Name on Interactive Icon Buttons (WCAG 1.1.1 & 4.1.2)
- **Violation:**
  - In `BrowseLibrary.tsx` line 93: `<button className="p-2 ..."><Filter size={20} /></button>`.
  - In `BrowseLibrary.tsx` line 138: `<button className="absolute top-4 right-4 ..."><Plus size={16} /></button>`.
- **Screen Reader Impact:** Screen readers announce only "button" or "unlabeled button", providing no indication of what the button does or which book it modifies.
- **Recommended Fix:**
  ```tsx
  <button aria-label="Open filter and sorting options" ...>
    <Filter size={20} aria-hidden="true" />
  </button>

  <button aria-label={`Add ${book.title} to reading list`} ...>
    <Plus size={16} aria-hidden="true" />
  </button>
  ```

#### 2. Search Input Lacks Associated Accessible Label (WCAG 1.3.1)
- **Violation:**
  - In `BrowseLibrary.tsx` line 101: `<input type="text" placeholder="Search books or authors..." ... />`.
- **Screen Reader Impact:** The placeholder attribute is not a substitute for an accessible name. Users navigating via screen reader form field lists cannot determine the input's purpose.
- **Recommended Fix:**
  ```tsx
  <label htmlFor="library-search-input" className="sr-only">
    Search books by title or author
  </label>
  <input
    id="library-search-input"
    type="search"
    placeholder="Search books or authors..."
    ...
  />
  ```

#### 3. Color Contrast Ratios Below 4.5:1 Threshold (WCAG 1.4.3)
- **Violation:**
  - Search placeholder: `text-gray-400` (#9CA3AF) on `bg-gray-100` (#F3F4F6) yields a contrast ratio of **2.04:1**, significantly below the minimum required ratio of **4.5:1** for regular text.
  - Results count: `text-gray-600` (#4B5563) on `bg-gray-50` (#F9FAFB) yields **4.63:1** (Passes).
  - Badge text: `text-gray-500` (#6B7280) on `#F3F4F6` yields **4.48:1** (Fails 4.5:1 threshold for small text).
- **Recommended Fix:**
  - Update placeholder style to `placeholder:text-gray-600` (#4B5563, 4.63:1 contrast ratio) or darker.

#### 4. Absence of ARIA Live Region for Asynchronous Results (WCAG 4.1.3)
- **Violation:**
  - Line 128: `<p className="text-sm text-gray-600">{filteredBooks.length} book{...} found</p>`.
- **Screen Reader Impact:** When users type into the search bar, the visible count updates dynamically, but screen reader users receive no status announcement informing them how many results matched.
- **Recommended Fix:**
  ```tsx
  <p className="text-sm text-gray-600" aria-live="polite" aria-atomic="true">
    {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
  </p>
  ```
