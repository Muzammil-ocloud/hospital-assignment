import { IsString, IsNotEmpty, IsIn, Matches, IsOptional } from "class-validator";

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Pet name is required." })
  petName!: string;

  @IsOptional()
  @IsString()
  @IsIn(["cat", "dog", "bird"], { message: "Pet type must be one of: cat, dog, bird." })
  petType!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Owner name is required." })
  ownerName!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Owner address is required." })
  ownerAddress!: string;

  @IsOptional()
  @Matches(/^[0-9]{10}$/, {
    message: "Owner phone number must be a valid 10-digit number.",
  })
  ownerPhoneNumber!: string;
}
