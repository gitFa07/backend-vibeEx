# Spotify Clone Backend

Backend API for a Spotify-style music streaming application built with **Node.js, Express, MongoDB, Mongoose, JWT authentication, Multer, and ImageKit**.

The API currently supports user/artist authentication, artist-only music and album creation, music uploads, and authenticated music/album retrieval.

---

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express 5** — REST API framework
- **MongoDB** — Database
- **Mongoose** — MongoDB ODM
- **JWT (JSON Web Token)** — Authentication
- **bcryptjs** — Password hashing
- **cookie-parser** — Reads authentication cookies
- **Multer** — Handles multipart/form-data and in-memory music uploads
- **ImageKit** — Cloud storage for uploaded music files
- **dotenv** — Environment variable management
- **Nodemon** — Development server auto-restart

---

## Features

### Authentication

- User registration
- User login
- User logout
- Password hashing with bcrypt
- JWT-based authentication
- Authentication stored in an HTTP cookie
- Role-based authorization for `user` and `artist`

### Music

- Artist-only music upload
- Music metadata stored in MongoDB
- Music files uploaded to ImageKit
- Retrieve available music
- Artist information populated with music records

### Albums

- Artist-only album creation
- Associate multiple music tracks with an album
- Retrieve all albums
- Retrieve an individual album by ID
- Populate album artist and music information

---

## Project Structure

```text
backend-vibeEx/
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── src/
    ├── app.js
    │
    ├── controllers/
    │   ├── auth.controller.js
    │   └── music.controller.js
    │
    ├── db/
    │   └── db.js
    │
    ├── middlewares/
    │   └── auth.middleware.js
    │
    ├── models/
    │   ├── user.model.js
    │   ├── music.model.js
    │   └── album.model.js
    │
    ├── routes/
    │   ├── auth.routes.js
    │   └── music.routes.js
    │
    └── services/
        └── storage.service.js
```

---

## Architecture

The backend follows a simple layered structure:

```text
Client
  │
  ▼
Express Routes
  │
  ├── Authentication Middleware
  │
  ▼
Controllers
  │
  ├── Mongoose Models ──────► MongoDB
  │
  └── Storage Service ──────► ImageKit
```

### Routes

Define the API endpoints and connect requests to middleware/controllers.

### Middleware

Handles authentication and role-based authorization before protected controllers execute.

### Controllers

Contain the application's business logic.

### Models

Define MongoDB document structures and relationships using Mongoose.

### Services

Handle external services such as file storage.

---

# Getting Started

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB database or MongoDB Atlas account
- ImageKit account

Check Node.js and npm:

```bash
node --version
npm --version
```

---

## Installation

Clone the repository and enter the backend directory:

```bash
git clone <your-repository-url>
cd backend-vibeEx
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

### Environment Variables

| Variable               | Description                                 |
| ---------------------- | ------------------------------------------- |
| `PORT`                 | Port on which the Express server runs       |
| `MONGO_URI`            | MongoDB connection string                   |
| `JWT_SECRET`           | Secret used to sign and verify JWTs         |
| `IMAGEKIT_PRIVATE_KEY` | Private key used by the ImageKit server SDK |

**Never commit your `.env` file to Git.**

---

# Running the Server

## Development

```bash
npm run dev
```

The development script uses Nodemon:

```text
npx nodemon server.js
```

By default, the server runs on:

```text
http://localhost:3000
```

## Production

The project currently does not define a dedicated production script. You can start the server directly with:

```bash
node server.js
```

---

# API Documentation

Base URL:

```text
http://localhost:3000
```

## Authentication

Authentication routes use the prefix:

```text
/api/auth
```

---

### Register User

```http
POST /api/auth/register
```

Creates a new user and returns a JWT through the `token` cookie.

### Request Body

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

`role` is optional and defaults to:

```text
user
```

Valid roles:

```text
user
artist
```

### Successful Response

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "USER_ID",
    "username": "john",
    "email": "john@example.com",
    "role": "user"
  }
}
```

Possible error:

```http
409 Conflict
```

when the username or email already exists.

---

### Login

```http
POST /api/auth/login
```

Logs a user in using either their username or email.

### Request Body

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

Only one of `username` or `email` is expected to identify the user.

### Successful Response

```json
{
  "message": "User logged in successfully",
  "user": {
    "id": "USER_ID",
    "username": "john",
    "email": "john@example.com",
    "role": "user"
  }
}
```

The server sets the JWT in the `token` cookie.

---

### Logout

```http
POST /api/auth/logout
```

Clears the authentication cookie.

### Response

```json
{
  "message": "User logged out successfully"
}
```

---

# Music API

Music routes use the prefix:

```text
/api/music
```

Protected routes require a valid JWT stored in the `token` cookie.

---

## Upload Music

```http
POST /api/music/upload
```

### Authorization

**Artist only**

### Content Type

```text
multipart/form-data
```

### Form Fields

| Field   | Type   | Description |
| ------- | ------ | ----------- |
| `title` | String | Music title |
| `music` | File   | Music file  |

Example:

```text
title = My Song
music = song.mp3
```

The file is temporarily stored in memory by Multer and then uploaded to ImageKit.

### Successful Response

```json
{
  "message": "Music created successfully",
  "music": {
    "id": "MUSIC_ID",
    "uri": "IMAGEKIT_FILE_URL",
    "title": "My Song",
    "artist": "ARTIST_ID"
  }
}
```

---

## Create Album

```http
POST /api/music/createAlbum
```

### Authorization

**Artist only**

### Request Body

```json
{
  "title": "My Album",
  "musics": ["MUSIC_ID_1", "MUSIC_ID_2"]
}
```

