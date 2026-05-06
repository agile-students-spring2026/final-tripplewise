# Backend

## Description

This is the backend service for **TrippleWise**, responsible for handling API requests, authentication, business logic, and database interactions.

## Features
- RESTful API built with Express
- User authentication using JWT
- Secure password hashing (bcrypt)
- Expense tracking and group management logic
- Input validation using express-validator
- MongoDB integration with Mongoose
- Automated testing with Mocha, Chai, and Supertest


## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Mocha & Chai (testing)
- Supertest (API testing)


## Installation
```
cd back-end
npm install
```


## Running the Server
### Development Mode
```
npm run dev
```
### Production Mode
```
npm start
```
\
The server will typically run on:
```
http://localhost:3001
```


## Testing
Run all backend tests:
```
npm test
```
Generate coverage report:
```
npm run coverage
```
Enforce coverage check:
```
npm run coverage:check
```


## Environment Variables
Create a .env file using the details provided in the team discord channel.


## API Overview
- Authentication (login, signup)
- User management
- Expense tracking
- Group management
- Balance calculations


## CI Integration

GitHub Actions automatically:
- Installs dependencies
- Runs backend tests
- Validates builds on push/PR


## Notes

- Built with Express architecture
- MongoDB for persistence
- JWT for authentication
- Mocha/Chai for testing

