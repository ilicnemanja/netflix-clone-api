import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

export class CreateSubscriptionDto {
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    description: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.0)
    @IsNotEmpty()
    price: number;
}
