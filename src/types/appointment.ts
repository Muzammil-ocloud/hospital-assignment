import { Document } from "mongoose";
import { IPatient } from "./patient";

export enum PaymentMethod {
  USD = "USD",
  EUR = "EUR",
  Bitcoin = "Bitcoin",
}

export enum PaymentStatus {
  PAID = "paid",
  UNPAID = "unpaid",
}

export interface IAppointment extends Document {
  patient: IPatient["_id"];
  startTime: Date;
  endTime: Date;
  description: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  amount: number;
  paidAmount: number;
}
