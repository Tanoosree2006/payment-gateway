import { pool } from "../config/db.js";

// Utility sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate payment id
function generatePaymentId() {
  return "pay_" + Math.random().toString(36).substring(2, 18);
}

// -----------------------------
// AUTH PAYMENT
// -----------------------------
export async function createPayment(req, res) {
  try {
    const { order_id, method, vpa, card } = req.body;

    // 1. Get order
    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: { code: "NOT_FOUND_ERROR", description: "Order not found" }
      });
    }

    const order = orderResult.rows[0];

    // 2. Create payment
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
        method === "card" ? "visa" : null
      ]
    );

    // 3. Simulate delay properly (IMPORTANT FIX)
    await sleep(5000);

    // 4. Random success/failure
    const successRate = method === "upi" ? 0.9 : 0.95;
    const success = Math.random() < successRate;

    if (success) {
      await pool.query(
        `UPDATE payments 
         SET status = 'success', updated_at = NOW() 
         WHERE id = $1`,
        [paymentId]
      );
    } else {
      await pool.query(
        `UPDATE payments
         SET status = 'failed',
             error_code = 'PAYMENT_FAILED',
             error_description = 'Payment failed',
             updated_at = NOW()
         WHERE id = $1`,
        [paymentId]
      );
    }

    // 5. Return final payment
    const final = await pool.query(
      "SELECT * FROM payments WHERE id = $1",
      [paymentId]
    );

    res.status(201).json(final.rows[0]);
  } catch (err) {
    console.error("createPayment error:", err);
    res.status(500).json({
      error: { code: "PAYMENT_FAILED", description: "Internal server error" }
    });
  }
}

// -----------------------------
// GET PAYMENT
// -----------------------------
export async function getPayment(req, res) {
  try {
    const { payment_id } = req.params;

    const result = await pool.query(
      "SELECT * FROM payments WHERE id = $1",
      [payment_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: { code: "NOT_FOUND_ERROR", description: "Payment not found" }
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("getPayment error:", err);
    res.status(500).json({
      error: { code: "PAYMENT_FAILED", description: "Internal error" }
    });
  }
}

// -----------------------------
// PUBLIC CHECKOUT PAYMENT
// -----------------------------
export async function createPaymentPublic(req, res) {
  try {
    const { order_id, method, vpa, card } = req.body;

    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: { code: "NOT_FOUND_ERROR", description: "Order not found" }
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
        method === "card" ? "visa" : null
      ]
    );

    await sleep(5000);

    const successRate = method === "upi" ? 0.9 : 0.95;
    const success = Math.random() < successRate;

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
    console.error("createPaymentPublic error:", err);
    res.status(500).json({
      error: { code: "PAYMENT_FAILED", description: "Internal server error" }
    });
  }
}

export async function listPayments(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM payments ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
}
