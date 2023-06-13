/* eslint-disable no-empty-pattern */

import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

export interface SignupParams {
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup({
    firstName,
    lastName,
    companyName,
    phoneNumber,
    username,
    password,
    email,
  }: SignupParams) {
    const emailExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    const userExist = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (userExist || emailExist) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        phone_number: phoneNumber,
        email: email,
        username: username,
        password: hashedPassword,
        role: UserType.USER,
        active: true,
      },
    });

    console.log('User: ', { userExist });

    const token = await jwt.sign(
      {
        firstName,
        id: user.id,
      },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: 3600,
      },
    );

    return token;

    // console.log('User: ', { userExist });

    // console.log('Email: ', { emailExist });
  }
}
