# FixMate — Home & Appliance Repair Platform

**Book trusted repair professionals. Track every job. Pay after completion.**

FixMate is a full-stack, on-demand home appliance and device repair booking platform that connects customers with verified technicians. Customers can explore repair services, request appointments, track job progress in real time, and securely pay through Stripe after the service is completed.

The platform features three dedicated roles — **Customer, Technician, and Admin** — each with role-based dashboards and functionality for managing the complete repair service lifecycle.

<p align="center">
  <a href="https://fix-mate-client-tawny.vercel.app">Live Demo</a> ·
  <a href="#-features">Features</a> ·
  <a href="#-tech-stack">Tech Stack</a> ·
  <a href="#-installation--setup">Installation</a>
</p>

---

## 🌐 Live Deployment

| Platform | Link |
|---|---|
| **Live Application** | [FixMate Client](https://fix-mate-client-tawny.vercel.app) |
| **Backend API** | [FixMate Server](https://fix-mate-server-psi.vercel.app) |
| **Server Repository** | [GitHub Repository](https://github.com/tawfiqb69/FixMate-client) |
| **Client Repository** | [GitHub Repository](https://github.com/tawfiqb69/FixMate-server) |

---

## 📸 Screenshots

<!-- Add your project screenshots here -->

| Home Page | Services |
|---|---|
| <!-- Add home screenshot --> | <!-- Add services screenshot --> |

| Customer Dashboard | Admin Dashboard |
|---|---|
| <!-- Add customer dashboard screenshot --> | <!-- Add admin dashboard screenshot --> |

| Technician Dashboard | Payment |
|---|---|
| <!-- Add technician dashboard screenshot --> | <!-- Add Stripe screenshot --> |

---

## ✨ Features

### 👤 Authentication & Authorization
- Secure email and password authentication using Better Auth.
- Three role-based access levels: Customer, Technician, and Admin.
- JWT-protected backend API endpoints.
- Protected dashboards and role-specific functionality.

### 🔍 Service Discovery
- Browse available repair services.
- Server-side search functionality.
- Filter services by category and service mode.
- Sort services for easier discovery.
- View detailed service information.

### 📅 Booking Management
- Submit repair requests through a structured booking form.
- Duplicate booking request protection.
- Track booking progress through different job stages.
- Cancel eligible repair requests.
- View booking history and details.

### 🔧 Technician Dashboard
- Add, edit, and delete repair services.
- Upload service images using ImgBB.
- Toggle service availability.
- Manage incoming repair requests.
- Update job statuses as work progresses.

### 🛡️ Admin Dashboard
- Review and approve technician services.
- Manage users and update account roles.
- Monitor all platform bookings.
- View transaction records.
- Track total platform revenue.
- Access dashboard analytics and charts.

### 💳 Stripe Payment Integration
- Customers pay only after the repair job is completed.
- Secure Stripe Checkout integration.
- Dedicated payment success and cancellation pages.
- Stripe webhook integration for payment confirmation.
- Duplicate payment protection.

### 🎨 User Experience
- Responsive design for mobile, tablet, and desktop.
- Light and dark theme support.
- Interactive dashboard charts.
- Loading skeletons and feedback states.
- Empty states and error handling.
- Toast notifications for user actions.

---

## 🔄 Booking & Payment Workflow

FixMate follows a structured repair booking lifecycle:

```text
Customer
   │
   ▼
Browse Repair Services
   │
   ▼
Submit Repair Request
   │
   ▼
Technician Receives Request
   │
   ▼
Accept / Reject Request
   │
   ▼
Work In Progress
   │
   ▼
Job Completed
   │
   ▼
Customer Proceeds to Payment
   │
   ▼
Stripe Checkout
   │
   ▼
Payment Confirmation via Webhook
   │
   ▼
Transaction Recorded
```

**Booking statuses:**
- `requested`
- `accepted`
- `in progress`
- `completed`
- `rejected`
- `cancelled`

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js (App Router) | React framework and routing |
| React | Component-based UI |
| Tailwind CSS | Styling and responsive design |
| shadcn/ui | Reusable UI components |
| Base UI | Accessible UI primitives |
| Recharts | Dashboard data visualization |
| Sonner | Toast notifications |
| next-themes | Theme management |
| Lucide React | Icons |

### Backend & Database
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Better Auth | Authentication |
| JWT | API authorization |

### Payment & Media
| Technology | Purpose |
|---|---|
| Stripe | Online payment processing |
| Stripe Webhooks | Payment event verification |
| ImgBB | Service image hosting |

### Deployment & Tools
- Vercel — Frontend and backend deployment
- Git & GitHub — Version control and source code management

---

## 🧪 Demo Credentials

Use the following accounts to explore the different dashboards.

| Role | Email | Password |
|---|---|---|
| Admin | `<ADMIN_EMAIL>` | `<ADMIN_PASSWORD>` |
| Technician | `tech1@fixmate.com` | `<TECH1_PASSWORD>` |
| Technician | `tech2@fixmate.com` | `<TECH2_PASSWORD>` |
| Customer | `customer@fixmate.com` | `<CUSTOMER_PASSWORD>` |

**Stripe Test Card**

| Field | Value |
|---|---|
| Card Number | `4242 4242 4242 4242` |
| Expiry Date | Any future date |
| CVC | Any three digits |
| ZIP / Postal Code | Any valid value |

> These are Stripe test-mode credentials. No real payment will be charged.

---

## ⚙️ Installation & Setup

Follow these steps to run FixMate locally.

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended)
- npm
- MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
cd fixmate-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root and configure the required environment variables.

Use `.env.example` as your reference.

```env
# Database
MONGODB_URI=

# Authentication
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# Backend API
NEXT_PUBLIC_API_URL=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Image Hosting
IMGBB_API_KEY=
```

> Environment variable names may vary depending on your project configuration. Always follow the actual `.env.example` file.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Security & Best Practices

- Sensitive credentials are stored in environment variables.
- Real API keys and secrets are excluded from version control.
- Protected API endpoints require valid authentication.
- Role-based authorization restricts access to privileged operations.
- Stripe webhook events are used to verify payment completion.
- Duplicate booking and payment operations are protected.

---

## 📁 Project Architecture

```text
fixmate/
│
├── fixmate-client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
└── fixmate-server/
    ├── routes/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── config/
    └── ...
```

*The directory structure above is illustrative. Refer to the respective repositories for the complete implementation.*

---

## 🎯 Project Highlights

Building FixMate involved working with several real-world full-stack development concepts:

- Implementing multi-role authentication and authorization.
- Designing RESTful APIs with protected endpoints.
- Managing a complete booking and job-status lifecycle.
- Integrating Stripe Checkout and webhook-based payment verification.
- Preventing duplicate booking and payment operations.
- Building role-specific dashboards and data visualizations.
- Handling file uploads and responsive user interfaces.
- Deploying frontend and backend applications to Vercel.

---

## 👨‍💻 Developer

**SM Tawfiq**

Full-Stack Web Developer | CSE Student

- GitHub: [@tawfiqb69](https://github.com/tawfiqb69)
- Portfolio: [Visit Portfolio](YOUR_PORTFOLIO_URL)
- LinkedIn: [SM Tawfiq](https://www.linkedin.com/in/sm-tawfiq/)

---

<p align="center">
  <b>FixMate — Making Repair Services Simple, Reliable, and Accessible.</b>
  <br />
  Built with ❤️ by SM Tawfiq
</p>