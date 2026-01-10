💳 Payment Gateway – Full Stack Project

A complete Payment Gateway simulation system built using:

Backend: Node.js, Express, PostgreSQL

Frontend Dashboard: React (Vite)

Checkout Page: Vanilla HTML/CSS/JS

Database: PostgreSQL

Containerization: Docker + Docker Compose

This project simulates real-world payment flows like Stripe/Razorpay sandbox, including:

Order creation

Payments via UPI / Card

Payment status polling

Dashboard analytics

Transactions list

Authentication using API keys

✨ Features
🔐 Authentication

API Key + API Secret based authentication for protected endpoints.

📦 Orders

Create payment orders via API.

💳 Payments

Pay using:

UPI (simulated)

Card (simulated)

Random success/failure simulation.

Status transitions:

processing → success | failed

📊 Dashboard

Total transactions

Total processed amount

Success rate

Displays API credentials

📄 Transactions Page

Paginated styled table

Shows:

Payment ID

Order ID

Amount

Method

Status (color-coded)

Created timestamp

🧾 Checkout Page

Public payment page

Accepts order_id from URL

Supports UPI and Card

Shows:

Processing

Success

Failure

🧱 Architecture
payment-gateway/
│
├── backend/           # Express API + PostgreSQL
├── frontend/          # React dashboard (Vite + Nginx)
├── checkout-page/     # Public checkout HTML page
├── docker-compose.yml
└── README.md

⚙️ Tech Stack
Layer	Technology
Backend	Node.js, Express
Database	PostgreSQL
Frontend	React + Vite
Styling	CSS
Infra	Docker, Docker Compose
Auth	API Key + Secret
Hosting	Local containers
🚀 How to Run the Project
1. Requirements

Docker

Docker Compose

Node.js (optional if running locally)

2. Start Everything

From project root:

docker compose down
docker compose build --no-cache
docker compose up


Wait until you see logs like:

gateway_api   Server running on port 8000
gateway_dashboard ready on :3000
gateway_checkout ready on :3001
postgres healthy

🌐 Access URLs
Service	URL
Dashboard	http://localhost:3000

Checkout Page	http://localhost:3001

Backend API	http://localhost:8000
🔑 API Credentials (Seeded)
API Key:    key_test_abc123
API Secret: secret_test_xyz789


Used in all protected endpoints.

🧪 API Usage (cURL Examples)
➤ Create Order
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789" \
  -d '{"amount":50000}'


Response:

{
  "id": "order_abcd123",
  "amount": 50000,
  "status": "created"
}

➤ Make UPI Payment
curl -X POST http://localhost:8000/api/v1/payments \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789" \
  -d '{
    "order_id": "order_abcd123",
    "method": "upi",
    "vpa": "user@paytm"
  }'

➤ Make Card Payment
curl -X POST http://localhost:8000/api/v1/payments \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789" \
  -d '{
    "order_id": "order_abcd123",
    "method": "card",
    "card": {
      "number": "4111111111111111",
      "expiry_month": "12",
      "expiry_year": "2026",
      "cvv": "123",
      "holder_name": "John Doe"
    }
  }'

➤ List All Payments (used by dashboard)
curl http://localhost:8000/api/v1/payments \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789"

🧾 Checkout Page Usage

Create an order using API

Open browser:

http://localhost:3001/?order_id=order_abcd123


Pay using UPI or Card

See success/failure UI

📊 Dashboard Pages
Page	URL
Login	http://localhost:3000

Dashboard	http://localhost:3000/dashboard

Transactions	http://localhost:3000/transactions

Login accepts any email/password (mock login).

💾 Data Persistence

PostgreSQL runs inside Docker.
If volume is configured, data persists across restarts.

To confirm:

docker compose ps

✅ Evaluation Checklist

This project demonstrates:

✔ RESTful API design

✔ Authentication middleware

✔ PostgreSQL integration

✔ Real database queries

✔ Dockerized microservices

✔ Full React dashboard

✔ Public checkout system

✔ UI state handling (loading, success, failure)

✔ Professional UI

✔ Production-like architecture

This is equivalent to a real-world fintech backend simulation.

📌 Possible Improvements (optional ideas)

JWT login system

Admin roles

Pagination for transactions

Payment filters

Webhooks simulation

Redis queue for async processing

Rate limiting

Swagger docs


👨‍💻 Author
Built by: K.Tanoo sree
Student Id: 23A91A05A7
Role: Full Stack Developer
Stack: React, Node.js, PostgreSQL, Docker