## 📦 Project setup instructions

### 1️⃣ Clone the repository

```bash
git clone <repo-url>
cd hackathon-backend
```

---

### 2️⃣ Create a virtual environment

**Windows**

```bash
py -m venv venv
venv\Scripts\activate
```

**Mac / Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

> If `pip` doesn’t work on Windows:

```bash
py -m pip install -r requirements.txt
```

---

### 6️⃣ Initialize the database (first run only)

```bash
python app.py
```

(or `py app.py` on Windows)

This will:

* create the database
* prepare required tables

---

### 7️⃣ Run the app

```bash
python app.py
```

Server will be available at:

```
http://127.0.0.1:5000
```

# 🔐 Authentication API Documentation

Base URL (development):

```
http://127.0.0.1:5000
```

All requests and responses use **JSON**.

---

## 📌 Overview

This API provides:

* User registration
* User login (JWT-based)
* User logout (client-side)
* Protected endpoints

Authentication is handled using **JWT (JSON Web Tokens)**.

---

## 1️⃣ Register User

### Endpoint

```
POST /auth/register
```

### Description

Creates a new user account with a username and password.

### Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "username": "admin",
  "password": "admin"
}
```

### Successful Response

**Status:** `201 Created`

```json
{
  "msg": "User registered successfully"
}
```

### Error Responses

**User already exists**

* Status: `400 Bad Request`

```json
{
  "msg": "User already exists"
}
```

---

## 2️⃣ Login User

### Endpoint

```
POST /auth/login
```

### Description

Authenticates a user and returns a JWT access token.

### Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "username": "admin",
  "password": "admin"
}
```

### Successful Response

**Status:** `200 OK`

```json
{
  "access_token": "JWT_TOKEN_HERE"
}
```

### Error Responses

**Invalid credentials**

* Status: `401 Unauthorized`

```json
{
  "msg": "Invalid credentials"
}
```

---

## 3️⃣ Logout User

### Endpoint

There is no endpoint for logging out:

⚠️ **Note:**
This API uses **stateless JWT authentication**.
Logout is handled **client-side** by deleting the stored token.

### What logout means

* The client deletes the JWT token
* The server does not store sessions
* The token becomes unusable once removed by the client

### Example (Frontend logic)

```js
localStorage.removeItem("access_token");
```

---

## 4️⃣ Protected Endpoint (Example)

### Endpoint

```
GET /auth/protected
```

### Description

An example endpoint that requires authentication.

### Headers

```
Authorization: Bearer JWT_TOKEN_HERE
```

### Successful Response

**Status:** `200 OK`

```json
{
  "msg": "Hello user 1, you're authenticated"
}
```

### Error Responses

**Missing or invalid token**

* Status: `401 Unauthorized`

```json
{
  "msg": "Missing Authorization Header"
}
```

---