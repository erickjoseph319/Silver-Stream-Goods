const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // For making HTTP requests to payment gateways

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PORT setup
const PORT = process.env.PORT || 3000;

// Unified Checkout Endpoint
app.post('/api/checkout', async (req, res) => {
    const { paymentMethod, amount, customerDetails, cartItems } = req.body;

    try {
        if (paymentMethod === 'mpesa') {
            // Example using IntaSend or Flutterwave M-Pesa STK Push API
            const mpesaPayload = {
                amount: amount,
                phone_number: customerDetails.phone,
                email: customerDetails.email || "customer@silverstreamgoods.com",
                currency: "KES"
            };

            // Replace with your actual Gateway API URL and Secret API Key
            // const response = await axios.post('https://sandbox.intasend.com/api/v1/m-pesa/stk-push/', mpesaPayload, {
            //     headers: { 'Authorization': 'Bearer YOUR_SECRET_API_KEY' }
            // });

            // Simulating successful STK push dispatch
            return res.status(200).json({
                success: true,
                message: `STK Push successfully sent to +254${customerDetails.phone}. Please check your phone.`,
                transactionId: "STK-" + Math.floor(Math.random() * 1000000)
            });

        } else if (paymentMethod === 'card') {
            // Process Card Tokenization & Charge via Gateway API (Stripe / Flutterwave / DPO)
            return res.status(200).json({
                success: true,
                message: "Card payment processed successfully!",
                transactionId: "CARD-" + Math.floor(Math.random() * 1000000)
            });

        } else if (paymentMethod === 'paypal' || paymentMethod === 'skrill') {
            // Return payment redirection URL for digital wallets
            return res.status(200).json({
                success: true,
                redirectUrl: `https://checkout.${paymentMethod}.com/pay?amount=${amount}`,
                message: `Redirecting to ${paymentMethod.toUpperCase()}...`
            });
        } else {
            return res.status(400).json({ success: false, message: "Invalid payment method selected." });
        }

    } catch (error) {
        console.error("Payment Gateway Error:", error.response?.data || error.message);
        return res.status(500).json({ success: false, message: "Payment processing failed. Please try again." });
    }
});

app.listen(PORT, () => {
    console.log(`Silver Stream Goods backend running on http://localhost:${PORT}`);
});