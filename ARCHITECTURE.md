# Expense Tracker - Final Architecture

**Project Name:** Expense Tracker (Personal Accounting and Budget Management)  
**Last Updated:** 2026-06-16  
**Status:** 🚀 In Development

---

## 📊 Project Overview

Expense Tracker is a full-stack web application designed to help users track expenses, manage budgets, and generate financial reports. Built with modern technologies, it provides a responsive UI with comprehensive backend APIs.

---

## 🏗️ Architecture Structure

```
Expense Tracker
│
├── 🎨 FRONTEND (React + Tailwind CSS + Vite)
│   │
│   ├── 🔐 Authentication
│   │   ├── Login/Register pages
│   │   ├── JWT token management
│   │   └── Protected routes
│   │
│   ├── 📊 Dashboard
│   │   ├── Summary cards (Total, Monthly, Top Category, Average)
│   │   ├── Quick stats overview
│   │   └── Navigation menu
│   │
│   ├── 💰 Expense CRUD
│   │   ├── Add expense form
│   │   ├── Edit expense form
│   │   ├── Delete with confirmation
│   │   └── Expense list with filters
│   │
│   ├── 📈 Charts & Visualization
│   │   ├── Category breakdown charts
│   │   ├── Monthly spending trends
│   │   ├── Budget vs actual charts
│   │   └── Pie/Bar/Line charts
│   │
│   └── 📄 Reports
│       ├── Monthly reports
│       ├── Category-wise reports
│       ├── Spending trends analysis
│       └── Export to PDF/CSV
│
└── 🔧 BACKEND (Node.js + Express + MongoDB)
    │
    ├── 🔐 Authentication APIs
    │   ├── POST /auth/register (User registration)
    │   ├── POST /auth/login (User login)
    │   ├── POST /auth/logout (User logout)
    │   ├── POST /auth/refresh (Refresh JWT token)
    │   └── POST /auth/forgot-password (Password recovery)
    │
    ├── 💰 Expense APIs
    │   ├── GET /api/expenses (Get all user expenses)
    │   ├── GET /api/expenses/:id (Get single expense)
    │   ├── POST /api/expenses (Create new expense)
    │   ├── PUT /api/expenses/:id (Update expense)
    │   ├── DELETE /api/expenses/:id (Delete expense)
    │   └── GET /api/expenses/filter (Filter by date range/category)
    │
    ├── 📊 Analytics APIs
    │   ├── GET /api/analytics/summary (Monthly/yearly summary)
    │   ├── GET /api/analytics/category (Spending by category)
    │   ├── GET /api/analytics/trends (Spending trends)
    │   ├── GET /api/analytics/budget (Budget analysis)
    │   └── GET /api/analytics/forecast (Spending forecast)
    │
    └── 👤 User Management
        ├── GET /api/users/profile (Get user profile)
        ├── PUT /api/users/profile (Update profile)
        ├── PUT /api/users/settings (Update settings)
        ├── POST /api/users/change-password (Change password)
        └── DELETE /api/users/account (Delete account)

```

