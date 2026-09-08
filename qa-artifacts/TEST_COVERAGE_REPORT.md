# Test Coverage Report: Book Tracker Application

**Author:** Sandy Yoga Prakasa Holley  
**Role:** QA Engineer  
**GitHub Profile:** [https://github.com/Sandy-YP-Holley](https://github.com/Sandy-YP-Holley)  
**Document Version:** 1.0.0  
**Date:** September 8, 2026  

---

## 1. Executive Summary

This report provides a formal Requirements Traceability Matrix (RTM) and quantitative coverage analysis for the Book Tracker application. The evaluation encompasses the Flask REST API backend, the React TypeScript frontend (specifically the Browse Library view), automated test suites in `qa-tests/`, and manual exploratory verifications.

---

## 2. Requirements Traceability Matrix (RTM)

| Requirement Description | Test Case ID | Test Type | Automation Script | Verified Behavior / Defect |
| :--- | :--- | :--- | :--- | :--- |
| **API Health & Connectivity** | TC-API-001 | API Integration | `qa-tests/tests/api.spec.ts` | Pass (HTTP 200, CORS header verified) |
| **Retrieve Books Catalog** | TC-API-002 | API Integration | `qa-tests/tests/api.spec.ts` | Pass (HTTP 200, schema verified) |
| **Create Book Record** | TC-API-003 | API Integration | `qa-tests/tests/api.spec.ts` | Pass (HTTP 201, entity created) |
| **Update Book Attributes** | TC-API-004, TC-API-005 | API Integration | `qa-tests/tests/api.spec.ts` | Pass (HTTP 200, fields modified) |
| **Delete Book Record** | TC-API-007 | API Integration | `qa-tests/tests/api.spec.ts` | Pass (HTTP 200, entity removed) |
| **Non-Existent Resource Handling** | TC-API-006, TC-API-014, TC-API-015 | Negative API | `qa-tests/tests/api.spec.ts` | Pass (HTTP 404 for invalid IDs) |
| **Mandatory Field Ingestion** | TC-API-008, TC-API-009 | Negative API | Manual / Scripted Audit | **FAIL (BUG-002: Null entities created)** |
| **Numeric Range Boundary Checks** | TC-API-011, TC-API-012 | Boundary API | Manual / Scripted Audit | **FAIL (BUG-003: Unchecked ratings/pages)** |
| **Status Domain Validation** | TC-API-013 | Negative API | Manual / Scripted Audit | **FAIL (BUG-004: Arbitrary strings accepted)** |
| **Primary Key Sequence Safety** | TC-API-016 | Data Integrity | Manual / Scripted Audit | **FAIL (BUG-001: ID collision after deletion)** |
| **Stored XSS Input Sanitization** | TC-API-017 | Security API | Manual / Scripted Audit | **FAIL (BUG-005: Raw scripts stored)** |
| **Browse Library Initial View** | TC-E2E-001 | E2E Browser | `qa-tests/tests/e2e.spec.ts` | Pass (Heading, count, cards rendered) |
| **Search Filter (Title/Author)** | TC-E2E-002, TC-E2E-003 | E2E Browser | `qa-tests/tests/e2e.spec.ts` | Pass (Dynamic client filtering) |
| **Genre Filter Selection** | TC-E2E-004, TC-E2E-005 | E2E Browser | `qa-tests/tests/e2e.spec.ts` | Pass (Genre pill filtering active) |
| **Add to Library Interaction** | TC-E2E-006 | E2E Browser | `qa-tests/tests/e2e.spec.ts` | Pass (Dispatches PUT request; **BUG-007**) |
| **Empty Search Handling** | TC-E2E-007 | E2E Browser | Exploratory Audit | Pass (Empty state message rendered) |

---

## 3. Backend API Endpoint Coverage Analysis

```
+---------------------------+-------------------+--------------------+--------------------+
| Endpoint & HTTP Method    | Test Scenarios    | API Test Coverage  | UI Integration     |
+---------------------------+-------------------+--------------------+--------------------+
| GET  /api/test            | 1 Scenario        | 100.0%             | N/A (Diagnostic)   |
| GET  /api/books           | 6 Scenarios       | 100.0%             | 100.0% (Library)   |
| POST /api/books           | 8 Scenarios       | 100.0%             | 0.0% (Not in UI)   |
| PUT  /api/books/<id>      | 5 Scenarios       | 100.0%             | 100.0% (Library)   |
| DELETE /api/books/<id>    | 3 Scenarios       | 100.0%             | 0.0% (Not in UI)   |
+---------------------------+-------------------+--------------------+--------------------+
| OVERALL API COVERAGE      | 23 Scenarios      | 100.0%             | 40.0% (2/5 in UI)  |
+---------------------------+-------------------+--------------------+--------------------+
```

### Observations on API Endpoint Coverage:
- **Backend API Surface:** 100% of defined backend endpoints have automated and exploratory test coverage covering positive paths, schema structures, edge cases, and negative IDs.
- **Frontend Integration Disparity:** Only `GET /api/books` and `PUT /api/books/<id>` are integrated into the React application. There are no UI controls to add a new book (`POST`) or remove a book (`DELETE`) from the library.

---

## 4. Frontend Browse Library Component Coverage

| Component / Sub-module | UI Element / Interaction | Coverage Status | Notes |
| :--- | :--- | :--- | :--- |
| **Header Section** | Header navigation, title, filter icon | 100% Audited | Title verified; filter icon is inert (**BUG-008**) |
| **Search Component** | Text input with debounced filtering | 100% Automated | Verified dynamic filtering by title and author |
| **Genre Filter Bar** | Horizontal pill button list | 100% Automated | Tested active selection and 'all' genre reset |
| **Results Counter** | Dynamic string `X book(s) found` | 100% Automated | Verified correct singular/plural text updates |
| **Book Card Rendering** | Title, author, rating, genre badge | 100% Automated | Verified card rendering and typography |
| **Action Trigger** | Green "+" button on `want-to-read` | 100% Automated | Verified network dispatch of PUT mutation |
| **Empty State** | Fallback message on zero matches | 100% Audited | Verified "No books found matching your criteria" |
| **Error Boundary** | Red alert banner on fetch failure | 100% Audited | Verified on backend connection loss |

---

## 5. Test Type Distribution

```
Distribution of Test Assets:
--------------------------------------------------
API Automated Tests (Playwright):            53.8%
E2E Browser Tests (Playwright):              30.8%
Security & Injection Tests:                   7.7%
Performance & Concurrency Tests:              7.7%
--------------------------------------------------
Total Coverage Footprint:                   100.0%
```
