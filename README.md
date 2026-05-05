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

## Docker Setup with Docker Compose

TrippleWise can be run entirely using Docker and Docker Compose for local development and testing.

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) installed and running
- [Docker Compose](https://docs.docker.com/compose/install/) installed (included with Docker Desktop)

### Quick Start

1. **Start all services (MongoDB, Backend, Frontend):**
```bash
docker-compose up -d
```

This command will:
- Build the backend image (Node 22-alpine)
- Build the frontend image (Node 22-alpine → Nginx)
- Start MongoDB 7.0 with persistent storage
- Start the backend server on port `3001`
- Start the frontend (Nginx) on port `5173`

2. **Access the application:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`
- MongoDB: `localhost:27017` (credentials: `admin`/`password`)

3. **View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

4. **Stop services (keep data):**
```bash
docker-compose down
```

5. **Stop and clean up everything (delete MongoDB data):**
```bash
docker-compose down -v
```

### Architecture

- **MongoDB** (`mongo:7.0`): Database service, stores study syncs, meeting requests, and user profiles
- **Backend** (`Node 22-alpine`): Express.js API server, runs on port 3001 with hot-reload (`npm run dev`)
- **Frontend** (`Node 22-alpine + Nginx`): Vite React app built and served via Nginx on port 5173
- **Data Persistence**: MongoDB data is stored in `./mongo-data/` directory (persists between `up`/`down` cycles)

### Environment Variables

Edit `docker-compose.yml` to customize:
- `MONGODB_URI`: MongoDB connection string (default: `mongodb://admin:password@mongo:27017/tripplewise?authSource=admin`)
- `JWT_SECRET`: JWT signing secret (change in production)
- `NODE_ENV`: `development` or `production`

### Building and Pushing to Docker Hub

1. **Build images locally:**
```bash
docker build -f back-end/Dockerfile -t tripplewise-backend:latest .
docker build -f front-end/Dockerfile -t tripplewise-frontend:latest .
```

2. **Tag images with your Docker Hub username:**
```bash
docker tag tripplewise-backend:latest yourusername/tripplewise-backend:latest
docker tag tripplewise-frontend:latest yourusername/tripplewise-frontend:latest
```

3. **Login and push to Docker Hub:**
```bash
docker login
docker push yourusername/tripplewise-backend:latest
docker push yourusername/tripplewise-frontend:latest
```

4. **Verify on Docker Hub:**
Visit `https://hub.docker.com/r/yourusername/tripplewise-backend` and `https://hub.docker.com/r/yourusername/tripplewise-frontend`

### Troubleshooting

- **Slow MongoDB pull on first run**: This is normal. Subsequent `docker-compose up` commands reuse the `./mongo-data/` volume for fast startup.
- **Port already in use**: If ports 3001, 5173, or 27017 are in use, modify `docker-compose.yml` port mappings.
- **Images not found**: Ensure you've built the images with `docker build` before pushing to Docker Hub.



## Additional Links

1. See the [App Map & Wireframes](instructions-0a-app-map-wireframes.md) and [Prototyping](./instructions-0b-prototyping.md) instructions for the requirements of the initial user experience design of the app.

1. Delete the contents of this file and replace with the contents of a proper README.md, as described in the [project setup instructions](./instructions-0c-project-setup.md)

1. See the [Sprint Planning instructions](instructions-0d-sprint-planning.md) for the requirements of Sprint Planning for each Sprint.

1. See the [Front-End Development instructions](./instructions-1-front-end.md) for the requirements of the initial Front-End Development.

1. See the [Back-End Development instructions](./instructions-2-back-end.md) for the requirements of the initial Back-End Development.

1. See the [Database Integration instructions](./instructions-3-database.md) for the requirements of integrating a database into the back-end.

1. See the [Deployment instructions](./instructions-4-deployment.md) for the requirements of deploying an app.
