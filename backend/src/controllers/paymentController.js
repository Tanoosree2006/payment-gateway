import { pool } from "../config/db.js";
import {
  luhnCheck,
  validateExpiry,
  validateVPA,
  detectNetwork
} from "../services/validationService.js";

// ------------------------------------
// TEST MODE CONFIG (NEW)
// ------------------------------------
const TEST_MODE = process.env.TEST_MODE === "true";
const TEST_PAYMENT_SUCCESS = process.env.TEST_PAYMENT_SUCCESS === "true";
const TEST_PROCESSING_DELAY = parseInt(process.env.TEST_PROCESSING_DELAY || "5000");

// Utility sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate payment id
function generatePaymentId() {
  return "pay_" + Math.random().toString(36).substring(2, 18);
}

// ------------------------------------
// VALIDATION HELPER
// ------------------------------------
function validatePayment(method, vpa, card) {
  if (method === "upi") {
    if (!vpa || !validateVPA(vpa)) {
      return "Invalid VPA format";
    }
  }

  if (method === "card") {
    if (!card || !card.number) {
      return "Card details missing";
    }

    if (!luhnCheck(card.number)) {
      return "Invalid card number";
    }

    if (!validateExpiry(card.exp_month, card.exp_year)) {
      return "Card expired";
    }

    const network = detectNetwork(card.number);
    if (!network) {
      return "Unsupported card network";
    }
  }

  return null;
}

// ------------------------------------
// Determine success (TEST MODE aware)
// ------------------------------------
function determineSuccess(method) {
  if (TEST_MODE) return TEST_PAYMENT_SUCCESS;

  const successRate = method === "upi" ? 0.9 : 0.95;
  return Math.random() < successRate;
}

// ------------------------------------
// AUTH PAYMENT
// ------------------------------------
export async function createPayment(req, res) {
  try {
    const { order_id, method, vpa, card } = req.body;

    const validationError = validatePayment(method, vpa, card);
    if (validationError) {
      return res.status(400).json({
        error: { code: "BAD_REQUEST_ERROR", description: validationError }
      });
    }

    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", description: "Order not found" }
      });
    }

    const order = orderResult.rows[0];
    const paymentId = generatePaymentId();

    await pool.query(
      `INSERT INTO payments 
       (id, order_id, merchant_id, amount, currency, method, status, vpa, card_last4, card_network)
       VALUES ($1,$2,$3,$4,$5,$6,'processing',$7,$8,$9)`,
      [
        paymentId,
        order.id,
        order.merchant_id,
        order.amount,
        order.currency,
        method,
        method === "upi" ? vpa : null,
        method === "card" ? card.number.slice(-4) : null,
        method === "card" ? detectNetwork(card.number) : null
      ]
    );

    // Controlled delay
    const delay = TEST_MODE ? TEST_PROCESSING_DELAY : 5000;
    await sleep(delay);

    const success = determineSuccess(method);

    if (success) {
      await pool.query(
        `UPDATE payments SET status='success', updated_at=NOW() WHERE id=$1`,
        [paymentId]
      );
    } else {
      await pool.query(
        `UPDATE payments
         SET status='failed',
             error_code='PAYMENT_FAILED',
             error_description='Payment failed',
             updated_at=NOW()
         WHERE id=$1`,
        [paymentId]
      );
    }

    const final = await pool.query(
      "SELECT * FROM payments WHERE id = $1",
      [paymentId]
    );

    res.status(201).json(final.rows[0]);

  } catch (err) {
    console.error("createPayment error:", err);
    res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", description: "Internal server error" }
    });
  }
}

// ------------------------------------
// GET PAYMENT
// ------------------------------------
export async function getPayment(req, res) {
  try {
    const { payment_id } = req.params;

    const result = await pool.query(
      "SELECT * FROM payments WHERE id = $1",
      [payment_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", description: "Payment not found" }
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", description: "Internal error" }
    });
  }
}

// ------------------------------------
// PUBLIC CHECKOUT PAYMENT
// ------------------------------------
export async function createPaymentPublic(req, res) {
  try {
    const { order_id, method, vpa, card } = req.body;

    const validationError = validatePayment(method, vpa, card);
    if (validationError) {
      return res.status(400).json({
        error: { code: "BAD_REQUEST_ERROR", description: validationError }
      });
    }

    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", description: "Order not found" }
      });
    }

    const order = orderResult.rows[0];
    const paymentId = generatePaymentId();

    await pool.query(
      `INSERT INTO payments 
       (id, order_id, merchant_id, amount, currency, method, status, vpa, card_last4, card_network)
       VALUES ($1,$2,$3,$4,$5,$6,'processing',$7,$8,$9)`,
      [
        paymentId,
        order.id,
        order.merchant_id,
        order.amount,
        order.currency,
        method,
        method === "upi" ? vpa : null,
        method === "card" ? card.number.slice(-4) : null,
        method === "card" ? detectNetwork(card.number) : null
      ]
    );

    const delay = TEST_MODE ? TEST_PROCESSING_DELAY : 5000;
    await sleep(delay);

    const success = determineSuccess(method);

    await pool.query(
      `UPDATE payments SET status=$1, updated_at=NOW() WHERE id=$2`,
      [success ? "success" : "failed", paymentId]
    );

    const final = await pool.query(
      "SELECT * FROM payments WHERE id = $1",
      [paymentId]
    );

    res.status(201).json(final.rows[0]);

  } catch (err) {
    res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", description: "Internal server error" }
    });
  }
}

// ------------------------------------
// LIST PAYMENTS
// ------------------------------------
export async function listPayments(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM payments ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", description: "Failed to fetch payments" }
    });
  }
}