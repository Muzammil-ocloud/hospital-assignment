import express from "express";
import { addPatient, deletePatient, getPatients, updatePatients } from "../controllers/patient";
import { validationMiddleware } from "../middlewares/validate";
import { AddPatientDto } from "../dto/patient/addPatient";
import { UpdatePatientDto } from "../dto/patient/updatePatient";

const router = express.Router();

router.post("/add", validationMiddleware(AddPatientDto), addPatient);
router.get("/get-all", getPatients);
router.put("/update/:id", validationMiddleware(UpdatePatientDto), updatePatients);
router.delete("/delete/:id", deletePatient);

export default router;