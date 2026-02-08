# NoteBook

A full-stack web application for managing personal notes and bookmarks, built with the MERN stack (MongoDB, Express, React, Node.js) and Next.js with Tailwind CSS.

## Project Overview

This application allows users to:
- Save and search notes with tags
- Save bookmarks with URLs, titles, and descriptions
- Filter and search items by text and tags
- Mark notes and bookmarks as favorites
- Auto-fetch page titles from bookmark URLs (bonus feature)
- Optional user authentication with JWT
- Responsive design for all devices

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Web Scraping**: axios + cheerio (for auto-fetching titles)

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **HTTP Client**: axios
- **State Management**: React Hooks (useState, useEffect)


## Quick Start

### 1. Clone the Repository
```bash
git clone <https://github.com/alokchaturvedi44/NoteBook>
cd BookMark-App
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update MONGODB_URI, JWT_SECRET, etc.

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:2500`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# BACKEND_URL=http://localhost:2500/api

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend `.env` file


##  API Endpoints

### Notes API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notes` | Create a new note |
| GET | `/api/notes` | Get all notes (with search/filter) |
| GET | `/api/notes/:id` | Get a single note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

### Bookmarks API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookmarks` | Create a new bookmark |
| GET | `/api/bookmarks` | Get all bookmarks (with search/filter) |
| GET | `/api/bookmarks/:id` | Get a single bookmark |
| PUT | `/api/bookmarks/:id` | Update a bookmark |
| DELETE | `/api/bookmarks/:id` | Delete a bookmark |

### Authentication API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

Example: `/api/notes?q=javascript&tags=tutorial,coding`


## Testing the API

You can test the API using curl, Postman, or any HTTP client.

### Example: Create a Note
```bash
curl -X POST http://localhost:2500/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Note",
    "content": "This is a test note",
    "tags": ["test", "example"]
  }'
```

### Example: Create a Bookmark (Auto-fetch Title)
```bash
curl -X POST http://localhost:2500/api/bookmarks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com",
    "tags": ["development"]
  }'
```

### Example: Search Notes
```bash
curl "http://localhost:2500/api/notes?q=test&tags=example"
```

For detailed information, see:
- [Backend README](./backend/README.md) - API documentation and backend setup
- [Frontend README](./frontend/README.md) - UI documentation and frontend setup



