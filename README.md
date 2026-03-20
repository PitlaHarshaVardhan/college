# Leave Management System (LMS)

A production-ready Full Stack web application built for managing employee leave requests. 
This system provides role-based access for Employees and Employers to streamline the leave approval process.

![Leave Management System](https://via.placeholder.com/800x400?text=Leave+Management+System)

## 🌟 Key Features

### 👨‍💼 Employee
- **Authentication**: Secure Signup & Login with HTTP-only JWT cookies.
- **Dashboard**: View all personal leave applications and their current status.
- **Apply Leave**: Submit leave requests specifying Type, Dates, and Reason.
- **Validation**: Strict frontend and backend validation for dates and fields.

### 🏢 Employer
- **Dashboard**: Centralized view of all employee leave applications.
- **Management**: Approve or Reject pending leave requests.
- **Insights**: See detailed reasons and calculated leave duration (days).

## 🚀 Tech Stack

- **Frontend**: Vue.js 3 (Composition API), Vue Router, Tailwind CSS, Axios, Vite.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas via Mongoose.
- **Authentication**: JWT (JSON Web Tokens) in secure HTTP-only cookies, Bcrypt for password hashing.
- **Security**: Helmet, XSS-Clean, CORS, Express-Validator.

## 📁 System Architecture (MVC)

The backend follows the Model-View-Controller architecture:
- **Models**: Defines MongoDB schemas (User, Leave).
- **Controllers**: Contains business logic (Auth Controller, Leave Controller).
- **Routes**: Maps HTTP endpoints to controller functions.
- **Middlewares**: Handles global errors, route protection, and role restriction.

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB locally installed OR MongoDB Atlas URI

### 1. Clone & Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/leave_management
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES_IN=1
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
```

Start the Vue development server:
```bash
npm run dev
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register`: Create a new user (employee/employer).
- `POST /api/auth/login`: Authenticate and receive a JWT cookie.
- `GET /api/auth/logout`: Clear the JWT cookie.
- `GET /api/auth/me`: Get current logged-in user profile.

### Leave Management
- `POST /api/leaves`: Submit a leave application (Employee only).
- `GET /api/leaves/my`: Get all leaves for the logged-in user (Employee only).
- `GET /api/leaves`: Get all leave applications across the company (Employer only).
- `PATCH /api/leaves/:id/status`: Approve or reject a leave (Employer only).

## 💬 Additional Resources
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for AWS EC2 Deployment instructions.
- See [INTERVIEW.md](./INTERVIEW.md) for Architectural Decisions and Trade-offs (Interview preparation).

## 📝 License
This project is licensed under the MIT License.
