import { pool } from "../config/db.js";

/**
 * ✅ Seed Merchant (Required for Authentication)
 */
export async function seedMerchant() {
  try {
    console.log("🌱 Seeding merchant...");

    await pool.query(`
      INSERT INTO merchants (
        id,
        email,
        api_key,
        api_secret,
        name,
        created_at
      )
      VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        'test@example.com',
        'key_test_abc123',
        'secret_test_xyz789',
        'Test Merchant',
        NOW()
      )
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log("✅ Merchant seeded");
  } catch (err) {
    console.error("❌ Merchant seed failed:", err);
    throw err;
  }
}

/**
 * ✅ Seed Orders + Payments (your existing logic)
 */
export async function seedData() {
  try {
    console.log("🌱 Seeding orders & payments...");

    await pool.query("DELETE FROM payments");
    await pool.query("DELETE FROM orders");

    const merchantId = "550e8400-e29b-41d4-a716-446655440000";

    const orders = [];
    const amounts = [5000, 10000, 15000, 20000, 25000, 12000];

    for (let i = 1; i <= 6; i++) {
      const id = `order_seed_${i}`;

      await pool.query(
        `INSERT INTO orders (id, merchant_id, amount, currency, status)
         VALUES ($1, $2, $3, 'INR', 'created')`,
        [id, merchantId, amounts[i - 1]]
      );

      orders.push({ id, amount: amounts[i - 1] });
    }

    const methods = ["upi", "card"];
    const statuses = ["success", "failed"];

    for (let i = 0; i < orders.length; i++) {
      await pool.query(
        `INSERT INTO payments 
        (id, order_id, merchant_id, amount, currency, method, status, vpa, card_last4, card_network, created_at)
        VALUES ($1,$2,$3,$4,'INR',$5,$6,$7,$8,$9,NOW() - INTERVAL '${i} hours')`,
        [
          `pay_seed_${i + 1}`,
          orders[i].id,
          merchantId,
          orders[i].amount,
          methods[i % 2],
          statuses[i % 2],
          methods[i % 2] === "upi" ? "user@paytm" : null,
          methods[i % 2] === "card" ? "1111" : null,
          methods[i % 2] === "card" ? "visa" : null
        ]
      );
    }

    console.log("✅ Orders & Payments seeded");
  } catch (err) {
    console.error("❌ Data seed failed:", err);
    throw err;
  }
}