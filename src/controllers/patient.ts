import { Request, Response } from "express";
import Patient from "../models/patient";
import { IPatient } from "../types/patient";
import { DeepPartial } from "typeorm";

export const addPatient = async (req: Request, res: Response): Promise<void> => {
  const { petName, petType, ownerName, ownerAddress, ownerPhoneNumber } = req.body;
  try {
    const newPatient = new Patient({
      petName,
      petType,
      ownerName,
      ownerAddress,
      ownerPhoneNumber,
    });

    const savedPatient = await newPatient.save();
    res.status(201).json({
      message: "Patient added successfully",
      data: savedPatient,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Error adding patient",
      error: error.message,
    });
  }
};

export const getPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const patients = await Patient.find();
    res.status(200).json({
      data: patients,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Error getting patients",
      error: error.message,
    });
  }
};

export const updatePatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedFields: DeepPartial<IPatient> = req.body;
    const updatedPatient = await Patient.findByIdAndUpdate(id, updatedFields, { new: true });
    res.status(200).json({
      data: updatedPatient,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Error updating patient",
      error: error.message,
    });
  }
};

export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Patient.findByIdAndDelete(id);
    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Error deleting patient",
      error: error.message,
    });
  }
};