### Successful Response

```json
{
  "message": "Album created successfully",
  "album": {
    "id": "ALBUM_ID",
    "title": "My Album",
    "artist": "ARTIST_ID",
    "musics": ["MUSIC_ID_1", "MUSIC_ID_2"]
  }
}
```

---

## Get All Music

```http
GET /api/music
```

### Authorization

Authenticated `user` or `artist`.

Returns music records with the artist's username and email populated.

The current controller limits the response to **3 music records**.

### Successful Response

```json
{
  "message": "Musics fetched successfully",
  "musics": []
}
```

---

## Get All Albums

```http
GET /api/music/albums
```

### Authorization

Authenticated `user` or `artist`.

### Successful Response

```json
{
  "message": "Albums fetched successfully",
  "albums": []
}
```

Artist information is populated with:

```text
username
email
```

---

## Get Album By ID

```http
GET /api/music/albums/:albumId
```

### Authorization

Authenticated `user` or `artist`.

### Example

```http
GET /api/music/albums/64f123456789abcdef123456
```

The response includes:

- Album information
- Artist information
- Music documents belonging to the album

### Successful Response

```json
{
  "message": "Album fetched successfully",
  "album": {
    "_id": "ALBUM_ID",
    "title": "My Album",
    "artist": {},
    "musics": []
  }
}
```

---

# Authentication & Authorization

The backend uses JWT authentication stored in a cookie named:

```text
token
```

When a user registers or logs in:

```text
User
  │
  ▼
Password verified/hashed
  │
  ▼
JWT generated
  │
  ▼
JWT stored in token cookie
```

Protected requests then follow:

```text
Request
  │
  ▼
Read token cookie
  │
  ▼
Verify JWT
  │
  ▼
Check role
  │
  ▼
Attach decoded user to req.user
  │
  ▼
Controller
```

## Roles

### User

Can access:

- Music listing
- Album listing
- Individual album details

### Artist

Can access:

- Music upload
- Album creation
- Music listing
- Album listing
- Individual album details

---

# Database Models

## User

```text
User
├── username
├── email
├── password
└── role
```

### Roles

```text
user
artist
```

Username and email are unique.

Passwords are stored as bcrypt hashes rather than plaintext.

---

## Music

```text
Music
├── uri
├── title
└── artist ──► User
```

`artist` references a `User` document.

---

## Album

```text
Album
├── title
├── musics[] ──► Music
└── artist ────► User
```

An album can contain multiple music documents.

---

# File Upload Flow

Music uploads use Multer's memory storage:

```text
Client
  │
  │ multipart/form-data
  ▼
Multer
  │
  │ file.buffer
  ▼
Music Controller
  │
  │ base64
  ▼
Storage Service
  │
  ▼
ImageKit
  │
  │ URL
  ▼
MongoDB
```

Only the resulting file URL is stored in the `Music` document.

---

# Example API Flow

A typical artist workflow looks like this:

### 1. Register as an artist

```http
POST /api/auth/register
```

```json
{
  "username": "artist01",
  "email": "artist@example.com",
  "password": "password123",
  "role": "artist"
}
```

### 2. Upload a song

```http
POST /api/music/upload
```

Send:

```text
title = First Song
music = first-song.mp3
```

### 3. Create an album

```http
POST /api/music/createAlbum
```

```json
{
  "title": "First Album",
  "musics": ["MUSIC_ID_1"]
}
```

### 4. Retrieve albums

```http
GET /api/music/albums
```

### 5. Retrieve a specific album

```http
GET /api/music/albums/:albumId
```

---

# Error Responses

The API uses standard HTTP status codes.

| Status | Meaning                                |
| -----: | -------------------------------------- |
|  `200` | Request successful                     |
|  `201` | Resource successfully created          |
|  `401` | Authentication failed or token missing |
|  `403` | Authenticated but not authorized       |
|  `404` | Requested resource/user not found      |
|  `409` | Resource conflicts with existing data  |

Example:

```json
{
  "message": "Unauthorized: Token Absent"
}
```

---

# Security Notes

- Passwords are hashed using bcrypt before being stored.
- JWTs are signed using `JWT_SECRET`.
- Protected routes verify the JWT before executing controller logic.
- Artist-only operations check the authenticated user's role.
- Sensitive credentials should be stored in environment variables.
- `.env` should not be committed to source control.

For a production deployment, consider additionally configuring secure cookie options such as `httpOnly`, `secure`, and an appropriate `sameSite` policy.

---

# Future Improvements

Potential improvements for the backend include:

- Add request validation using a validation library
- Add centralized error-handling middleware
- Add pagination for music and album listings
- Add music search
- Add album update/delete endpoints
- Add music delete endpoints
- Add user profile endpoints
- Add playlists
- Add likes/favorites
- Add recently played tracks
- Add streaming-specific endpoints
- Improve upload validation and file-size limits
- Add production-ready cookie security settings
- Add automated tests
- Add API documentation with Swagger/OpenAPI
- Add rate limiting
- Add structured logging
- Add a dedicated production start script

---

# Development Notes

The application loads environment variables through `dotenv` and starts from:

```text
server.js
```

`server.js`:

1. Loads environment variables.
2. Connects to MongoDB.
3. Starts the Express server.

The Express application itself is configured in:

```text
src/app.js
```

Routes are separated into authentication and music modules.

---

## Available NPM Scripts

### Development

```bash
npm run dev
```

### Test

The project currently contains the default placeholder test script:

```bash
npm test
```

Automated tests have not yet been configured.

---

## License

This project currently uses the **ISC License** as specified in `package.json`.

---

## Author

**Enoch**

Backend project built as part of a Spotify-style music application.
