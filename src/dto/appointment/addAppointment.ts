import { IsString, IsNotEmpty, IsDateString, IsEnum, IsNumber, IsOptional } from "class-validator";
import { PaymentMethod, PaymentStatus } from "../../types/appointment";

export class AddAppointmentDto {
  @IsDateString()
  @IsNotEmpty({ message: "Appointment start time is required." })
  startTime!: string;

  @IsDateString()
  @IsNotEmpty({ message: "Appointment end time is required." })
  endTime!: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required." })
  description!: string;

  @IsEnum(PaymentMethod, { message: "Payment method must be one of: USD, EUR, Bitcoin." })
  paymentMethod!: PaymentMethod;

  @IsNumber()
  @IsNotEmpty({ message: "Amount is required." })
  amount!: number;

  @IsOptional()
  @IsNumber()
  paidAmount!: number;
}
