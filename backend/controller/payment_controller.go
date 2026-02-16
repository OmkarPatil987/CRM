package controller

import (
	"camp-backend/database"
	"camp-backend/model"
	"camp-backend/util"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/razorpay/razorpay-go"
)

type PaymentController struct{}

func NewPaymentController() *PaymentController {
	return &PaymentController{}
}

// Check env vars or fail safe
func getRazorpayContext() (string, string) {
	key := os.Getenv("RAZORPAY_KEY_ID")
	secret := os.Getenv("RAZORPAY_KEY_SECRET")
	if key == "" || secret == "" {
		// Log warning but don't crash, just let the request fail
		return "", ""
	}
	return key, secret
}

// CreateOrder handles POST /create-order
func (pc *PaymentController) CreateOrder(c *gin.Context) {
	key, secret := getRazorpayContext()
	if key == "" {
		util.InternalServerErrorWithMessage(c, "Razorpay credentials not configured")
		return
	}

	var req struct {
		Name   string  `json:"name" binding:"required"`
		Email  string  `json:"email" binding:"required,email"`
		Mobile string  `json:"mobile" binding:"required,len=10"`
		Amount float64 `json:"amount" binding:"required,gt=0"` // Amount in INR
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		util.ValidationResponse(c, "Invalid input: "+err.Error())
		return
	}

	client := razorpay.NewClient(key, secret)

	// Razorpay expects amount in paise (multiply by 100)
	data := map[string]interface{}{
		"amount":   req.Amount * 100,
		"currency": "INR",
		"receipt":  "receipt_" + util.GenerateRandomString(10), // You might need a util for this or just use uuid
	}

	body, err := client.Order.Create(data, nil)
	if err != nil {
		util.InternalServerErrorWithMessage(c, "Failed to create Razorpay order: "+err.Error())
		return
	}

	// Helper to extract Order ID safely
	orderID, _ := body["id"].(string)

	// Save preliminary record
	payment := model.Payment{
		OrderID: orderID,
		Amount:  req.Amount,
		Status:  "created",
		Name:    req.Name,
		Email:   req.Email,
		Mobile:  req.Mobile,
	}

	if err := database.DB.Create(&payment).Error; err != nil {
		util.InternalServerErrorWithMessage(c, "Database error")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":   "success",
		"order_id": orderID,
		"key_id":   key, // Frontend needs this to open the modal
	})
}

// VerifyPayment handles POST /verify-payment
func (pc *PaymentController) VerifyPayment(c *gin.Context) {
	_, secret := getRazorpayContext()

	var req struct {
		OrderID   string `json:"razorpay_order_id" binding:"required"`
		PaymentID string `json:"razorpay_payment_id" binding:"required"`
		Signature string `json:"razorpay_signature" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		util.ValidationResponse(c, "Invalid input")
		return
	}

	// Signature Verification Logic
	// hmac_sha256(order_id + "|" + payment_id, secret) == signature
	data := req.OrderID + "|" + req.PaymentID
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(data))
	expectedSignature := hex.EncodeToString(h.Sum(nil))

	if expectedSignature != req.Signature {
		util.ErrorResponse(c, "Invalid signature", nil)
		return
	}

	// Update record in SQLite
	var payment model.Payment
	if err := database.DB.Where("order_id = ?", req.OrderID).First(&payment).Error; err != nil {
		util.NotFoundResponse(c, "Order not found")
		return
	}

	payment.PaymentID = req.PaymentID
	payment.Signature = req.Signature
	payment.Status = "paid"

	database.DB.Save(&payment)

	util.SuccessResponse(c, "Payment verified successfully", payment)
}
