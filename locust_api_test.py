from locust import HttpUser, task, between

# ============== SMOKE TEST ==============
class SmokeUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def get_books(self):
        self.client.get("/api/books")

    @task
    def create_book(self):
        self.client.post("/api/books", json={
            "title": "Smoke Test Book",
            "author": "IQMAL"
        })


# ============== LOAD TEST ==============
class LoadUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def get_books(self):
        self.client.get("/api/books")

    @task(1)
    def create_book(self):
        self.client.post("/api/books", json={
            "title": "Load Test Book",
            "author": "IQMAL"
        })


# ============== STRESS TEST ==============
class StressUser(HttpUser):
    wait_time = between(0.1, 0.5)  

    @task(5)
    def get_books(self):
        self.client.get("/api/books")

    @task(2)
    def create_book(self):
        self.client.post("/api/books", json={
            "title": "Stress Test Book",
            "author": "IQMAL"
        })


# ============== ENDURANCE TEST ==============
class EnduranceUser(HttpUser):
    wait_time = between(2, 5)  
    @task(2)
    def get_books(self):
        self.client.get("/api/books")

    @task(1)
    def create_book(self):
        self.client.post("/api/books", json={
            "title": "Endurance Test Book",
            "author": "IQMAL"
        })
