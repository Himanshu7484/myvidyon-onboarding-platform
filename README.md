# MyVidyon Intelligent Onboarding Platform

A step-by-step onboarding portal that guides new students and institutions
through sign-up, document upload, and validation, with an embedded AI assistant.

## Tech Stack
- Frontend: React (Vite), React Router
- Backend: Node.js, Express.js
- Database: PostgreSQL + Prisma ORM
- Authentication: JWT (jsonwebtoken) and bcryptjs
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

## Setup (Frontend)
1. In a second terminal tab, run:
   ```bash
   cd client
   npm install
   npm run dev
   ```
2. Open http://localhost:5173
3. The backend must be running on port 5001 at the same time

## Onboarding Steps

Each account type has its own list of steps. The steps are defined in
`server/src/config/onboardingSteps.js`, and each user's progress is saved
in the `OnboardingStep` table.

| Student | Institution |
|---|---|
| 1. Personal details | 1. Institution details |
| 2. Academic details | 2. Contact person |
| 3. Upload documents | 3. Upload documents |
| 4. Review and submit | 4. Review and submit |

Rules:
- Steps must be completed in order.
- A completed step cannot be reopened.
- When all steps are completed, the user's onboarding status becomes `SUBMITTED`, and no further changes are allowed.
- The onboarding status moves from `NOT_STARTED` to `IN_PROGRESS` after the first step is saved.

## Frontend Pages

| Address | Login needed | What it shows |
|---|---|---|
| `/` | No | Home page with links |
| `/register` | No | Sign-up form (student or institution) |
| `/login` | No | Login form, then goes to the dashboard |
| `/dashboard` | Yes | The user's details, onboarding status and a button to the steps |
| `/onboarding` | Yes | Step-by-step onboarding with a progress bar |

The login token is saved in the browser, and protected pages redirect to `/login` if there is no valid token.

## API Endpoints

| Method | Address | Login needed | What it does |
|---|---|---|---|
| GET | `/api/health` | No | Checks the server and database |
| POST | `/api/auth/register` | No | Creates a new user (STUDENT or INSTITUTION) |
| POST | `/api/auth/login` | No | Returns a JWT token |
| GET | `/api/auth/me` | Yes | Returns the logged-in user |
| GET | `/api/onboarding` | Yes | Returns the user's steps, progress and status |
| PUT | `/api/onboarding/steps/:stepKey` | Yes | Updates one step (`IN_PROGRESS` or `COMPLETED`) |

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

Example step update (`PUT /api/onboarding/steps/personal-details`):
```json
{
  "status": "COMPLETED"
}
```

Possible errors for a step update: `400` (invalid status, a previous step is not completed, the step is already completed, or onboarding is already submitted), `401` (not logged in) and `404` (step not found).

## Project Status
- [x] Phase 1: Backend foundation (Express server, PostgreSQL, Prisma schema)
- [x] Phase 2: Authentication (register, login, protected route)
- [x] Phase 3: Frontend (register, login, protected dashboard)
- [x] Phase 4: Onboarding steps (progress saved in the database)
- [ ] Phase 5: Document upload
- [ ] Phase 6: Document validation
- [ ] Phase 7: AI assistant