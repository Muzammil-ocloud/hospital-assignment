import mongoose, { Schema } from "mongoose";
import { IPatient } from "../types/patient";

const PatientSchema: Schema = new Schema({
  petName: {
    type: String,
    required: true,
  },
  petType: {
    type: String,
    enum: ["cat", "dog", "bird"],
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerAddress: {
    type: String,
    required: true,
  },
  ownerPhoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^[0-9]{10}$/.test(v),
      message: (props: { value: string }) => `${props.value} is not a valid phone number!`,
    },
  },
});

const Patient = mongoose.model<IPatient>("Patient", PatientSchema);
export default Patient;
