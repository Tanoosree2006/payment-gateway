import { pool } from "./config/db.js";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Clean old data
    await pool.query("DELETE FROM payments");
    await pool.query("DELETE FROM orders");

    const merchantId = "550e8400-e29b-41d4-a716-446655440000";

    // Create orders
    const orders = [];
    for (let i = 1; i <= 6; i++) {
      const amount = [5000, 10000, 15000, 20000, 25000, 12000][i - 1];
      const id = `order_seed_${i}`;

      await pool.query(
        `INSERT INTO orders (id, merchant_id, amount, currency, status)
         VALUES ($1, $2, $3, 'INR', 'created')`,
        [id, merchantId, amount]
      );

      orders.push({ id, amount });
    }

    // Create payments
    const methods = ["upi", "card"];
    const statuses = ["success", "failed"];

    for (let i = 0; i < orders.length; i++) {
      const paymentId = `pay_seed_${i + 1}`;
      const method = methods[i % 2];
      const status = statuses[i % 2];

      await pool.query(
        `INSERT INTO payments 
        (id, order_id, merchant_id, amount, currency, method, status, vpa, card_last4, card_network, created_at)
        VALUES ($1,$2,$3,$4,'INR',$5,$6,$7,$8,$9,NOW() - INTERVAL '${i} hours')`,
        [
          paymentId,
          orders[i].id,
          merchantId,
          orders[i].amount,
          method,
          status,
          method === "upi" ? "user@paytm" : null,
          method === "card" ? "1111" : null,
          method === "card" ? "visa" : null
        ]
      );
    }

    console.log("✅ Seeding completed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
