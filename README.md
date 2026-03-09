# Project Management Backend API

A scalable **Project Management Backend** built with **Node.js, Express, MongoDB, Redis, and Socket.IO**.
The system allows teams to create projects, manage members, collaborate in real-time chat, and maintain secure role-based access.

---

# 1. System Overview

This backend provides APIs and real-time services for managing collaborative projects.

Main capabilities:

* User authentication and authorization
* Project creation and team management
* Role-based permissions
* Real-time project chat
* Persistent chat history
* Redis integration for caching
* API documentation with Swagger

---

# 2. Tech Stack

| Technology           | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| Node.js              | Backend runtime environment                            |
| Express.js           | Web framework for building APIs                        |
| MongoDB              | Primary database for storing users, projects, messages |
| Mongoose             | ODM for MongoDB schema management                      |
| Redis                | Caching and fast in-memory storage                     |
| JWT (JSON Web Token) | Secure authentication and session validation           |
| Socket.IO            | Real-time messaging for project chat                   |
| Swagger (OpenAPI)    | API documentation                                      |
| Dotenv               | Environment variable management                        |

---

# 3. High-Level Architecture

```
Client
   |
   v
Express API Server
   |
   ├── Authentication Layer (JWT)
   |
   ├── Controllers
   |
   ├── Services (Business Logic)
   |
   ├── Database Layer (MongoDB via Mongoose)
   |
   ├── Redis Cache
   |
   └── Socket.IO (Realtime Chat)
```

---

# 4. Authentication Flow

Authentication is handled using **JWT tokens**.

### Flow

1. User registers or logs in
2. Server validates credentials
3. Server generates a JWT token
4. Client stores the token
5. Token is sent in Authorization header for protected routes

Example header:

```
Authorization: Bearer <token>
```

Middleware verifies the token before allowing access.

---

# 5. Project Workflow

### Project Lifecycle

```
User registers
      |
User logs in
      |
User creates project
      |
Owner adds managers
      |
Managers add members
      |
Team collaborates in chat
      |
Project can be archived or deleted
```

---

# 6. Role-Based Access Control

The system uses **three main roles**.

| Role    | Description                              |
| ------- | ---------------------------------------- |
| Owner   | Creator of the project with full control |
| Manager | Can manage team members and tasks        |
| Member  | Regular project participant              |

---

# 7. Role Permissions (Business Logic)

| Action                 | Owner | Manager | Member |
| ---------------------- | ----- | ------- | ------ |
| Create Project         | ✅     | ❌       | ❌      |
| Delete Project         | ✅     | ❌       | ❌      |
| Add Manager            | ✅     | ❌       | ❌      |
| Remove Manager         | ✅     | ❌       | ❌      |
| Add Member             | ✅     | ✅       | ❌      |
| Remove Member          | ✅     | ✅       | ❌      |
| View Project           | ✅     | ✅       | ✅      |
| Send Chat Message      | ✅     | ✅       | ✅      |
| View Chat Messages     | ✅     | ✅       | ✅      |
| Update Project Details | ✅     | ❌       | ❌      |

---

# 8. Real-Time Chat System

Each project automatically has a **chat room**.

### Chat Flow

```
User connects via Socket.IO
       |
User joins project room
       |
User sends message
       |
Message stored in MongoDB
       |
Message broadcast to all participants
```

### Chat Entities

| Entity       | Purpose                    |
| ------------ | -------------------------- |
| ChatRoom     | Represents project chat    |
| ChatMessage  | Stores individual messages |
| Participants | Users allowed to chat      |

---

# 9. Redis Usage

Redis is used for:

| Use Case                         | Purpose                            |
| -------------------------------- | ---------------------------------- |
| Caching                          | Speed up frequently requested data |
| Session Data                     | Store temporary information        |
| Rate limiting (future extension) | Protect APIs from abuse            |

---

# 10. API Endpoints Overview

## Authentication APIs

| Method | Endpoint       | Purpose           |
| ------ | -------------- | ----------------- |
| POST   | /auth/register | Register new user |
| POST   | /auth/login    | Login user        |

---

## Project APIs

| Method | Endpoint      | Purpose             |
| ------ | ------------- | ------------------- |
| POST   | /projects     | Create project      |
| GET    | /projects     | Get all projects    |
| GET    | /projects/:id | Get project details |
| PUT    | /projects/:id | Update project      |
| DELETE | /projects/:id | Delete project      |

---

## Team Management APIs

| Method | Endpoint                       | Purpose        |
| ------ | ------------------------------ | -------------- |
| POST   | /projects/:id/managers         | Add manager    |
| DELETE | /projects/:id/managers/:userId | Remove manager |
| POST   | /projects/:id/members          | Add member     |
| DELETE | /projects/:id/members/:userId  | Remove member  |

---

## Chat APIs

| Method | Endpoint                   | Purpose               |
| ------ | -------------------------- | --------------------- |
| GET    | /chat/:roomId/messages     | Get chat messages     |
| GET    | /chat/:roomId/participants | Get chat participants |

---

# 11. Socket Events

| Event       | Description                       |
| ----------- | --------------------------------- |
| connect     | User connects to socket           |
| joinRoom    | User joins project chat room      |
| sendMessage | Send message to room              |
| newMessage  | Broadcast message to participants |
| disconnect  | User disconnects                  |

---

# 12. Project Folder Structure

```
src
│
├── config
│   ├── db.js
│   ├── redis.js
│   ├── socket.js
│   └── swagger.js
│
├── controllers
│
├── services
│
├── models
│
├── routes
│
├── sockets
│
├── middlewares
│
└── app.js
```

---

# 13. Environment Variables

Example `.env` file

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/project-management
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
```

---

# 14. Running the Project

### Install dependencies

```
npm install
```

### Start server

```
npm run dev
```

Server will run at:

```
http://localhost:3000
```

---

# 15. API Documentation

Swagger documentation available at:

```
http://localhost:3000/api-docs
```

---

# 16. Future Improvements

Possible enhancements:

* Task management system
* File sharing
* Message reactions
* Notifications
* Read receipts
* Typing indicators
* Multi-server socket scaling with Redis Pub/Sub

---

# 17. Author

Backend developed as a **scalable collaborative project management system** using modern Node.js architecture.
