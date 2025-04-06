---

# 🧠 Online Counseling Platform

A web application for clients to book appointments with counselors for mental health, career, or relationship support. Built using the **MERN stack** with Stripe integration for payments and email notifications for scheduling updates.

---

## 🚀 Features

- 👤 User authentication (JWT-based)
- 🧑‍⚕️ Counselor profile management
- 📅 Appointment booking, updating, and cancellation
- 💳 Payment integration with Stripe
- 📧 Email notifications for confirmation, updates, and cancellations
- 🛡️ Role-based access for clients and counselors

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- Nodemailer for email notifications
- Stripe for payment processing
- Zoom for meetings

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/sanchikamk/wellness-platform-backend.git
cd wellness-platform-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_id
EMAIL_PASS=your_gmail_app_password
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Start the Server

```bash
npm run dev
```

---

## 📁 Project Structure

```
wellness-platform-backend/
├── controller/          # Controllers for handling requests
├── database/            # Database configuration and models
├── middleware/          # Middleware functions
├── model/               # Data models
├── router/              # Routing definitions
├── templates/           # HTML templates
├── utils/               # Utility functions
├── .gitignore           # Git ignore file
├── index.js             # Main entry point
├── package-lock.json    # Dependency lock file
├── package.json         # Project metadata and dependencies
```

---

## 🤝 Contributing

Contributions are welcome! Please create an issue or submit a pull request with your changes.

---

© 2025 Wellness Platform. All rights reserved.
Built by @sanchikamk@gmail.com

