# Book App — Customer Service

## Chosen Role

**Customer Service**

I implemented the Customer Service features for the Book App, including a comprehensive support system to help users find information, submit support requests, provide feedback, and track their support tickets.

### Features Implemented

* Help & FAQ page
* Searchable and categorized FAQ
* Contact Support form with validation
* Support ticket creation and tracking
* Ticket detail and status management
* User Guide / Tutorial pages
* Feedback & Suggestion submission
* Live Chat widget interface
* Customer Service Dashboard
* Knowledge Base with article categories
* User Satisfaction Survey
* Multi-language support (English & Bahasa Indonesia)
* Customer service analytics dashboard mockup

---

## How to Run / Test

### Requirements

Make sure the following are available:

* Node.js
* npm
* Git

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

### Backend

The backend is expected to run at:

```text
http://localhost:5000
```

The Customer Service features are primarily implemented on the frontend and do not require backend integration for the ticket, feedback, survey, or Live Chat mockup functionality.

---

## Customer Service Routes

The following routes are available for testing:

| Feature                    | Route                  |
| -------------------------- | ---------------------- |
| Help & FAQ                 | `/help`                |
| Contact Support            | `/contact-support`     |
| Support Tickets            | `/tickets`             |
| Ticket Detail              | `/tickets/:id`         |
| User Guide                 | `/user-guide`          |
| User Guide Detail          | `/user-guide/:id`      |
| Feedback & Suggestion      | `/feedback`            |
| Customer Service Dashboard | `/customer-service`    |
| Knowledge Base             | `/knowledge-base`      |
| Knowledge Base Article     | `/knowledge-base/:id`  |
| Satisfaction Survey        | `/satisfaction-survey` |

Example:

```text
http://localhost:5173/help
```

---

## How to Test

### 1. Help & FAQ

Open:

```text
http://localhost:5173/help
```

Test:

* Search FAQ using keywords
* Filter FAQ by category
* Switch between English and Bahasa Indonesia
* Expand questions to view answers

---

### 2. Contact Support

Open:

```text
http://localhost:5173/contact-support
```

Test:

* Submit the form with empty fields
* Enter an invalid email address
* Enter a description shorter than the minimum length
* Submit a valid support request

A valid submission creates a support ticket.

---

### 3. Support Ticket

Open:

```text
http://localhost:5173/tickets
```

Test:

* View submitted tickets
* Open ticket details
* Change ticket status
* Check ticket information
* Mark a ticket as resolved

Ticket data is stored locally in the browser.

---

### 4. User Guide

Open:

```text
http://localhost:5173/user-guide
```

Test:

* View available tutorials
* Open a tutorial
* Navigate through tutorial steps
* Switch language between English and Bahasa Indonesia

---

### 5. Feedback & Suggestion

Open:

```text
http://localhost:5173/feedback
```

Test:

* Submit feedback
* Select feedback type
* Provide a rating
* Validate required fields
* Check submitted feedback through the Customer Service Dashboard

---

### 6. Live Chat

The Live Chat widget is available from the main application interface.

Test:

* Open the chat widget
* Send a message
* Verify the message appears in the chat
* Check the simulated support response

> The Live Chat is intentionally implemented as a UI-only feature without backend integration, according to the task requirements.

---

### 7. Customer Service Dashboard

Open:

```text
http://localhost:5173/customer-service
```

The dashboard provides a mockup of customer service analytics, including:

* Total tickets
* Active tickets
* Resolved tickets
* Average satisfaction rating
* Ticket status overview
* Ticket priority overview
* Customer satisfaction distribution
* Recent tickets
* Recent satisfaction feedback
* Recent user feedback

---

### 8. Knowledge Base

Open:

```text
http://localhost:5173/knowledge-base
```

Test:

* Search knowledge base articles
* Filter articles by category
* Open an article
* Read article details
* Switch language

---

### 9. Satisfaction Survey

The satisfaction survey can be accessed after resolving a support ticket.

