# MyVidyon Intelligent Onboarding Platform

A step-by-step onboarding portal that guides new students and institutions
through sign-up, document upload, and validation, with an embedded AI assistant.

## Tech Stack
- Backend: Node.js, Express.js
- Database: PostgreSQL + Prisma ORM
- Authentication: JWT (jsonwebtoken) and bcryptjs
- Frontend: React (coming later)
- AI: LLM-powered assistant (coming later)

## Setup (Backend)
1. Install Node.js and PostgreSQL
2. Create a database named `myvidyon`
3. Open a terminal and run:
   ```bash
   cd server
   npm install
   ```
4. Copy `.env.example` to `.env`, then put your PostgreSQL password and a long random `JWT_SECRET` in it
5. Create the tables:
   ```bash
   npx prisma migrate dev
   ```
6. Start the server:
   ```bash
   npm run dev
   ```
7. Open http://localhost:5001/api/health

## API Endpoints

| Method | Address | Login needed | What it does |
|---|---|---|---|
| GET | `/api/health` | No | Checks the server and database |
| POST | `/api/auth/register` | No | Creates a new user (STUDENT or INSTITUTION) |
| POST | `/api/auth/login` | No | Returns a JWT token |
| GET | `/api/auth/me` | Yes | Returns the logged-in user |

For protected routes, send the header `Authorization: Bearer <token>`.

Example sign-up body:
```json
{
  "name": "Test Student",
  "email": "student1@example.com",
  "password": "Test@12345",
  "role": "STUDENT"
}
```

## Project Status
- [x] Phase 1: Backend foundation (Express server, PostgreSQL, Prisma schema)
- [x] Phase 2: Authentication (register, login, protected route)
- [ ] Phase 3: Frontend
- [ ] Phase 4: Onboarding steps
- [ ] Phase 5: Document upload
- [ ] Phase 6: Document validation
- [ ] Phase 7: AI assistant