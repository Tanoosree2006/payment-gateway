import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import {
  createPayment,
  getPayment,
  createPaymentPublic,
  listPayments
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/api/v1/payments", auth, createPayment);
router.get("/api/v1/payments/:payment_id", auth, getPayment);

/* list all payments */
router.get("/api/v1/payments", auth, listPayments);

/* public checkout */
router.post("/api/v1/payments/public", createPaymentPublic);

export default router;
