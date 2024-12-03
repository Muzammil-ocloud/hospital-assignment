import mongoose, { Schema } from "mongoose";
import { IAppointment } from "../types/appointment";

const AppointmentSchema: Schema = new Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    description: { type: String, required: true },
    paymentStatus: { type: String, enum: ["paid", "unpaid"], required: true },
    paymentMethod: { type: String, enum: ["USD", "EUR", "Bitcoin"], required: true },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model<IAppointment>("Appointment", AppointmentSchema);
