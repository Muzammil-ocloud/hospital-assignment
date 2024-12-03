import { IsString, IsNotEmpty, IsIn, Matches } from "class-validator";

export class AddPatientDto {
  @IsString()
  @IsNotEmpty({ message: "Pet name is required." })
  petName!: string;

  @IsString()
  @IsIn(["cat", "dog", "bird"], { message: "Pet type must be one of: cat, dog, bird." })
  petType!: string;

  @IsString()
  @IsNotEmpty({ message: "Owner name is required." })
  ownerName!: string;

  @IsString()
  @IsNotEmpty({ message: "Owner address is required." })
  ownerAddress!: string;

  @Matches(/^[0-9]{10}$/, {
    message: "Owner phone number must be a valid 10-digit number.",
  })
  ownerPhoneNumber!: string;
}
