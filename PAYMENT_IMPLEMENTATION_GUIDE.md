# Payment Implementation Guide

This document explains the end-to-end flow of the Razorpay integration in the CRM application, detailing the "why" and "how" of each step.

## 1. Overview

The payment system is designed to be secure, robust, and user-friendly. It involves a React frontend for the UI and a Go (Gin) backend for order creation and verification.

**Key Technologies:**
- **Frontend:** React, Material UI, Razorpay Checkout.js
- **Backend:** Go (Gin Framework), Razorpay Go SDK
- **Database:** MySQL (migrated from SQLite)

---

## 2. Architecture Decisions

### Why MySQL instead of SQLite?
Initially, we considered a separate SQLite database for payments to isolate financial data. However, this introduced complexity:
- **CGO Dependency:** The standard SQLite driver requires CGO (GCC compiler), which caused build errors on Windows.
- **Data Fragmentation:** Payment data was siloed from the main CRM data (User/Lead/Deal), making joins and unified reporting difficult.
- **Maintenance:** Managing two database connections and migration systems is error-prone.

**Decision:** We consolidated everything into the main MySQL database. This simplifies the architecture, allows for easy data relationships (e.g., linking payments to users), and leverages the existing robust connection pooling.

### Why Server-Side Order Creation?
Razorpay recommends creating orders on the server side to:
- **Secure the Amount:** Preventing users from manipulating the amount in the frontend code.
- **Generate Unique Order IDs:** The backend ensures every transaction has a traceable `order_id` map-able to our internal systems.

---

## 3. Detailed Implementation Flow

### Step 1: User Initiates Payment (Frontend) -> Create Order (Backend)

**1. Frontend (`PaymentForm.tsx`)**:
   - The user fills in their details (Name, Email, Mobile).
   - On submit, the frontend calls `POST /payment/create-order` with these details and a fixed amount (e.g., ₹500).

**2. Backend (`PaymentController.CreateOrder`)**:
   - **Validation:** Checks if required fields are present.
   - **Razorpay API Call:** Uses `client.Order.Create` to tell Razorpay "We want to collect ₹500".
   - **Database Entry:** Creates a `Payment` record in MySQL with status `created`. This acts as a "intent to pay".
   - **Response:** Returns the `order_id` (e.g., `order_Hk78...`) and the `key_id` to the frontend.

   > **Why?** Saving the record *before* payment ensures we have a log of all attempted transactions, helping in debugging drop-offs.

### Step 2: Razorpay Checkout (Frontend)

**3. Frontend (`PaymentForm.tsx`)**:
   - Receives `order_id`.
   - Initializes the Razorpay Checkout options.
   - **Key parameters:** `key` (public key), `amount` (in paise), `order_id`, and `handler`.
   - Opens the modal. The user enters card/UPI details securely on Razorpay's iframe.

### Step 3: Payment Success & Verification (Backend)

**4. Razorpay**:
   - Processes the payment.
   - If successful, it returns `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature` to the frontend `handler`.

**5. Frontend (`PaymentForm.tsx`)**:
   - Immediately calls `POST /payment/verify-payment` with these three parameters.

**6. Backend (`PaymentController.VerifyPayment`)**:
   - **Signature Verification (Crucial):**
     - It regenerates the signature using HMAC SHA256: `HMAC(order_id + "|" + payment_id, secret)`.
     - It compares this generated signature with the one from Razorpay.
     - **If they match:** The payment is genuine.
     - **If they don't:** Someone tampered with the response. The request is rejected.
   - **Database Update:**
     - Finds the `Payment` record by `order_id`.
     - Updates status to `paid`.
     - Saves `payment_id` and `signature` for audit trails.
   - **Response:** Returns success message and the updated payment object.

---

## 4. Key Code Components

### Backend Model (`model/payment.go`)
Defines the structure of the payment record.
- Uses `gorm` tags to define schema (e.g., `varchar(100)`).
- **Security:** The `Signature` field is tagged with `json:"-"` so it is never exposed in API responses.

### Database Connection (`database/mysql_connection.go`)
- Establishes connection to MySQL.
- **Auto-Migration:** Automatically creates/updates the `payments` table schema on server start (`db.AutoMigrate(&model.Payment{})`).

### Migration File (`migrations/007_create_payments.sql`)
- A raw SQL fallback for creating the table.
- Useful for DBAs or if we move away from GORM auto-migration.
- **Fix:** We explicitly used `VARCHAR` types because MySQL `TEXT` columns cannot have default values.

---

## 5. Troubleshooting Common Issues

- **CGO Error:** If `go build` fails with CGO errors, ensure dependencies are tidy and `glebarez/sqlite` is *not* used. We are pure Go/MySQL now.
- **"ID: undefined":** The backend returns `payment_id` (lowercase). Frontend must access it as `data.payment_id`, not `Data.PaymentID`.
- **Razorpay 401 Unauthorized:** Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct in `.env`.
