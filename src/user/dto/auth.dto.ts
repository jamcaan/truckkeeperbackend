import { IsString, IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator';

export class SignupDto {
@IsString()
@IsNotEmpty()
firstName: string;

@IsString()
@IsNotEmpty()
lastName: string;

@IsString()
@IsNotEmpty()
companyName: string;

@IsNotEmpty()
@Matches(/^(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, {message: 'Phone must be a valid Phone number.'})
phoneNumber: string;


@IsEmail()
email: string;

@IsNotEmpty()
username: string;

@IsString()
@IsNotEmpty()
@MinLength(8)
password: string;
active: boolean;
role: UserType;
}

export enum UserType {
  USER,
  ADMIN,
}
