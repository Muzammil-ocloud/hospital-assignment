import { Document } from "mongoose";
type petType = "cat" | "dog" | "bird";

export interface IPatient extends Document{
  petName: string;
  petType: petType;
  ownerName: string;
  ownerAddress: string;
  ownerPhoneNumber: string;
}
