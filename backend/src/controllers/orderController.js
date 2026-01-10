import { pool } from "../config/db.js";
import { generateId } from "../utils/idGenerator.js";

/* Create order (merchant) */
export async function createOrder(req, res) {
  const { amount, currency = "INR", receipt, notes } = req.body;

  if (!amount || amount < 100) {
    return res.status(400).json({
      error: {
        code: "BAD_REQUEST",
        description: "Amount must be >= 100"
      }
    });
  }

  const orderId = generateId("order_");

  await pool.query(
    `INSERT INTO orders 
     (id, merchant_id, amount, currency, receipt, notes, status)
     VALUES ($1,$2,$3,$4,$5,$6,'created')`,
    [
      orderId,
      req.merchant.id,
      amount,
      currency,
      receipt || null,
      notes || {}
    ]
  );

  res.status(201).json({
    id: orderId,
    merchant_id: req.merchant.id,
    amount,
    currency,
    receipt,
    notes,
    status: "created",
    created_at: new Date().toISOString()
  });
}

/* Get order (merchant) */
export async function getOrder(req, res) {
  const { order_id } = req.params;

  const r = await pool.query(
    "SELECT * FROM orders WHERE id=$1 AND merchant_id=$2",
    [order_id, req.merchant.id]
  );

  if (!r.rowCount) return res.sendStatus(404);
  res.json(r.rows[0]);
}

/* 🔓 PUBLIC — for checkout page */
export async function getOrderPublic(req, res) {
  const { order_id } = req.params;

  const r = await pool.query(
    "SELECT id, amount, currency, status FROM orders WHERE id=$1",
    [order_id]
  );

  if (!r.rowCount) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        description: "Order not found"
      }
    });
  }

  res.json(r.rows[0]);
}
