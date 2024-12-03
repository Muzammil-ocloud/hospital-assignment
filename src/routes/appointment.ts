import express from "express";
import {
  addAppointment,
  deleteAppointment,
  getPatientAppointments,
  updateAppointment,
  getAppointmentByDate,
  getUnPaidAppointments,
  getRemainingAmount
} from "../controllers/appointment";
import { validationMiddleware } from "../middlewares/validate";
import { AddAppointmentDto } from "../dto/appointment/addAppointment";
import { UpdateAppointmentDto } from "../dto/appointment/updatePatient";

const router = express.Router();

router.post("/add/:patientId", validationMiddleware(AddAppointmentDto), addAppointment);
router.get("/patient/:patientId", getPatientAppointments);
router.put("/update/:id", validationMiddleware(UpdateAppointmentDto), updateAppointment);
router.delete("/delete/:id", deleteAppointment);
router.get("/date/:date", getAppointmentByDate);
router.get("/get-unpaid", getUnPaidAppointments);
router.get("/get-remaining-bill/:patientId", getRemainingAmount);

export default router;
