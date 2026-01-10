import express from "express";
import { getTestMerchant } from "../controllers/testController.js";

const router = express.Router();

router.get("/api/v1/test/merchant", getTestMerchant);

export default router;
