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

## Environment Variables

Create a .env file:

```env
PORT=3001
MONGODB_URI=mongodb+srv://appuser:studysync123@cluster0.tyszf34.mongodb.net/?appName=Cluster0
JWT_SECRET=3f3b13e270de532f52959e-f361e8b9e7ea41fc0731a487d6b735cef9e83f3095
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

