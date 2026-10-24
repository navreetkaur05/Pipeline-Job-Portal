# Pipeline — My Applications (React + Express + Axios)

A responsive job/internship application tracker based on the uploaded Pipeline design.

## Requirements
- Node.js (LTS recommended)
- npm
- VS Code
- MongoDB (local installation or hosted MongoDB Atlas database)

## Run the backend
```bash
cd backend
npm install
npm run dev
```
Create a `backend/.env` file (copy `backend/.env.example`) and set `MONGODB_URI` to your local or hosted MongoDB connection string. The default is `mongodb://127.0.0.1:27017/pipeline`. The backend runs at http://localhost:5000.

Test:
- GET http://localhost:5000/api/applications
- GET http://localhost:5000/api/applications/<mongodb-id>
- POST http://localhost:5000/api/applications

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
| GET | `/api/applications` | Get all applications |
| GET | `/api/applications/:id` | Get one application |
| POST | `/api/applications` | Create an application |
| PATCH | `/api/applications/:id` | Update application fields |
| DELETE | `/api/applications/:id` | Delete an application |

Applications are stored in MongoDB. Creating an application requires non-empty `company` and `role` strings. Optional fields are validated against the supported application types, statuses, dates, and field length limits. Invalid ids or request fields return a `400` response; missing records return `404`.

## GitHub
From the project root:
```bash
git init
git add .
git commit -m "Build Pipeline application tracker with React and Express"
```
Create an empty GitHub repository, then follow GitHub's instructions to add the remote and push.
