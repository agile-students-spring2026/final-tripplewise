This is the backend service for **TrippleWise**, responsible for handling API requests, authentication, business logic, and database interactions.

---

## Features

- RESTful API built with Express
- User authentication using JWT
- Secure password hashing (bcrypt)
- Expense tracking and group management logic
- Input validation using express-validator
- MongoDB integration with Mongoose
- Automated testing with Mocha, Chai, and Supertest

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Mocha & Chai (testing)
- Supertest (API testing)

---

## Installation

```bash
cd server
npm install
```

---

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will typically run on:

\`http://localhost:5000\`

---

## Testing

Run all backend tests:

```bash
npm test
```

---

## Test Coverage

Generate coverage report:

```bash
npm run coverage
```

Enforce coverage check:

```bash
npm run coverage:check
```

---
## API Overview

- Authentication (login, signup)
- User management
- Expense tracking
- Group management
- Balance calculations

---

## CI Integration

GitHub Actions automatically:
- Installs dependencies
- Runs backend tests
- Validates builds on push/PR

---

## Notes

- Built with Express architecture
- MongoDB for persistence
- JWT for authentication
- Mocha/Chai for testing

