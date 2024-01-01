import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateDriverDto {

  @IsString()
  @Expose({ name: "driverId" })
  readonly driver_id: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: "firstName" })
  readonly first_name: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: "lastName" })
  readonly last_name: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: "truckNumber" })
  readonly truck_number: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: "licenseNumber" })
  readonly license_number: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: "phoneNumber" })
  readonly phone_number: string;

  @IsEmail()
  readonly email: string;

  @IsBoolean()
  readonly active: boolean;

  @IsString()
  @Expose({ name: 'userId' })
  readonly user_id: string;




}
