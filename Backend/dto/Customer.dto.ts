import {IsEmail, Length} from 'class-validator'

export class CreateCustomerInputs{
    @IsEmail()
    email: string;

    @Length(7, 10)
    phone: string;

    @Length(6, 12)
    password: string;
}