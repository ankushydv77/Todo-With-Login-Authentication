# API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication

### Register
- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: `201 Created`

### Login
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "token": "JWT_TOKEN",
    "user": { ... }
  }
  ```

### Get Current User Profile
- **Endpoint**: `GET /auth/me`
- **Header**: `Authorization: Bearer <token>`
- **Response**: `200 OK` user object.

### Update Profile
- **Endpoint**: `PUT /auth/me`
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{"bio": "New bio", "username": "NewName"}`
- **Response**: `200 OK`

### Change Password
- **Endpoint**: `PUT /auth/change-password`
- **Header**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "currentPassword": "oldPassword",
    "newPassword": "newPassword"
  }
  ```
- **Response**: `200 OK`

---

## Tasks

### Get All Tasks
- **Endpoint**: `GET /tasks`
- **Query Params**:
  - `status`: "pending" | "completed"
  - `search`: string (matches title or description)
- **Header**: `Authorization: Bearer <token>`
- **Response**: `200 OK` array of tasks.

### Create Task
- **Endpoint**: `POST /tasks`
- **Header**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Task Title",
    "description": "Optional description",
    "status": "pending" // optional
  }
  ```
- **Response**: `201 Created` task object.

### Update Task
- **Endpoint**: `PUT /tasks/:id`
- **Header**: `Authorization: Bearer <token>`
- **Body**: Any of `title`, `description`, `status`.
- **Response**: `200 OK`

### Delete Task
- **Endpoint**: `DELETE /tasks/:id`
- **Header**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
