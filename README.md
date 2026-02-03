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

---

## 🧠 Why these are ignored

* `instance/` → contains secrets & machine-specific config
* `__pycache__/` → Python bytecode garbage, never commit this

---

## 💡 Pro tip (optional but smart)

Add a **template** file so people know what to create:

```
instance/
└── config.example.py
```

Then mention:

> Copy `config.example.py` → `config.py` and edit values.

---

If you want, I can:

* write the **full README.md**
* suggest a **better .gitignore**
* add `.env` support (recommended)
* make onboarding literally foolproof

Say the word 👌