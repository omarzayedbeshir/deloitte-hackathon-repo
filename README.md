<div align="center">

# AMO — Inventory Management System

**Re-imagining inventory management with advanced data analytics for optimum performance**

[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.1-000?logo=flask)](https://flask.palletsprojects.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-000?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

Mohamed Khaled & Yousef Kiwi is a non-technical team member
---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running Both Services](#running-both-services)
- [Environment Variables](#environment-variables)
- [CSV Data Import](#csv-data-import)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Categories](#categories)
  - [Inventory](#inventory)
  - [Transactions](#transactions)
  - [Expiry Radar](#expiry-radar)
  - [Demand Forecasting](#demand-forecasting)
- [Database Schema](#database-schema)
- [Frontend Architecture](#frontend-architecture)
- [Contributing](#contributing)

---

## Overview

**AMO** is a full-stack inventory management system built for the Deloitte Hackathon. It combines a Flask REST API with a modern Next.js dashboard to provide real-time inventory tracking, transaction management, expiry monitoring, and **ML-powered demand forecasting** across 220 product SKUs.

---

## Features

| Feature | Description |
|---|---|
| **JWT Authentication** | Secure register / login / logout with token-based access control on protected endpoints |
| **Dashboard Overview** | 6 real-time KPIs with sparklines, period-over-period comparison, and configurable date ranges (1 d → 5 y) |
| **Interactive Charts** | Monthly sales vs. inventory, inventory health, stockout risk, expiry donut, category distribution (Recharts) |
| **Products / Inventory CRUD** | Full create, read, update, soft-delete with search, filtering (category, price, quantity, expiry range) |
| **Category Management** | CRUD with soft-delete, per-category product listing, KPI summary |
| **Transactions** | Sale & purchase flows with automatic stock adjustment, expiry validation, revenue / expense / net-profit KPIs |
| **Expiry Radar** | Classifies inventory into expired / expiring soon / safe with configurable threshold and category filter |
| **Demand Forecasting (ML)** | 220 pre-trained models — single-SKU prediction (date, temp, rain, holiday) and portfolio batch mode with gap analysis |
| **CSV Import** | Idempotent CLI script to bulk-import products & categories with column auto-detection and dry-run mode |
| **CSV Export** | Client-side export of forecast portfolio results |
| **Forecast Caching** | 1-hour TTL in-memory + localStorage cache to minimize redundant API calls |
| **Responsive UI** | Mobile-friendly sidebar, Tailwind CSS 4, Inter font, 17+ reusable UI components |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.13 · Flask 3.1 · Flask-SQLAlchemy · Flask-JWT-Extended · Flask-CORS |
| **Database** | SQLite (default, configurable via `DATABASE_URL`) |
| **ML** | joblib + pandas (pre-trained per-SKU forecasting models) |
| **Frontend** | Next.js 16.1 · React 19 · TypeScript 5 |
| **Styling** | Tailwind CSS 4 · CSS custom properties |
| **Charts** | Recharts 3.7 |
| **Icons** | Lucide React |
| **Auth** | JWT Bearer tokens · localStorage persistence |
| **API Proxy** | Next.js rewrites (`:3000/api/*` → `:5000/api/*`) |

---

## Project Structure

```
.
├── backend/
│   ├── app.py                  # Flask application & all route handlers
│   ├── auth.py                 # Auth blueprint (register / login / me)
│   ├── config.py               # App configuration (env vars)
│   ├── models.py               # SQLAlchemy models (User, Category, Inventory, Transaction)
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment variable template
│   ├── instance/
│   │   └── database.db         # SQLite database (auto-created)
│   ├── saved_models/
│   │   └── SKU0001.pkl … SKU0220.pkl   # 220 pre-trained forecast models
│   └── scripts/
│       └── import_dim_products.py      # CSV → DB import script
│
├── frontend/
│   ├── package.json
│   ├── next.config.ts          # API proxy rewrites
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   └── src/
│       ├── app/
│       │   ├── layout.tsx              # Root layout (AuthProvider, fonts)
│       │   ├── page.tsx                # Root redirect → /overview or /login
│       │   ├── (auth)/
│       │   │   ├── login/page.tsx
│       │   │   └── signup/page.tsx
│       │   └── (dashboard)/
│       │       ├── layout.tsx          # Dashboard shell (sidebar, contexts)
│       │       ├── overview/page.tsx
│       │       ├── demand-forecast/page.tsx
│       │       ├── products/page.tsx
│       │       ├── expiry-radar/page.tsx
│       │       ├── transactions/page.tsx
│       │       ├── category/page.tsx
│       │       └── …                   # warehouse, supplier, payment, roles,
│       │                                 support, settings (placeholders)
│       ├── components/
│       │   ├── auth/           # Login / signup forms, brand panel
│       │   ├── dashboard/      # Layout shell, KPI cards, sidebar
│       │   │   └── charts/     # Sparkline, MonthlyStackedBar, CategoryDonut …
│       │   ├── overview/       # OverviewKpis, SalesInventoryChart, health / risk / expiry charts
│       │   ├── demandForecast/ # ForecastControls, ForecastResult, PortfolioTable
│       │   ├── products/       # ProductsTable, modals, filters, toolbar
│       │   ├── transactions/   # TransactionsTable, modals, toolbar
│       │   ├── category/       # CategoryTable, modals, toolbar
│       │   ├── expiryRadar/    # Chart, KPIs, list
│       │   ├── ui/             # Button, Card, Modal, Toast, Input, Select, Tabs …
│       │   └── utils/          # WithSuspense HOC
│       └── lib/
│           ├── api/
│           │   ├── http.ts         # Base fetch wrapper (auth injection, error handling)
│           │   ├── endpoints.ts    # All typed API functions
│           │   ├── forecast.ts     # Predict API + batch + caching
│           │   └── inventory.ts    # Upsert helper
│           ├── analytics/
│           │   ├── overviewMetrics.ts   # KPI computation, date ranges, sparklines
│           │   ├── inventoryMetrics.ts  # Inventory health analytics
│           │   ├── expiryMetrics.ts     # Expiry analytics
│           │   └── forecastMetrics.ts   # Forecast analytics
│           ├── AuthContext.tsx      # Auth state provider
│           ├── ProductsContext.tsx  # Products state provider
│           ├── TransactionsContext.tsx # Transactions state provider
│           ├── types.ts            # All TypeScript interfaces
│           ├── cache.ts            # TTL cache (forecast)
│           ├── csv.ts              # CSV export utility
│           └── skuMap.ts           # Client-side SKU → product mapping
│
└── README.md
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| **Python** | 3.10 + |
| **Node.js** | 18 + |
| **npm** | 9 + |
| **Git** | Any recent version |

### Backend Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd deloitte-hackathon-repo

# 2. Create and activate a virtual environment
# Windows
py -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate

# 3. Install dependencies
pip install -r backend/requirements.txt

# 4. Configure environment (optional — defaults work for development)
cp backend/.env.example backend/.env
# Edit backend/.env if needed

# 5. Run the backend (auto-creates SQLite database on first run)
cd backend
python app.py
```

The API server starts at **<http://127.0.0.1:5000>**.

### Frontend Setup

```bash
# In a new terminal, from the repo root:
cd frontend

# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The frontend starts at **<http://localhost:3000>** and proxies all `/api/*` requests to the Flask backend.

### Running Both Services

You need **two terminal sessions** running simultaneously:

| Terminal | Directory | Command |
|---|---|---|
| 1 — Backend | `backend/` | `python app.py` |
| 2 — Frontend | `frontend/` | `npm run dev` |

Then open **<http://localhost:3000>** in your browser.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | `dev-secret-key` | Flask secret key |
| `JWT_SECRET_KEY` | `dev-jwt-secret-key` | JWT signing key |
| `DATABASE_URL` | `sqlite:///database.db` | SQLAlchemy connection string |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed CORS origins (comma-separated) |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `/api` (proxied) | Override API base URL for production |

> **Note:** In development no frontend `.env.local` file is needed — Next.js rewrites handle the proxy automatically.

---

## CSV Data Import

Bulk-import products and categories from a CSV file into the database:

```bash
# From repo root (with venv activated)
python backend/scripts/import_dim_products.py --csv /path/to/dim_products.csv

# Preview without writing (dry run)
python backend/scripts/import_dim_products.py --csv data.csv --dry-run --verbose

# Limit to first N rows
python backend/scripts/import_dim_products.py --csv data.csv --limit 50
```

### CLI Flags

| Flag | Description |
|---|---|
| `--csv` *(required)* | Path to the CSV file |
| `--dry-run` | Preview changes without writing to the database |
| `--limit N` | Process only the first N rows |
| `--verbose` / `-v` | Print per-row details |

### Column Auto-Detection

The script recognizes these column name variants (case-insensitive):

| Field | Accepted CSV Headers |
|---|---|
| SKU ID *(required)* | `sku_id`, `sku`, `skuid` |
| Name *(required)* | `name`, `product_name`, `product`, `title` |
| Category *(required)* | `category`, `category_name`, `cat` |
| Price | `price`, `unit_price`, `selling_price` |
| Quantity | `quantity`, `qty`, `stock` |
| Expiry | `expiry`, `expiration_date`, `exp_date`, `expire_date` |
| Description | `description`, `desc` |

### Idempotency

Safe to run multiple times. Products are matched by `sku_id` first (strongest key), then by name (fallback). Existing records are updated; no duplicates are created.

---

## API Reference

**Base URL:** `http://localhost:5000`

All protected endpoints require the header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Register a new user |
| `POST` | `/api/auth/login` | — | Login and receive a JWT |
| `GET` | `/api/auth/me` | JWT | Get current user info |

<details>
<summary><b>POST /api/auth/register</b></summary>

**Request:**

```json
{ "username": "admin", "password": "admin123" }
```

**Response (201):**

```json
{ "message": "User registered successfully" }
```

**Errors:** `400` missing fields / password < 6 chars · `409` username taken

</details>

<details>
<summary><b>POST /api/auth/login</b></summary>

**Request:**

```json
{ "username": "admin", "password": "admin123" }
```

**Response (200):**

```json
{ "access_token": "eyJ...", "username": "admin" }
```

**Errors:** `400` missing fields · `401` invalid credentials

</details>

### Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/categories` | — | List all categories |
| `POST` | `/api/categories` | JWT | Create a category |
| `PUT` | `/api/categories/:id` | JWT | Update a category |
| `DELETE` | `/api/categories/:id` | JWT | Soft-delete a category |

**Query params** for `GET`: `includeDeleted=true`

### Inventory

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/inventory` | — | List inventory with filtering |
| `POST` | `/api/inventory` | JWT | Create or upsert an item |
| `PUT` | `/api/inventory/:id` | JWT | Update an item |
| `DELETE` | `/api/inventory/:id` | JWT | Soft-delete an item |

**Query params** for `GET`:

| Param | Type | Description |
|---|---|---|
| `search` | string | Search name, category, description |
| `category` | string | Filter by exact category |
| `minQty` / `maxQty` | int | Quantity range |
| `minPrice` / `maxPrice` | float | Price range |
| `expiryFrom` / `expiryTo` | YYYY-MM-DD | Expiry date range |
| `includeDeleted` | boolean | Include soft-deleted items |

<details>
<summary><b>POST /api/inventory — Create / Upsert</b></summary>

**Request:**

```json
{
  "name": "Milk",
  "quantity": 100,
  "category": "Dairy",
  "price": 27.09,
  "expiry": "2026-03-15",
  "description": "Fresh whole milk"
}
```

**Response (201):**

```json
{
  "message": "Inventory created successfully",
  "item": { "id": "1", "sku_id": "", "name": "Milk", "quantity": 100, "..." : "..." }
}
```

If an item with the same name already exists it will be **updated** instead of duplicated.

</details>

### Transactions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/transactions` | JWT | Create a sale or purchase |
| `GET` | `/api/transactions` | JWT | List all transactions |

<details>
<summary><b>POST /api/transactions</b></summary>

**Request:**

```json
{
  "name": "Milk",
  "quantity": 5,
  "transaction_type": "sale"
}
```

- **`sale`** — decrements stock, validates expiry & availability, positive `total_price`
- **`purchase`** — increments stock, negative `total_price`

**Response (201):**

```json
{
  "message": "Transaction completed",
  "total_price": 135.45,
  "transaction": { "id": "1", "product_id": "5", "..." : "..." }
}
```

**Errors:** `400` expired / insufficient stock · `404` item not found

</details>

### Expiry Radar

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/expiry-radar` | — | Get inventory expiry breakdown |

**Query params:** `days` (default `30`), `category`

**Response:**

```json
{
  "expired": [ "..." ],
  "expiringSoon": [ "..." ],
  "safe": [ "..." ],
  "counts": { "total": 220, "expired": 5, "expiringSoon": 12, "safe": 203 }
}
```

### Demand Forecasting

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/predict` | — | Predict demand for a SKU |

**Query params:**

| Param | Type | Description | Example |
|---|---|---|---|
| `sku_id` | string | Product SKU identifier | `SKU0001` |
| `date` | string | Target date (YYYY-MM-DD) | `2026-06-01` |
| `temp` | float | Temperature in °C | `25.5` |
| `rain` | float | Rainfall in mm | `0.0` |
| `holiday` | int | Holiday flag (0 or 1) | `0` |

**Example:**

```
GET /predict?sku_id=SKU0001&date=2026-06-01&temp=25.5&rain=0&holiday=0
```

**Response (200):**

```json
{ "prediction": 42.5 }
```

> 220 pre-trained models (`SKU0001.pkl` – `SKU0220.pkl`) are stored in `backend/saved_models/`.

---

## Database Schema

```
┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
│     User     │    │    Category      │    │   Transaction    │
├──────────────┤    ├──────────────────┤    ├──────────────────┤
│ id       PK  │    │ id           PK  │    │ id           PK  │
│ username  UQ │    │ name             │    │ product_id       │
│ password     │    │ description      │    │ product_name     │
└──────────────┘    │ status           │    │ transaction_type │
                    │ created_at       │    │ product_quantity │
                    │ updated_at       │    │ total_price      │
                    └──────────────────┘    │ time_of_transaction│
                                           └──────────────────┘
                    ┌──────────────────┐
                    │    Inventory     │
                    ├──────────────────┤
                    │ id           PK  │
                    │ sku_id    UQ IDX │
                    │ name             │
                    │ expiry           │
                    │ quantity         │
                    │ category         │
                    │ price            │
                    │ description      │
                    │ status           │
                    │ created_at       │
                    │ updated_at       │
                    └──────────────────┘
```

---

## Frontend Architecture

### Pages

| Route | Status | Description |
|---|---|---|
| `/login` | ✅ | Sign in with username / password |
| `/signup` | ✅ | Create a new account |
| `/overview` | ✅ | Dashboard with KPIs, charts, date-range filtering |
| `/demand-forecast` | ✅ | Single-product & portfolio ML forecasting with CSV export |
| `/products` | ✅ | Inventory table with CRUD, search, filters, modals |
| `/expiry-radar` | ✅ | Expiry monitoring with status badges and chart |
| `/transactions` | ✅ | Transaction log with KPIs and create modal |
| `/category` | ✅ | Category management with product linking |
| `/warehouse` | 🔜 | Coming soon |
| `/supplier` | 🔜 | Coming soon |
| `/payment` | 🔜 | Coming soon |
| `/roles` | 🔜 | Coming soon |
| `/support` | 🔜 | Coming soon |
| `/settings` | 🔜 | Coming soon |

### State Management

| Provider | Purpose |
|---|---|
| **AuthContext** | JWT token, username, login / logout flows |
| **ProductsContext** | Inventory CRUD state, auto-fetches on mount |
| **TransactionsContext** | Transaction state, computed KPIs (revenue, expenses, net profit) |

### Client-Side Analytics

| Module | Purpose |
|---|---|
| `overviewMetrics.ts` | Date-range filtering, KPI aggregation, sparkline generation, period-over-period deltas |
| `inventoryMetrics.ts` | Inventory health scoring |
| `expiryMetrics.ts` | Expiry risk classification |
| `forecastMetrics.ts` | Demand gap analysis (stockout / overstock detection) |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.
