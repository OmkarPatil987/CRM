# Razorpay Integration Guide 💳

This project now includes a complete Razorpay integration with a dedicated SQLite database.

## 1. Setup Instructions

### Backend
1.  **Install Dependencies**:
    ```bash
    cd backend
    go get github.com/razorpay/razorpay-go
    go get gorm.io/driver/sqlite
    ```
2.  **Configure Environment**:
    Add the following to your `backend/.env` file:
    ```env
    RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
    RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
    ```
3.  **Run Server**:
    ```bash
    go run main.go
    ```
    *This will create `payments.db` automatically.*

### Frontend
1.  **No extra install needed**: We load the Razorpay script dynamically.
2.  **Run Client**:
    ```bash
    npm start
    ```
3.  **Test**:
    Navigate to `http://localhost:3000/payment`

---

## 2. Architecture

### Backend Flow
1.  **`POST /payment/create-order`**: 
    -   Receives `{amount, name, email, contact}`.
    -   Calls Razorpay API to generate an `order_id`.
    -   Creates a `created` record in `payments.db`.
2.  **`POST /payment/verify-payment`**:
    -   Receives `{razorpay_order_id, razorpay_payment_id, razorpay_signature}`.
    -   Generates HMAC SHA256 signature using your Secret Key.
    -   Matches with `razorpay_signature`.
    -   Updates record status to `paid` in `payments.db`.

### Database
We use a separate **SQLite** database (`backend/payments.db`) to keep payment records isolated from your main application data for this demo.

---

## 3. Files Created

-   **Backend**:
    -   `model/payment.go`: Payment Struct.
    -   `database/payment_db.go`: SQLite Connection.
    -   `controller/payment_controller.go`: API Logic.
    -   `util/random_util.go`: Helper.
-   **Frontend**:
    -   `components/Payment/PaymentForm.tsx`: the UI form.
    -   `pages/PaymentPage.tsx`: Page wrapper.

## 4. Test Credentials
Login to your [Razorpay Dashboard](https://dashboard.razorpay.com/) to get your Test Keys.
