# StudySync

## Description and Product Vision Statement 
StudySync is a student-focused web application designed to help college and university students find compatible study partners within their courses. By matching students based on shared classes, availability, study preferences, and preferred study locations, StudySync simplifies the process of forming effective and consistent study partnerships.

The Minimum Viable Product (MVP) of StudySync will provide just enough functionality for early adopters to create profiles, receive basic study partner matches, and connect with matched peers. The goal of the MVP is to deliver a usable, intuitive experience that enables students to find at least one compatible study partner without friction.

By releasing a focused MVP early, StudySync enables rapid user feedback, minimizes unnecessary features, and prevents scope creep. This clear product vision helps the development team align on priorities, understand their responsibilities, and concentrate on delivering core value rather than building a fully polished product prematurely.

## Team Members 
- [Rebecca Boadu](https://github.com/rboadu)
- [Bree Choi](https://github.com/bree2-c)
- [Syed Naqvi](https://github.com/syed1naqvi)
- [MarcAnthony Williams](https://github.com/MarcAnthonyWilliams)
- [Nafis Zaman](https://github.com/nafiszaman3)

## Project Background and History
StudySync was created as a student driven project to address the challenge many college students face when trying to find compatible study partners in large and busy academic environments. The idea originated from personal experiences of struggling to coordinate study sessions with peers who had different schedules, learning styles, or expectations. We hope that this project grow into an intentional effort to design a practical and user-centered tool that promotes collaboration and academic success.

If you would like more information about the original motivation, scope, and design goals, see the full project proposal [here](https://github.com/agile-students-spring2026/1-proposal-devops/blob/main/README.md).

This project follows a team-based contribution model. Please refer to our [CONTRIBUTING.md](./CONTRIBUTING.md) file for guidelines on collaboration, responsibilities, and accountability among team members throughout the semester.

Instructions for testing and building this project will be provided as the project progress. 

## Building and Testing
On every push or pull request to the `master` branch, the following steps are executed:

#### Backend (`back-end`)
- Install dependencies using `npm install`
- Run automated tests using `npm test` (Mocha + Chai)

#### Frontend (`front-end`)
- Install dependencies using `npm install`
- Build the application using `npm run build`

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | http://161.35.51.3:5173 |
| Backend API | http://161.35.51.3:3001 |

---

## Running with Docker

StudySync uses Docker and Docker Compose to run all three services — MongoDB, the Express backend, and the Nginx-served React frontend — together in an isolated environment.

---

### What You Need

| Tool | Purpose |
|------|---------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop) | Runs and manages containers |
| [Docker Compose](https://docs.docker.com/compose/install/) | Orchestrates multi-container setup (bundled with Docker Desktop) |

---

### Step 1 — Set Up Your Environment File

Create a `.env` file in the project root and set the following values:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string (leave blank to use the local container) |
| `JWT_SECRET` | A long, random secret string for signing JWTs |
| `PORT` | the network port number on which a web server should listen for incoming traffic |

---

### Step 2 — Build and Start All Services

```bash
docker compose up --build -d
```

This single command will:
- Build the **backend** image (Node 22-alpine)
- Build the **frontend** image (Node 22-alpine → Nginx)
- Pull and start **MongoDB 7.0** with a persistent named volume
- Wire all three services together on a private Docker network

---

### Step 3 — Open the App

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |

---

### Useful Commands

```bash
# Stream logs for all services
docker compose logs -f

# Stream logs for a single service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo

# Stop containers (data is preserved)
docker compose down

# Stop containers AND delete all stored data
docker compose down -v

# Rebuild a single service after a code change
docker compose up --build -d backend
```

---

### Troubleshooting

| Problem | Fix |
|---------|-----|
| Port already in use | Change the host-side port in `docker-compose.yml` (e.g. `"3002:3001"`) |
| MongoDB takes a long time on first run | Normal — the image is being pulled. Subsequent starts are fast. |
| Backend shows "unhealthy" | Wait ~60 s for the start-period to pass; check logs with `docker compose logs backend` |
| Changes not reflected | Run `docker compose up --build -d` to rebuild the affected image |
