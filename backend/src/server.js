import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { pool } from "./config/db.js";
import { seedMerchant, seedData } from "./db/seed.js";

import healthRoutes from "./routes/healthRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import testRoutes from "./routes/testRoutes.js";

dotenv.config();

console.log("✅ ENV LOADED");
console.log("🔌 DB URL:", process.env.DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());

console.log("📄 Loading schema...");
const schema = fs.readFileSync("./src/db/schema.sql").toString();
await pool.query(schema);
console.log("✅ Schema applied");

console.log("🌱 Seeding merchant...");
await seedMerchant();
console.log("✅ Merchant seeded");

app.use(healthRoutes);
app.use(orderRoutes);
app.use(paymentRoutes);
app.use(testRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
