import { Request, Response } from "express";
import { Appointment } from "../models/appointment";
import Patient from "../models/patient";
import { IAppointment, PaymentStatus } from "../types/appointment";
import { DeepPartial } from "typeorm";
import { getAmountInUSD } from "../utils/utils";

export const addAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const { startTime, endTime, description, paymentMethod, amount, paidAmount }: IAppointment = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    const paymentStatus = amount === paidAmount ? "paid" : "unpaid";

    const newAppointment = new Appointment({
      patient: patient._id,
      startTime,
      endTime,
      description,
      paymentStatus,
      paymentMethod,
      amount,
      paidAmount,
    });

    await newAppointment.save();

    res.status(201).json({ message: "Appointment added successfully", appointment: newAppointment });
  } catch (error: any) {
    res.status(500).json({ message: "Error adding appointment", error: error.message });
  }
};

export const getPatientAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const patientId = req.params.patientId;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }
    const appointments = await Appointment.find({ patient: patientId });

    res.status(200).json({ appointments });
  } catch (error: any) {
    res.status(500).json({ message: "Error getting patient appointments", error: error.message });
  }
};

export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedFields: DeepPartial<IAppointment> = req.body;
    const { patient, ...rest } = updatedFields;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    if ((updatedFields?.paidAmount || 0) > appointment.amount - appointment.paidAmount) {
      res.status(400).json({ message: "Paid amount cannot be greater than remaining amount" });
      return;
    }
    rest.paidAmount = (updatedFields?.paidAmount || 0) + appointment.paidAmount;

    if (rest.paidAmount === appointment.amount) rest.paymentStatus = PaymentStatus.PAID;
    else rest.paymentStatus = PaymentStatus.UNPAID;

    const updatedAppointment = await Appointment.findByIdAndUpdate(id, rest, { new: true });
    res.status(200).json({
      data: updatedAppointment,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Error updating appointment",
      error: error.message,
    });
  }
};

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({
      message: "Appointment deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Error deleting appointment",
      error: error.message,
    });
  }
};

export const getAppointmentByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.params;
    const parsedDate = new Date(date);
    const startOfDay = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setUTCHours(23, 59, 59, 999));
    const appointments = await Appointment.find({
      startTime: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    res.status(200).json({
      data: appointments,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Error getting appointments",
      error: error.message,
    });
  }
};

export const getUnPaidAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await Appointment.find({ paymentStatus: "unpaid" });
    res.status(200).json({
      data: appointments,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Error getting appointments",
      error: error.message,
    });
  }
};

export const getRemainingAmount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patient: patientId });
    const totalAmount = await appointments.reduce(async (total, appointment) => {
      return {
        paid: (await total).paid + (await getAmountInUSD(appointment.paidAmount, appointment.paymentMethod)),
        amount: (await total).amount + (await getAmountInUSD(appointment.amount, appointment.paymentMethod)),
      };
    }, Promise.resolve({ paid: 0, amount: 0 }));
    const remainingAmount = totalAmount.amount - totalAmount.paid;
    res.status(200).json({ remainingAmount: remainingAmount });
  } catch (error: any) {
    res.status(400).json({
      message: "Error getting remaining amount",
      error: error.message,
    });
  }
};
