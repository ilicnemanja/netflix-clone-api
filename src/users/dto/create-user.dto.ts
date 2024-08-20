import { IsString, IsBoolean, IsEmail, IsDate, IsNumber, IsNotEmpty, ValidateNested, IsEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubscriptionDto } from 'src/subscriptions/dto/create-subscription.dto';

export class CreateUserDto {
    
    @IsString()
    firstName: string | null;

    @IsString()
    lastName: string | null;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @IsNotEmpty()
    username: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsBoolean()
    isActive: boolean = true;

    @IsDate()
    createdAt: Date = new Date();

    @IsDate()
    updatedAt: Date = new Date();

    @IsNumber()
    @IsNotEmpty()
    subscription: number;
}
