# ✂️ SalonBook — Smart Salon Appointment Booking Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</br>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe" alt="Stripe" />
</p>

<p align="center">
  <b>A modern, full-stack salon appointment booking platform.</b>
  <br />
  Discover salon services, book appointments, manage schedules, and make secure online payments — all in one place.
</p>

<p align="center">
  <a href="https://naimur-salon-book.vercel.app/">🌐 Live Demo</a> •
  <a href="https://salon-book-server-123.vercel.app/">🌐 Server Live Demo</a> •
  <a href="https://github.com/Naimur131251/Salon-Book">💻 Client Repository</a> •
  <a href="https://github.com/Naimur131251/Salon-Book-Server">⚙️ Server Repository</a>
</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [Authentication & Security](#-authentication--security)
- [Payment Integration](#-payment-integration)
- [Project Links](#-project-links)

---

## 🌟 Overview

**SalonBook** is a full-stack salon appointment booking application designed to simplify the salon booking experience for both customers and administrators.

Customers can explore salon services, check available appointment slots, book appointments, manage their bookings, and complete payments through Stripe.

Administrators get a dedicated dashboard to manage services, appointments, customers, transactions, and their profile.

The application features role-based access control, secure authentication, real-time booking slot validation, responsive UI, and an intuitive dashboard experience.

---

## ✨ Features

<details open>
  <summary><b>🌐 Public Features</b></summary>

  - Modern landing page with animated hero section.
  - Featured salon services.
  - Service categories and dynamic service catalog.
  - Live search functionality.
  - Category-based filtering.
  - Price sorting (Low to High / High to Low).
  - Detailed service information.
  - Responsive navigation and footer.
  - Custom animated 404 page.
  - Unauthorized and blocked account pages.

</details>

<details>
  <summary><b>🔐 Authentication & Authorization</b></summary>

  - Email and password authentication.
  - Google OAuth social login.
  - Password strength validation.
  - Remember Me functionality.
  - JWT-based session authentication.
  - Role-based access control.
  - Protected dashboard routes.
  - Callback URL redirection.
  - Customer-only public registration.
  - Blocked user restrictions.

</details>

<details>
  <summary><b>👤 Customer Dashboard</b></summary>

  - Personalized dashboard overview.
  - Appointment statistics.
  - Browse and book salon services.
  - Date picker with Asia/Dhaka timezone support.
  - 8 predefined appointment time slots.
  - Real-time booked-slot detection.
  - Optional special appointment requests.
  - Appointment status filtering.
  - Appointment sorting.
  - Cancel pending appointments.
  - Online payment for confirmed appointments.
  - Transaction ID viewing and copying.
  - Profile editing.
  - ImgBB avatar upload.

</details>

<details>
  <summary><b>🛠️ Admin Dashboard</b></summary>

  - Dashboard analytics and statistics.
  - Appointment management.
  - Confirm and cancel appointments.
  - Detailed appointment information.
  - Create, edit and delete services.
  - Activate / deactivate services.
  - Service search and filtering.
  - Customer management.
  - Block / unblock users.
  - Transaction management.
  - Revenue statistics.
  - Searchable transaction history.
  - Admin profile management.

</details>

<details>
  <summary><b>💳 Payment Features</b></summary>

  - Stripe Checkout integration.
  - Server-side checkout session creation.
  - Appointment ownership verification.
  - Confirmed appointment validation.
  - Duplicate payment prevention.
  - Automatic payment tracking.
  - Payment success page with confetti.
  - Payment cancellation and retry.
  - Backend payment verification.

</details>

<details>
  <summary><b>🎨 UI / UX Features</b></summary>

  - Fully responsive design.
  - Tailwind CSS styling.
  - shadcn/ui components.
  - Smooth Motion animations.
  - Interactive dialogs and confirmation alerts.
  - Loading, error and empty states.
  - Toast notifications.
  - Dark / light theme support.
  - Modern dashboard layouts.

</details>

---

## 🧰 Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework |
| React 19 | UI development |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| shadcn/ui | UI components |
| Motion | Animations |
| Lucide React | Icons |
| Recharts | Dashboard charts |
| Sonner | Toast notifications |

### Backend & Database

| Technology | Purpose |
|---|---|
| Express.js | REST API |
| MongoDB | Database |
| Better Auth | Authentication |
| JWT | Secure API authorization |
| MongoDB Driver | Database operations |

### Payment & External Services

| Technology | Purpose |
|---|---|
| Stripe | Online payments |
| Google OAuth | Social authentication |
| ImgBB | Image hosting |
| Vercel | Frontend deployment |

---

## 🏗️ Project Architecture

SalonBook follows a two-tier architecture consisting of a Next.js frontend and an external Express.js REST API.

```text
salon-book/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (root)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...all]/
│   │   │   │       └── route.ts
│   │   │   └── checkout_sessions/
│   │   │       └── route.ts
│   │   ├── blocked/
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   └── DashboardSidebar.tsx
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   ├── appointments/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── services/
│   │   │   │   │   ├── add/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── transactions/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── customer/
│   │   │   │   ├── appointments/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── payment/
│   │   │   ├── cancel/
│   │   │   │   └── page.tsx
│   │   │   ├── success/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── services/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── unauthorized/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── icon.png
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── home/
│   │   │   ├── FeaturedServices.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ServiceCategories.tsx
│   │   │   └── WhyChooseUs.tsx
│   │   ├── shared/
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   └── ui/                    # shadcn/ui components
│   │       └── ...........
│   ├── hooks/
│   │   ├── use-highlighted-code.ts
│   │   └── use-mobile.ts
│   ├── lib/
│   │   ├── api-fetch.ts
│   │   ├── auth.ts
│   │   ├── auth-client.ts
│   │   ├── get-token.ts
│   │   ├── highlighter.tsx
│   │   ├── stripe.ts
│   │   └── utils.ts
│   └── proxy.ts
├── .env
├── .gitignore
├── AGENTS.md
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

**Architecture Highlights:**

- Next.js handles the frontend and authentication API routes.
- Express.js manages salon business-related REST APIs.
- MongoDB stores authentication and application data.
- Better Auth handles user authentication and JWT sessions.
- Stripe handles secure payment processing.
- ImgBB provides image hosting.

---

## ⚙️ Installation & Setup

Follow these steps to run SalonBook on your local machine.

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended)
- npm
- MongoDB
- Git
- Stripe account
- Google Cloud OAuth credentials
- ImgBB API key

### 1. Clone the Client Repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

### 2. Navigate to the Project Directory

```bash
cd salon-book
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the client root directory and add the required environment variables listed below.

### 5. Clone and Configure the Backend

```bash
git clone YOUR_SERVER_REPOSITORY_URL
cd salon-book-server
npm install
```

Configure the backend environment variables according to the server repository instructions.

---

## 🔑 Environment Variables

The following environment variables are required for the client application.

| Variable Name | Description |
|---|---|
| `BETTER_AUTH_SECRET` | Better Auth secret |
| `BETTER_AUTH_URL` | Authentication server URL |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Client authentication URL |
| `BETTER_AUTH_DB_URI` | MongoDB connection URI |
| `NEXT_PUBLIC_SERVER_BASE_URL` | Backend API base URL |
| `NEXT_PUBLIC_CLIENT_URL` | Frontend application URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_CURRENCY` | Payment currency |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key |

**Important:** Never commit your `.env` file or expose secret credentials in a public repository.

---

## 🚀 Running Locally

### Start the Backend Server

Open a terminal and navigate to the backend directory.

```bash
cd salon-book-server
npm run dev
```

Make sure the Express.js server is running on your configured port.

### Start the Frontend Application

Open another terminal.

```bash
cd salon-book
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

Your SalonBook application should now be running locally.

---

## 🔒 Authentication & Security

SalonBook implements several security mechanisms:

- Better Auth for secure authentication.
- JWT verification for protected API requests.
- Role-based authorization for customers and administrators.
- Protected dashboard routes.
- Blocked account restrictions.
- Appointment ownership verification.
- Server-side payment validation.
- Duplicate payment prevention.

---

## 💳 Payment Integration

SalonBook uses **Stripe Checkout Sessions** to process online payments.

Payment workflow:

```text
Customer
   │
   ▼
Select Confirmed Appointment
   │
   ▼
Create Checkout Session
   │
   ▼
Stripe Checkout
   │
   ├── Payment Successful
   │       │
   │       ▼
   │   Verify Payment
   │       │
   │       ▼
   │   Update Transaction
   │
   └── Payment Cancelled
           │
           ▼
       Retry Payment
```

For testing, Stripe provides test cards.

---

## 🔗 Project Links

| Resource | Link |
|---|---|
| 🌐 Live Website | [Visit SalonBook](https://naimur-salon-book.vercel.app/) |
| 🌐 Server Live Website | [Visit SalonBook](https://salon-book-server-123.vercel.app/) |
| 💻 Client Repository | [GitHub Client](https://github.com/Naimur131251/Salon-Book) |
| ⚙️ Server Repository | [GitHub Server](https://github.com/Naimur131251/Salon-Book-Server) |

---

<p align="center">
  <b>Built with ❤️ for a better salon booking experience.</b>
  <br />
  <sub>SalonBook — Making salon appointments smarter and easier.</sub>
</p>
