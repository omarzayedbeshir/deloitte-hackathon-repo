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

> If `pip` doesn’t work on Windows: `py -m pip install -r requirements.txt`

---

### 4️⃣ Configure environment variables

Create a `.env` file in the root directory and set:

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

This will automatically create the SQLite database and the required tables (**Inventory** & **Transactions**).

---

### 6️⃣ Run the app

```bash
python app.py

```

The server will be available at: `http://127.0.0.1:5000`

---

# 🔐 Authentication API

All requests and responses use **JSON**. Authentication is handled via **JWT**.

## 1️⃣ Register User

* **Endpoint:** `POST /auth/register`
* **Body:** `{"username": "admin", "password": "admin"}`
* **Response:** `201 Created`

## 2️⃣ Login User

* **Endpoint:** `POST /auth/login`
* **Body:** `{"username": "admin", "password": "admin"}`
* **Response:** `200 OK` — Returns `access_token`.

## 3️⃣ Logout User

This API uses **stateless JWT**. Logout is handled client-side by deleting the stored token:

```js
localStorage.removeItem("access_token");

```

---

# 📦 Inventory API

## 4️⃣ Add / Update Inventory (Protected)

* **Endpoint:** `POST /inventory`
* **Auth Required:** `Authorization: Bearer <JWT_TOKEN>`
* **Description:** Adds a new item or updates existing fields (quantity, price, etc.) if the name matches.
* **Required Fields:** `name`, `quantity`, `category`, `price`

---

# 💳 Transactions API

## 5️⃣ Create Transaction

* **Endpoint:** `POST /transactions`
* **Auth Required:** None
* **Description:** Creates a transaction, checks for expiry/stock, and automatically deducts inventory.
* **Body:** `{"name": "Milk", "quantity": 2}`

---

# 🧠 Demand Forecasting API

## 6️⃣ Predict Product Demand

* **Endpoint:** `GET /predict`
* **Description:** Uses pre-trained machine learning models (`.pkl` files) to forecast demand based on environmental factors.

### Query Parameters

| Parameter | Type | Description | Example |
| --- | --- | --- | --- |
| `sku_id` | `string` | Unique identifier for the product model | `SKU0001` |
| `date` | `string` | Target date for prediction (`YYYY-MM-DD`) | `2024-06-01` |
| `temp` | `float` | Expected temperature in Celsius | `25.5` |
| `rain` | `float` | Expected rainfall in mm | `0.0` |
| `holiday` | `int` | Binary flag (1 = Holiday, 0 = Normal) | `0` |

### Example Request

```text
GET /predict?sku_id=SKU0001&date=2024-06-01&temp=25.5&rain=0&holiday=0

```

### Response

**Status:** `200 OK`

```json
{
  "prediction": 42.5
}

```

---

## 📝 Important Notes

* **Model Storage:** Prediction models must be stored in the `/saved_models` directory as `<sku_id>.pkl`.
* **Date Format:** All dates must be in `YYYY-MM-DD` format.
* **Logic:**
* Expired items cannot be sold in transactions.
* Inventory quantity is automatically updated after each successful transaction.
* Database tables are auto-created on app startup.