# DevPulse-

A secure and modular backend API for tracking software issues and feature requests.  
Built with Node.js, Express.js, TypeScript, PostgreSQL, JWT authentication, and raw SQL queries.

---

# 🚀 Live URL

Frontend: N/A  
Backend : https://dev-pluse-six.vercel.app

---

# 📌 Features

- User authentication with JWT
- Secure password hashing using bcrypt
- Role-based authorization system
- Contributor and Maintainer roles
- Create, update, delete, and retrieve issues
- Issue filtering and sorting support
- Centralized error handling
- Modular Express architecture
- PostgreSQL database with raw SQL queries
- TypeScript strict typing
- Environment variable configuration
- RESTful API design

---

# 🛠️ Tech Stack

## Backend
- Node.js
- Express.js
- TypeScript

## Database
- PostgreSQL
- pg (native PostgreSQL driver)

## Authentication & Security
- JSON Web Token (JWT)
- bcrypt

## Utilities
- dotenv
- cors
- http-status-codes


---

# ⚙️ Setup Instructions

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/minhazchy101/DevPulse-
```

## 2️⃣ Navigate to the Project Folder

```bash
cd devpulse
```

## 3️⃣ Install Dependencies

```bash
npm install
```

## 4️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
CONNECTION=postgresql_database_url
ACCESS_KEY_JWT=secret_key
KEY_HASH=N/M
```

---

## 5️⃣ Run Database Schema

Execute the SQL schema manually in PostgreSQL.

```sql
 CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(158) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, 
  role VARCHAR(25) DEFAULT 'contributor', 

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
      );

 CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,

        title VARCHAR(150) NOT NULL,

        description TEXT NOT NULL
        CHECK (LENGTH(description) >= 20),

        type VARCHAR(20) NOT NULL
        CHECK (type IN ('bug', 'feature_request')),

        status VARCHAR(25) DEFAULT 'open',
        reporter_id INT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
```

---

## 6️⃣ Run the Project

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

---

# 🔐 Authentication

Protected routes require JWT token in request headers:

```http
Authorization: <JWT_TOKEN>
```

---

# 📮 API Endpoints

## Authentication Routes

### Register User

```http
POST /api/auth/signup
```

### Login User

```http
POST /api/auth/login
```

---

## Issues Routes

### Create Issue

```http
POST /api/issues
```

### Get All Issues

```http
GET /api/issues
```

### Get Single Issue

```http
GET /api/issues/:id
```

### Update Issue

```http
PATCH /api/issues/:id
```

### Delete Issue

```http
DELETE /api/issues/:id
```

---

# 🗄️ Database Schema Summary

## Users Table

| Field | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| name | VARCHAR | User full name |
| email | VARCHAR | Unique email address |
| password | TEXT | Hashed password |
| role | VARCHAR | contributor / maintainer |
| created_at | TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

---

## Issues Table

| Field | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| title | VARCHAR(150) | Issue title |
| description | TEXT | Issue details |
| type | VARCHAR | bug / feature_request |
| status | VARCHAR | open / in_progress / resolved |
| reporter_id | INTEGER | Reporter user ID |
| created_at | TIMESTAMP | Issue creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

---

# 👥 User Roles

## Contributor
- Register & login
- Create issues
- View issues
- Update own issue when status is `open`

## Maintainer
- Full contributor permissions
- Update any issue
- Delete any issue
- Change issue status

---

# 🧪 HTTP Status Codes Used

| Code | Description |
|---|---|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

# 📦 Scripts

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

# 🌐 Deployment

- Backend: Vercel
- Database: Neon PostgreSQL

---

# 👨‍💻 Author

Your Name

- GitHub: https://github.com/minhazchy101
- Email: minhazchowdhury101@gmail.com

---

# 📄 License

This project is developed for educational and assignment purposes.
