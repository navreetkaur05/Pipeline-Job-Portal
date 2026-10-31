# Pipeline — My Applications (React + Express + Axios)

A responsive job/internship application tracker based on the uploaded Pipeline design.

The signed-in UI includes an Opportunities page with searchable listings and a
resume builder with a live preview. Resume details are saved in the current
browser per account; use **Print / Save PDF** to export the preview.

## Requirements
- Node.js (LTS recommended)
- npm
- VS Code

## Run the backend
```bash
cd backend
npm install
copy .env.example .env
# Set JWT_SECRET in .env to a random secret of at least 32 characters.
# Generate one with: node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
npm run dev
```
Backend runs at http://localhost:5000

Register at `POST /api/auth/register` with `{ "email": "...", "password": "..." }`,
or sign in at `POST /api/auth/login` with the same fields. Both return a JWT.
Application API requests require `Authorization: Bearer <token>`.

## Run the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite (usually http://localhost:5173).

## API endpoints
| Method | URL | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create an account and return a JWT |
| POST | `/api/auth/login` | Verify credentials and return a JWT |
| GET | `/api/applications` | Get all applications (JWT required) |
| GET | `/api/applications/:id` | Get one application (JWT required) |
| POST | `/api/applications` | Create an application (JWT required) |

Passwords are hashed with bcrypt before being stored. Accounts and applications are
kept in memory for this assignment and are lost when the backend restarts. The UI
provides search, status/type filters, and pagination.

## GitHub
From the project root:
```bash
git init
git add .
git commit -m "Build Pipeline application tracker with React and Express"
```
Create an empty GitHub repository, then follow GitHub's instructions to add the remote and push.
