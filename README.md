# MyVidyon Intelligent Onboarding Platform

A step-by-step onboarding portal that guides new students and institutions
through sign-up, document upload, and validation, with an embedded AI assistant.

## Tech Stack
- Backend: Node.js, Express.js
- Database: PostgreSQL + Prisma ORM
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
4. Copy `.env.example` to `.env` and put your PostgreSQL password in it
5. Create the tables:
   ```bash
   npx prisma migrate dev
   ```
6. Start the server:
   ```bash
   npm run dev
   ```
7. Open http://localhost:5001/api/health

## Project Status
- [x] Phase 1: Backend foundation (Express server, PostgreSQL, Prisma schema)
- [ ] Phase 2: Authentication (sign-up and login)
- [ ] Phase 3: Frontend
- [ ] Phase 4: Onboarding steps
- [ ] Phase 5: Document upload
- [ ] Phase 6: Document validation
- [ ] Phase 7: AI assistant