# Technical Interview Guide

This document is designed to help explain the architecture, design decisions, and trade-offs of the Leave Management System to recruiters and senior engineers.

## 🏗️ 1. Architecture Overview

**Question:** *Explain the overall architecture of this application.*
**Answer:** 
The application utilizes a classic Monolithic Two-Tier Architecture consisting of a Single Page Application (SPA) frontend and a RESTful API backend.
- **Frontend Layer:** Built with Vue.js 3 and TailWind CSS. Vue 3 Composition API provides reactive state management with minimal boilerplate. Vue Router handles client-side routing, providing a seamless SPA experience without page reloads.
- **Backend Layer:** A Node.js runtime using the Express.js framework. It serves as a REST API following the MVC (Model-View-Controller) design pattern.
- **Data Layer:** MongoDB via Mongoose ORM. It provides strict schema validation at the application level while maintaining the flexibility of a NoSQL database.

## 🧠 2. Design Decisions & Trade-offs

### Why Vue.js over React/Angular?
**Decision:** Selected Vue.js 3 with Composition API.
**Reasoning & Trade-off:** Vue provides a gentler learning curve and extremely clean separation of concerns within single-file components (SFCs). The Composition API offers superior logic reuse compared to React Hooks (no stale closures, runs once during setup). The trade-off is a slightly smaller enterprise job market ecosystem compared to React, but it perfectly fits the rapid development of this module.

### Why JWTs in HTTP-Only Cookies vs Local Storage?
**Decision:** Authentication tokens are stored in `httpOnly` cookies rather than `localStorage`.
**Reasoning & Trade-off:** Storing JWTs in `localStorage` makes the application highly vulnerable to Cross-Site Scripting (XSS) attacks, where malicious scripts can steal the token. By using `httpOnly` cookies, the browser automatically attaches the token to requests, but JavaScript cannot access it, mitigating XSS. 
**Trade-off:** This requires setting up CORS properly (`credentials: true`) and protects against XSS but introduces a slight risk of Cross-Site Request Forgery (CSRF). However, modern browsers use `SameSite` cookie attributes which natively mitigate most CSRF vectors.

### Why NoSQL (MongoDB) over SQL (PostgreSQL)?
**Decision:** Used MongoDB.
**Reasoning & Trade-off:** The data model for a leave request is relatively simple and hierarchical (Leave -> Belongs to Employee). MongoDB allowed for rapid iteration without needing rigid database migrations (like Prisma or Sequelize). 
**Trade-off:** MongoDB lacks complex ACID-compliant multi-row joins compared to SQL. If this system scaled to handle complex payroll calculations requiring cross-table financial integrity, PostgreSQL would be a better choice. However, for a standard Leave Management MVP, MongoDB is optimal.

## 🚀 3. Scalability & Future Improvements

**Question:** *How would you scale this application if the company grows to 10,000 employees?*
**Answer:**

1. **Database Scaling:** 
   - Implement database indexing (e.g., placing an index on `employee` and `status` in the Leave collection to speed up queries).
   - Implement pagination on the Employer Dashboard instead of loading all leaves at once.

2. **Backend Scaling:**
   - Horizontally scale the Node.js instances behind an AWS Application Load Balancer (ALB).
   - Since our authentication is stateless (JWT in cookies), spanning multiple backend instances requires zero session stickiness configuration.

3. **Feature Additions:**
   - **Email Notifications:** Integrate AWS SES or SendGrid to email the employee when a leave is approved or rejected.
   - **Audit Trails:** Implement a `History` table to document who approved/rejected the leave and at what timestamp.
   - **Timezone Handling:** Convert all dates to UTC on the backend and standardize timezone offsets.

## 🛡️ 4. Security Measures Implemented

- **Password Hashing:** `bcryptjs` is used to hash passwords with a salt factor of 12.
- **Helmet:** Sets various strictly configured HTTP headers to secure the Express app.
- **XSS-Clean:** Sanitizes user input coming from POST body, GET queries, and url params to prevent Cross-Site Scripting.
- **Catch Async Wrapper:** Removes the need for messy `try/catch` blocks in controllers and ensures no unhandled promise rejections crash the Node process.