The survey allows users to:

* Give a satisfaction rating from 1–5
* Add an optional comment
* Submit their feedback

---

## Notes & Technical Decisions

### Local Storage

For this take-home task, support-related data is stored using browser `localStorage`.

The following data is stored locally:

* Support tickets
* Feedback submissions
* Satisfaction surveys
* Selected application language

This approach was chosen because the task focuses on implementing the Customer Service interface and functionality without requiring additional backend endpoints.

---

### Ticket System

The ticket system generates simple ticket IDs such as:

```text
TCK-001
TCK-002
TCK-003
```

Each ticket contains:

* Customer name
* Email
* Category
* Priority
* Subject
* Description
* Status
* Creation date

Ticket statuses include:

```text
Open
In Progress
Resolved
```

---

### Form Validation

The Contact Support and Feedback forms include client-side validation for required fields and input formats.

For example:

* Name is required
* Email must use a valid email format
* Category is required
* Priority is required
* Subject is required
* Description must contain sufficient information

---

### Multi-language Support

The application supports:

* English
* Bahasa Indonesia

A reusable language context is implemented through:

```text
src/locales/LanguageContext.tsx
```

Translation files are located in:

```text
src/locales/en.ts
src/locales/id.ts
```

The selected language is persisted using `localStorage`.

---

### Knowledge Base

The Knowledge Base uses structured article data containing:

* Article title
* Description
* Category
* Article content

Each article supports both English and Bahasa Indonesia.

---

### Live Chat

The Live Chat feature is implemented as a frontend-only interface.

No real-time messaging service or backend integration is used because the task specifically states:

> Live Chat widget interface (UI only, no backend integration needed)

The widget provides a simulated support response to demonstrate the intended user experience.

---

## Project Structure

The main Customer Service implementation is organized as follows:

```text
src/
├── components/
│   └── LiveChat.tsx
│
├── data/
│   ├── supportData.ts
│   └── knowledgeBaseData.ts
│
├── locales/
│   ├── en.ts
│   ├── id.ts
│   └── LanguageContext.tsx
│
└── pages/
    ├── Help.tsx
    ├── ContactSupport.tsx
    ├── Tickets.tsx
    ├── TicketDetail.tsx
    ├── UserGuide.tsx
    ├── UserGuideDetail.tsx
    ├── Feedback.tsx
    ├── CustomerServiceDashboard.tsx
    ├── KnowledgeBase.tsx
    ├── KnowledgeBaseDetail.tsx
    └── SatisfactionSurvey.tsx
```

---

## Implementation Decisions

1. **Frontend-first implementation**
   Customer Service functionality was implemented on the frontend to match the scope of the assigned role.

2. **LocalStorage for persistence**
   `localStorage` is used to simulate data persistence without requiring additional backend APIs.

3. **Reusable language system**
   A language context was created to allow Customer Service pages and application navigation to switch between English and Bahasa Indonesia.

4. **UI-only Live Chat**
   Live Chat uses a simulated response because backend integration is not required by the task.

5. **Responsive mobile-oriented UI**
   The Customer Service pages follow the existing Book App design and mobile layout using Tailwind CSS.

---

## Test Environment

### Local

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

### Live

```text
https://book-app.cinte.id/
```

---

## Conclusion

The Customer Service implementation covers the required features and bonus requirements from the task, including FAQ, support tickets, tutorials, feedback, Live Chat UI, Knowledge Base, satisfaction survey, multi-language support, and customer service analytics dashboard mockup.

````

**Catatan:** kalau struktur repository kamu sebenarnya tidak memakai folder `frontend` di root, bagian:

```bash
cd frontend
````

perlu disesuaikan dengan lokasi `package.json` kamu. Dari project yang sedang kamu kerjakan sebelumnya, folder frontend-mu memang berada di `C:\Users\paisl\book-app\frontend`, jadi README di atas sudah mengikuti struktur tersebut.
