# User Test DevOps CNT - Backend Book Tracker

## 🚀 DevOps Submission Notes

* **Chosen Role:** DevOps
* **Target Optimization:** Containerization, Security hardening, Multi-stage builds, and Environment Management.

### 🧠 Architectural & Engineering Decisions

1.  **Multi-Stage Build Optimization:** Split the `Dockerfile` into a `builder` stage and a lightweight `runtime` stage. Heavy compiler tools (`build-essential`, `python3-dev`) are left behind in the build layer, reducing the final production image size significantly.
2.  **Security Hardening (Non-Root User):** Altered the runtime container behavior to execute under a restricted `appuser` instead of `root`. This prevents potential container-breakout vulnerabilities.
3.  **Data Persistence (SQLite Bind Mount):** Since SQLite is a file-based database, a strategic Docker Bind Mount (`.:/app`) was implemented in `docker-compose.yml`. This ensures that the local SQLite database file (`books_dev.db`) survives container termination (`docker compose down`) and syncs flawlessly with the host machine.
4.  **Secure Environment Lifecycle:** Isolated configuration secrets using `.env`. Excluded the active `.env` from version control via `.gitignore` and provided a `.env.example` blueprint for deployment safety.
---

## Tech Stack

### Backend
- Python 3.x
- Flask
- Flask-CORS
- SQLAlchemy
- python-dotenv
- **Docker & Docker Compose** (DevOps Addition)

## Project Structure

```
book-app/
├── backend/
│   ├── .env                     # Active local configuration file (Contains secrets/credentials, ignored by Git)
│   ├── app.py                   # Main entry point for the Flask REST API application
│   ├── books.json               # Local JSON-based database for storing book tracking data
│   ├── docker-compose.yml       # Orchestrator manifest to define and run the backend container
│   ├── Dockerfile               # Docker image blueprint leveraging Multi-stage & Non-root user hardening tactics
│   ├── env.development          # Configuration blueprint/template tailored for the Development environment
│   ├── env.example              # Public blueprint for safe environment variables without sensitive credentials
│   ├── env.production           # Configuration blueprint/template prepared for the Production environment
│   ├── requirements.txt         # List of Python library dependencies required by the backend application
│   ├── setup.py                 # Helper script for initial initialization or application testing purposes
│   └── requirements.txt         # Main Python dependencies list at the repository root level
```
--
## 🛠️ Getting Started (DevOps Recommended: Docker Compose)

### Prerequisites
- Linux, Docker Engine or Docker Desktop installed and running
- Windows, Docker Desktop installed and running
- Docker Compose v2.x enabled

### Deployment Steps

1.  **Prepare Environment Variables**
    Navigate to the backend directory and copy the environment template:
    ```bash
    cd backend
    cp .env.example .env
    ```

2.  **Spin Up the Infrastructure**
    Run the following command inside the `backend/` directory to build and start the application in the background:
    ```bash
    docker compose up -d --build
    ```
    or
    ```bash
    docker compose up -d
    ```

3.  **Verify Application Logs**
    To ensure the Flask server started properly, monitor the real-time container output:
    ```bash
    docker compose logs -f backend
    ```
    The backend API will be live and listening at:
    * Localhost: **`http://localhost:5001`**
    * Local Network: **`http://<YOUR_HOST_IP_ADDRESS>:5001`**.
   > 💡 **How to find your IP Address:**
   > * **Windows (PowerShell/CMD):** Run `ipconfig` and look for *IPv4 Address* (e.g., `192.168.xx.xx`).
   > * **Linux/macOS (Terminal):** Run `hostname -I` or `ifconfig`.

4.  **Tearing Down**
    To stop and safely remove the container instance without losing your SQLite data:
    ```bash
    docker compose down
    ```

---

## API Documentation

### Endpoints

#### GET /api/books
- Returns all books
- Response: Array of book objects

#### POST /api/books
- Creates a new book
- Request Body:
```json
{
  "title": "string",
  "author": "string",
  "status": "unread" | "reading" | "completed"
}
```

#### PUT /api/books/<id>
- Updates an existing book
- Request Body: Same as POST

#### DELETE /api/books/<id>
- Deletes a book by ID

## 🎬 Proof of Execution (Test Results)
This section documents the actual successful execution and live verification of the deployment, proving that both the infrastructure layers and API routing are functioning flawlessly.
<img src="./assets/1_docker build.jpeg" height="400" alt="Successful Multi-Stage Docker Build Process">
<p align="center"><i>*Figure 1: Multi-stage Dockerfile build execution*</i></p>

<img src="./assets/1_docker run.jpeg" height="400" alt="Docker Compose Up and Live Logging Output">
<p align="center"><i>*Figure 2: Container deployment and live initialization logs*</i></p>

<img src="./assets/2_docker run.jpeg" height="400" alt="Postman POST Request">
<p align="center"><i>*Figure 3: Sending a POST request payload using Postman*</i></p>

<img src="./assets/3_docker run.jpeg" height="400" alt="Postman Successful JSON Response">
<p align="center"><i>**Figure 4: Received successful response and state verification after the POST operation. In this session, I ignored `books.json` in the Dockerfile for a cleaner view.*</i></p>

<img src="./assets/1_docker compose.jpeg" height="400" alt="Successful Docker Compose Up Process">
<p align="center"><i>*Figure 5: Using docker-compose methode*</i></p>

<img src="./assets/2_docker compose.jpeg" height="400" alt="Display default database books.json">
<p align="center"><i>*Figure 6: Default database*</i></p>

<img src="./assets/3_docker compose.jpeg" height="400" alt="Postman POST Request">
<p align="center"><i>*Figure 7: Sending a POST request payload using Postman*</i></p>

<img src="./assets/4_docker compose.jpeg" height="400" alt="Postman Successful JSON Respons">
<p align="center"><i>*Figure 8: Received successful response and state verification after the POST operation.*</i></p>

<img src="./assets/1_docker logs_realtime.jpeg" alt="Docker real-time logs">
<p align="center"><i>*Figure 9:💡 Postman Troubleshooting (Avoid Error 415):** If you receive a `415 Unsupported Media Type` error, navigate to the <b>Body</b> tab in Postman, select the <b>raw</b> radio button, and change the format dropdown option from <b>Text</b> to <b>JSON</b>. This automatically injects the correct `Content-Type` header.</i></p>

---
## License

This project is licensed under the MIT License - see the LICENSE file for details.