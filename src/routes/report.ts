import express from "express";
import { getMonthlyReport, getWeeklyReport, getPatientsReport } from "../controllers/report";

const router = express.Router();

router.get("/weekly", getWeeklyReport);
router.get("/monthly", getMonthlyReport);
router.get("/get-patients-report", getPatientsReport);

export default router;
