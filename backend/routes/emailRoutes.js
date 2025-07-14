import express from "express";
import { sendEmail } from "../controllers/emailControllers.js"

const router = express.Router();
console.log("hello");

router.post("/email/sendEmail", sendEmail);


export default router; 
