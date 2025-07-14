import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import recommendRoute from "./routes/recommend.route.js";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://jobportal-offical.netlify.app"
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.get("/ping", (req, res) => {
  res.status(200).send("Job Portal backend is alive!");
});



app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/recommend", recommendRoute);
app.use("/api", emailRoutes);


app.post("/recommend", (req, res) => {
  const { skills } = req.body;

  const sampleJobs = [
    {
      _id: "abc123",
      title: "Full Stack Developer",
      description: `Work on MERN stack using skills like ${skills}`,
      location: "Remote",
      jobType: "Full-time",
      salary: 1200000,
      requirements: ["React", "Node.js", "MongoDB"],
      company: "Tech Corp",
    },
    {
      _id: "def456",
      title: "Frontend Developer",
      description: `Build stunning UI with ${skills}`,
      location: "Hyderabad",
      jobType: "Contract",
      salary: 1000000,
      requirements: ["JavaScript", "CSS", "React"],
      company: "Designify",
    },
  ];

  res.json(sampleJobs);
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  connectDB();
  console.log(` Server running at port ${PORT}`);
});
