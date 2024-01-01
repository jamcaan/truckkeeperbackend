import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsEnum,
} from 'class-validator';
export class CreateAddressDto {
  @IsString()
  street: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  zipCode: string;
}

export enum UserType {
  'USER',
  'ADMIN',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'firstName' })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'lastName' })
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'companyName' })
  company_name: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'phoneNumber' })
  phone_number: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  password: string;

  @IsBoolean()
  active?: boolean;

  @IsEnum(UserType)
  role?: UserType;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'userId' })
  user_id: string;
}
