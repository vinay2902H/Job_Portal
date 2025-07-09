// routes/recommend.route.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {    
  const { skills } = req.body;

  try {
    const response = await axios.post("https://job-portal-x4cs.onrender.com/recommend", { skills });
    console.log(response);
    res.json(response.data);
  } catch (err) {
    console.error("ML service error:", err.message);
    res.status(500).json({ message: "Error communicating with ML model" });
  }
});

export default router;
