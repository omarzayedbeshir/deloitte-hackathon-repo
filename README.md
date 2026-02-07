## 📦 Project Setup Instructions

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

### 4️⃣ Configure environment variables

Create a `.env` file (or configure directly in `config.py`) and set:

```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
SQLALCHEMY_DATABASE_URI=sqlite:///database.db
```

---

### 5️⃣ Initialize the database (first run only)

```bash
python app.py
```

(or `py app.py` on Windows)

This will:

* create the database
* create all required tables (Inventory & Transactions)

---

### 6️⃣ Run the app

```bash
python app.py
```

Server will be available at:

```
http://127.0.0.1:5000
```

---

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
* Protected inventory management
* Public transaction creation

Authentication is handled using **JWT (JSON Web Tokens)**.

---

## 1️⃣ Register User

### Endpoint

```
POST /auth/register
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

---

## 2️⃣ Login User

### Endpoint

```
POST /auth/login
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

---

## 3️⃣ Logout User

⚠️ **Note:**
This API uses **stateless JWT authentication**.

There is **no logout endpoint**.
Logout is handled client-side by deleting the stored token.

```js
localStorage.removeItem("access_token");
```

---

# 📦 Inventory API Documentation

## 4️⃣ Add / Update Inventory (Protected)

### Endpoint

```
POST /inventory
```

### Authentication Required

```
Authorization: Bearer JWT_TOKEN_HERE
```

### Description

* Adds a new inventory item
* If the item already exists (same name), it updates:

  * quantity
  * price
  * category
  * expiry
  * description

### Request Body

```json
{
  "name": "Milk",
  "expiry": "2026-01-01",
  "quantity": 10,
  "category": "Dairy",
  "price": 2.5,
  "description": "Low fat milk"
}
```

### Required Fields

* `name`
* `quantity`
* `category`
* `price`

### Successful Response

**Status:** `201 Created`

```json
{
  "message": "Inventory saved successfully"
}
```

### Error Responses

**Missing required fields**

```json
{
  "error": "Missing required fields"
}
```

---

# 💳 Transactions API Documentation

## 5️⃣ Create Transaction

### Endpoint

```
POST /transactions
```

### Description

Creates a transaction and:

* checks item existence
* checks expiry date
* checks available quantity
* deducts stock
* calculates total price

⚠️ **No authentication required**

### Request Body

```json
{
  "name": "Milk",
  "quantity": 2
}
```

### Successful Response

**Status:** `201 Created`

```json
{
  "message": "Transaction completed",
  "total_price": 5.0
}
```

### Error Responses

**Item not found**

```json
{
  "error": "Item not found"
}
```

**Item expired**

```json
{
  "error": "Item is expired"
}
```

**Insufficient stock**

```json
{
  "error": "Insufficient stock"
}
```

---

## 🧠 Notes

* Dates must be in `YYYY-MM-DD` format
* Expired items cannot be sold
* Inventory quantity is automatically updated after each transaction
* Database tables are auto-created on app startup

---