import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getOrder,
  getOrderPublic
} from "../controllers/orderController.js";

const router = express.Router();

/* Authenticated routes */
router.post("/api/v1/orders", auth, createOrder);
router.get("/api/v1/orders/:order_id", auth, getOrder);

/* 🔓 PUBLIC route for checkout */
router.get("/api/v1/orders/:order_id/public", getOrderPublic);

export default router;
