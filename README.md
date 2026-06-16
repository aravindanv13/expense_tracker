# Expense Tracker - Personal Accounting & Budget Management

Expense Tracker is a full-stack web application designed to help users track expenses, customize monthly budget limits, allocate budgets across categories, and analyze spending patterns with interactive charts.

---

## 🚀 Key Features

*   **User Authentication**: JWT-based user register, login, profile retrieval, and secure token refresh.
*   **Expense CRUD**: Log, edit, and delete expense entries dynamically.
*   **Monthly Budget History**: Set a budget limit specifically for any chosen month.
*   **Category Budget Split**: Allocate monthly budget share across standard categories (`Food`, `Transport`, `Entertainment`, `Utilities`, `Healthcare`, `Other`) with real-time validation warnings preventing allocation overflows.
*   **Data Visualization**: Category spending distribution pie chart, monthly trends line chart, and budget vs actual spending bar charts.
*   **CSV Exports**: Select any month and export a detailed breakdown report to CSV.

---

## 🛠️ Technology Stack

*   **Frontend**: React (v19), Tailwind CSS, Vite, Axios, Recharts
*   **Backend**: Node.js, Express.js, MongoDB (Mongoose)
*   **Security & Encryption**: JSON Web Tokens (JWT), BcryptJS hashing

---

## 📁 Directory Structure

```text
super-pacc-project/
├── backend/                  # Express API Server
│   ├── config/               # Database setup
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth and validation middleware
│   ├── models/               # Mongoose Schemas (User, Expense)
│   ├── routes/               # API endpoint router mappings
│   ├── server.js             # Server entrypoint
│   └── .env                  # Backend environment variables
└── frontend/                 # React SPA Client
    ├── src/
    │   ├── components/       # Shared UI widgets (Navbar, Charts, ExpenseList)
    │   ├── pages/            # View pages (Login, Register, Dashboard, Analytics, Reports)
    │   ├── services/         # Axios API Client
    │   ├── App.jsx           # App routing rules
    │   └── main.jsx          # UI entrypoint
    └── .env                  # Frontend configuration
```

---

## ⚙️ Setup & Installation

Follow these steps to configure and run the project locally.

### Prerequisites
*   [Node.js](https://nodejs.org/) installed on your machine.
*   A running [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database cluster or a local MongoDB database instance.

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the `backend/` folder and specify the variables:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key_string
    JWT_EXPIRE=7d
    CORS_ORIGIN=http://localhost:5173
    ```
4. Start the backend server in development mode:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the `frontend/` folder:
    ```env
    VITE_API_URL=http://localhost:5000/api
    VITE_APP_NAME="Expense Tracker"
    VITE_APP_VERSION=1.0.0
    ```
4. Start the Vite client:
    ```bash
    npm run dev
    ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🔗 API Endpoints

### Authentication APIs (`/api/auth`)
*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Authenticate and login a user
*   `GET /api/auth/me` - Retrieve current logged-in user profile details
*   `PUT /api/auth/budget` - Save budget limit and custom category splits

### Expense APIs (`/api/expenses`)
*   `GET /api/expenses` - Retrieve all user expenses (supports category and date filtering)
*   `POST /api/expenses` - Create a new expense entry
*   `GET /api/expenses/:id` - Fetch details of a single expense entry
*   `PUT /api/expenses/:id` - Update an existing expense entry
*   `DELETE /api/expenses/:id` - Delete an expense entry