---

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  avatar: String,
  budgetLimit: Number,
  currency: String (default: "INR"),
  timezone: String,
  emailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Expenses Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  description: String,
  amount: Number,
  category: String (enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Other']),
  date: Date,
  paymentMethod: String (optional),
  tags: [String],
  notes: String (optional),
  receipt: String (image URL, optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Budget Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  category: String,
  limit: Number,
  spent: Number,
  month: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 API Endpoints Summary

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| POST | `/auth/refresh` | Refresh JWT token |
| POST | `/auth/forgot-password` | Password recovery |

### Expense Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses |
| GET | `/api/expenses/:id` | Get single expense |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/expenses/filter` | Filter expenses |

### Analytics Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Monthly/yearly summary |
| GET | `/api/analytics/category` | Category breakdown |
| GET | `/api/analytics/trends` | Spending trends |
| GET | `/api/analytics/budget` | Budget analysis |
| GET | `/api/analytics/forecast` | Forecast spending |

### User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/users/settings` | Update settings |
| POST | `/api/users/change-password` | Change password |
| DELETE | `/api/users/account` | Delete account |

---

## 📁 Project Directory Structure

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── SummaryCard.jsx
│   │   ├── Charts.jsx
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   └── Navigation/
│   │       └── Navbar.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Expenses.jsx
│   │   ├── Reports.jsx
│   │   ├── Analytics.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Profile.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── analytics.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── App.css
├── public/
├── .env.example
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

### Backend
```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── expenseController.js
│   ├── analyticsController.js
│   └── userController.js
├── models/
│   ├── User.js
│   ├── Expense.js
│   └── Budget.js
├── routes/
│   ├── authRoutes.js
│   ├── expenseRoutes.js
│   ├── analyticsRoutes.js
│   └── userRoutes.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── utils/
│   ├── jwt.js
│   └── helpers.js
├── .env
├── .env.example
├── index.js
├── package.json
└── README.md
```

---

## 🔄 Data Flow

### User Flow - Add Expense
```
1. User fills ExpenseForm (React component)
   ↓
2. Form data validated on client-side
   ↓
3. API call to POST /api/expenses (axios)
   ↓
4. Backend validates request (middleware)
   ↓
5. Controller saves to MongoDB
   ↓
6. Response sent back with new expense
   ↓
7. Frontend updates state and UI
   ↓
8. Success message displayed
```

### Authentication Flow
```
1. User enters credentials (Login page)
   ↓
2. Form submitted to POST /auth/login
   ↓
3. Backend validates credentials
   ↓
4. JWT token generated
   ↓
5. Token stored in localStorage (client)
   ↓
6. Token added to API request headers (interceptor)
   ↓
7. Protected routes accessed
   ↓
8. Token refreshed when expired
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19.2.6
- **Build Tool:** Vite 8.0.12
- **Styling:** Tailwind CSS 4.3.1
- **HTTP Client:** Axios
- **State Management:** Context API (or Redux if needed)
- **Charting:** Chart.js or Recharts (to be installed)
- **Date Handling:** date-fns or Day.js

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB 7.0.0 with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Express-validator
- **CORS:** cors 2.8.5
- **Env Management:** dotenv 16.0.3
- **Dev Tool:** Nodemon 3.0.1

### Additional Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Development:** Visual Studio Code

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing (bcryptjs)
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ Rate limiting (to be added)
- ✅ HTTPS ready
- ✅ User authorization checks
- ✅ SQL/NoSQL injection prevention

---

## 📦 Dependencies Status

### Frontend - Installed
```json
{
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "axios": "^1.6.0",
    "tailwindcss": "^4.3.1",
    "@tailwindcss/vite": "^4.3.1"
  },
  "devDependencies": {
    "vite": "^8.0.12",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.3.0"
  }
}
```

### Backend - Installed
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### To Install (Next Phase)
- Frontend: `react-router-dom`, `recharts`, `date-fns`, `context-api`
- Backend: `bcryptjs`, `jsonwebtoken`, `express-validator`, `helmet`

---

## 🚀 Deployment Plan

### Frontend Deployment
- **Platform:** Vercel / Netlify
- **Build:** `npm run build`
- **Output:** `dist/` folder
- **Environment:** Production .env file

### Backend Deployment
- **Platform:** Heroku / Railway / AWS
- **Database:** MongoDB Atlas
- **Environment Variables:** Production .env file
- **Port:** 5000 (configurable)

---

## 📝 Development Roadmap

### Phase 1: Core Features (Current)
- [x] Project structure setup
- [x] Backend folder structure
- [x] Frontend components
- [x] Database schema
- [ ] Authentication implementation
- [ ] Expense CRUD operations

### Phase 2: Features & Analytics
- [ ] Charts & visualization
- [ ] Reports generation
- [ ] Budget management
- [ ] Analytics dashboard
- [ ] User profile management

### Phase 3: Polish & Optimization
- [ ] Error handling improvements
- [ ] Form validation
- [ ] Loading states
- [ ] Performance optimization
- [ ] Testing (unit & integration)

### Phase 4: Advanced Features
- [ ] Export to PDF/CSV
- [ ] Mobile app (React Native)
- [ ] Notifications
- [ ] Multi-currency support
- [ ] Recurring expenses

---

## 🔗 Integration Points

### Frontend ↔ Backend
```
Frontend (React)
    ↓ (HTTP/HTTPS)
Axios API Client
    ↓
Express Server
    ↓
Middleware (Auth, Validation)
    ↓
Controllers (Business Logic)
    ↓
MongoDB (Data Storage)
```

---

## 🧪 Testing Strategy

- Unit Tests: Jest
- Integration Tests: Supertest (backend)
- E2E Tests: Cypress/Playwright (frontend)
- API Testing: Postman

---

## 📊 Performance Considerations

- Pagination for large datasets
- Caching strategies (Redis - future)
- Database indexing
- API response compression
- Frontend code splitting
- Image optimization

---

## 🐛 Known Issues & TODOs

- [ ] Authentication routes need implementation
- [ ] Analytics endpoints need calculation logic
- [ ] Frontend routing setup needed
- [ ] Error boundaries needed
- [ ] Loading skeletons for better UX
- [ ] Mobile responsiveness testing
- [ ] API error handling standardization

---

## 📞 Support & Documentation

- Refer to individual README files in frontend/ and backend/
- API documentation: (To be added)
- Component documentation: (To be added)
- Deployment guide: (To be added)

---

## 👥 Team & Ownership

- **Repository:** aravindanv13/expense_tracker
- **Owner:** aravindanv13
- **Current Branch:** master
- **License:** ISC

---

**Generated:** 2026-06-16  
**Last Modified:** 2026-06-16
