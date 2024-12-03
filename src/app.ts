import express from "express";
import mongoose from "mongoose";
import patientRoutes from "./routes/patient";
import appointmentRoutes from "./routes/appointment";
import reportRoutes from "./routes/report";

const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://muhammadmuzammil:JvYkbxS9Q4NE041K@hospitalassignment.nu5t1.mongodb.net/?retryWrites=true&w=majority&appName=HospitalAssignment"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
const Port = 8000;

app.use("/patients", patientRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/report", reportRoutes);

app.listen(Port, () => {
  console.log("Running on port:", Port);
});
