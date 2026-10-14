# TaskFlow - Task & Team Management Platform

A full stack task management app where users can create tasks, assign them to team members and track progress. Built with the MERN stack as part of the Full Stack Intern assessment.

## Live Demo

- **Frontend:** https://your-app.vercel.app _(update after deploying)_
- **Backend:** https://your-api.onrender.com _(update after deploying)_

> Note: Backend is on Render free plan so the first request can take ~30-50 seconds to wake up.

## Login Credentials

| Role  | Email                | Password   |
| ----- | -------------------- | ---------- |
| User  | testuser@example.com | Test@1234  |
| Admin | admin@example.com    | Admin@1234 |

Both accounts are created by the seed script (`npm run seed` inside `server`).

- **User** can see tasks created by them or assigned to them
- **Admin** can see and manage all tasks

## Features

- Register / Login with JWT authentication
- Passwords hashed using bcrypt
- Remember me (token stored in localStorage for 30 days, otherwise sessionStorage for 1 day)
- Protected routes + auto logout when token is invalid or expired
- Dashboard with Total / Pending / In Progress / Completed cards
- Create, edit, delete and view task details
- Assign tasks to any registered user
- Search by title, filter by status & priority, sort by date
- Form validation on both frontend and backend
- Responsive UI with sidebar and navbar

### Bonus Features

- 🌙 Dark mode (saved in localStorage)
- 📄 Pagination
- 📊 Charts (tasks by status and priority using Recharts)
- 🔔 Toast notifications (react-hot-toast)

## Tech Stack

**Frontend:** React, Vite, React Router, Redux Toolkit, Axios, Tailwind CSS, Recharts, React Hot Toast

**Backend:** Node.js, Express, Mongoose, JWT, bcryptjs

**Database:** MongoDB Atlas

**Deployment:** Vercel (frontend), Render (backend)

## Screenshots

_Add screenshots here after running the app_

| Login | Dashboard |
| ----- | --------- |
| ![login](screenshots/login.png) | ![dashboard](screenshots/dashboard.png) |

| Tasks | Dark Mode |
| ----- | --------- |
| ![tasks](screenshots/tasks.png) | ![dark](screenshots/dark-mode.png) |

## Folder Structure

```
assignment/
├── client/
│   ├── public/
│   └── src/
│       ├── components/   # Navbar, Sidebar, TaskCard, TaskForm, charts etc
│       ├── pages/        # Login, Register, Dashboard, Tasks, TaskDetails...
│       ├── hooks/        # useDebounce, useDarkMode, useUsers
│       ├── services/     # axios instance and api calls
│       ├── utils/        # validation, helpers, storage
│       ├── store/        # redux store and slices
│       ├── App.jsx
│       └── main.jsx
├── server/
│   ├── config/           # database connection
│   ├── controllers/      # route logic
│   ├── middleware/       # auth + error handling
│   ├── models/           # User and Task schema
│   ├── routes/
│   ├── app.js
│   ├── server.js
│   └── seed.js           # creates test accounts + sample tasks
├── TaskFlow.postman_collection.json
└── README.md
```

## Setup (Local Development)

### Requirements
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2. Backend

```bash
cd server
npm install
```

Create a `.env` file in `server` folder (see `.env.example`):

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string
CLIENT_URL=http://localhost:5173
```

Seed the test accounts and start the server:

```bash
npm run seed
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend

```bash
cd client
npm install
```

Create a `.env` file in `client` folder:

```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

App will run on `http://localhost:5173`

## API Documentation

Base URL: `http://localhost:5000/api`

All requests and responses are JSON. Protected routes need this header:

```
Authorization: Bearer <token>
```

### Auth

#### POST `/register`

Request:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "rahul123"
}
```

Response `201`:
```json
{
  "_id": "6650f1c2a1b2c3d4e5f6a7b8",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Errors: `400` missing fields / invalid email / weak password / user already exists

#### POST `/login`

Request:
```json
{
  "email": "testuser@example.com",
  "password": "Test@1234",
  "rememberMe": true
}
```

Response `200`: same as register

Errors: `400` missing fields, `401` invalid email or password

#### GET `/me` 🔒
Returns the logged in user.

### Tasks 🔒

#### GET `/tasks`

Query params (all optional):

| Param    | Values                                          |
| -------- | ----------------------------------------------- |
| search   | text to search in title                         |
| status   | `pending`, `in-progress`, `completed`           |
| priority | `low`, `medium`, `high`                         |
| sort     | `newest` (default), `oldest`, `dueDate-asc`, `dueDate-desc` |
| page     | page number (default 1)                         |
| limit    | items per page (default 6, max 50)              |

Response `200`:
```json
{
  "tasks": [
    {
      "_id": "6650f2...",
      "title": "Design login page",
      "description": "Make login and register page UI",
      "priority": "medium",
      "status": "in-progress",
      "dueDate": "2026-10-16T00:00:00.000Z",
      "assignedTo": { "_id": "...", "name": "Test User", "email": "testuser@example.com" },
      "createdBy": { "_id": "...", "name": "Admin", "email": "admin@example.com" },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "page": 1,
  "totalPages": 1,
  "total": 1
}
```

#### GET `/tasks/stats`

Response `200`:
```json
{
  "total": 5,
  "pending": 2,
  "inProgress": 1,
  "completed": 2,
  "byPriority": { "low": 2, "medium": 1, "high": 2 }
}
```

#### GET `/tasks/:id`
Returns a single task. `404` if not found, `400` if id is invalid.

#### POST `/tasks`

Request:
```json
{
  "title": "Prepare sprint report",
  "description": "Collect updates from team",
  "priority": "high",
  "status": "pending",
  "dueDate": "2026-12-31",
  "assignedTo": "<userId>"
}
```

`title`, `dueDate` and `assignedTo` are required. Response `201` with the created task.

#### PUT `/tasks/:id`
Send only the fields you want to update. Response `200` with the updated task.

#### DELETE `/tasks/:id`
Only the creator or an admin can delete. Response:
```json
{ "message": "Task deleted successfully", "id": "6650f2..." }
```

### Users 🔒

#### GET `/users`
Returns list of users (name, email, role). Used for the "Assign To" dropdown.

### Error Responses

All errors have this format:
```json
{ "message": "Task not found" }
```

| Code | When |
| ---- | ---- |
| 400  | Invalid request / validation error / invalid id |
| 401  | No token, invalid token, or expired token |
| 403  | Not allowed to access the task |
| 404  | Task or route not found |
| 500  | Server error |

On the frontend, network errors show a "Network error" message, and a 401 logs the user out automatically.

## Postman Collection

Import `TaskFlow.postman_collection.json` in Postman. Run **Login** first, it saves the token automatically for the other requests.

## Deployment

**Backend (Render)**
1. New Web Service → connect GitHub repo
2. Root directory: `server`
3. Build command: `npm install`, Start command: `npm start`
4. Add env variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your vercel url)

**Frontend (Vercel)**
1. Import repo → Root directory: `client`
2. Framework: Vite
3. Add env variable `VITE_API_URL=https://your-api.onrender.com/api`
4. `vercel.json` is added to handle page refresh on routes

**MongoDB Atlas**
- Allow access from anywhere (`0.0.0.0/0`) in Network Access so Render can connect
- Run `npm run seed` once with the Atlas URI to create the test accounts

## Things I would improve with more time

- Drag and drop tasks between status columns
- Email verification
- Unit tests
- Comments on tasks
