import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateProfileDto {
    @IsString()
    @MinLength(3)
    @MaxLength(8)
    name: string;
}