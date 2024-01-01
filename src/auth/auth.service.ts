/* eslint-disable no-empty-pattern */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { User, UserType } from '@prisma/client';
import { CreateAddressDto, CreateUserDto } from './dto/auth.dto';
import jwt, { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {v4 as uuid } from 'uuid'
// export interface SignupParams {
//   firstName: string;
//   lastName: string;
//   companyName: string;
//   phoneNumber: string;
//   email: string;
//   username: string;
//   password: string;
//   address: AddressDto

// }

export interface CreateUserWithAddressParams {
  user: CreateUserDto;
  address: CreateAddressDto;
}

export interface CredentialParams {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  addressIn: any;
  constructor(
    private  prismaService: PrismaService,
    private  jwtService: JwtService
  ) {}
  /**
   * 
   * Will remove the below commented later
   *  
   */
  //   async signup({}: SignupParams) {
  //     const emailExist = await this.prismaService.user.findUnique({
  //       where: {
  //         email,
  //       },
  //     });

  //     const userExist = await this.prismaService.user.findUnique({
  //       where: {
  //         username,
  //       },
  //     });

  //     if (userExist || emailExist) {
  //       throw new ConflictException();
  //     }

  //     const hashedPassword = await bcrypt.hash(password, 10);

  //     const user = await this.prismaService.user.create({
  //       data: {
  //         first_name: firstName,
  //         last_name: lastName,
  //         company_name: companyName,
  //         phone_number: phoneNumber,
  //         email: email,
  //         username: username,
  //         password: hashedPassword,
  //         role: UserType.USER,
  //         active: true,
  //         address: {
  //             connect: { id: this.addressIn.id },
  //           },
  //       },
  //     });

  //     this.addressIn = await this.prismaService.address.createMany({
  //         data: {
  //             street: address.street,
  //             state: address.state,
  //             city: address.city,
  //             zip_code: address.zipCode,
  //             user_id: user.id
  //         }
  //     })

  //     console.log('User: ', { userExist });

  //     const token = await jwt.sign({
  //         firstName,
  //         id: user.id
  //     }, process.env.JSON_TOKEN_KEY, {
  //         expiresIn: 3600
  //     })

  //     return token;

  //     // console.log('User: ', { userExist });

  //     // console.log('Email: ', { emailExist });
  //   }

  //   async createUserWithAddress(
  //     createUserAndAddress: CreateUserWithAddressParams,
  //   ) {
  //     const { user, address } = createUserAndAddress;

  //     const hashedPassword = await bcrypt.hash(user.password, 10);
  //     try {
  //       const createdUser = await this.prismaService.user.create({
  //         data: {
  //           first_name: user.first_name,
  //           last_name: user.last_name,
  //           company_name: user.company_name,
  //           phone_number: user.phone_number,
  //           email: user.email,
  //           username: user.username,
  //           password: hashedPassword,
  //           active: user.active,
  //           role: UserType.USER,
  //           address: {
  //             create: {
  //               street: address.street,
  //               state: address.state,
  //               city: address.city,
  //               zip_code: address.zipCode,
  //             },
  //           },
  //         },
  //         include: {
  //           address: true, // Include the associated address in the created user object
  //         },
  //       });

  //       const token = this.tokenSerice.generateToken(user, 3600);

  //       return token;

  //     } catch (error) {
  //       throw new Error(
  //         'Failed to create user with address. Reason: ' + error.message,
  //       );
  //     }
  //   }

  async signup(
    createUserAndAddress: CreateUserWithAddressParams
  ): Promise<User> {
    const { user, address } = createUserAndAddress;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    console.log('salt: ', salt);
    console.log('hashedPassword: ', hashedPassword);

    try {
      const createdUser = await this.prismaService.user.create({
        data: {
          first_name: user.first_name,
          last_name: user.last_name,
          company_name: user.company_name,
          phone_number: user.phone_number,
          email: user.email,
          username: user.username,
          password: hashedPassword,
          active: user.active,
          role: UserType.USER,
          user_id: uuid(),
          address: {
            create: {
              street: address.street,
              state: address.state,
              city: address.city,
              zip_code: address.zipCode,
            },
          },
        },
        include: {
          address: true, // Include the associated address in the created user object
        },
      });

      const tokenPayload = {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        first_name: createdUser.first_name,
      };

      // const secret = process.env.JSON_TOKEN_KEY;
      // const token = this.tokenSerice.generateToken(tokenPayload,secret, 3600);
      // Set the token as a cookie in the response
      // response.cookie('token', token, { httpOnly: true });
      
      return createdUser;
    } catch (error) {
      throw new Error(
        `Failed to create user with address. Reason: ${error.message}`,
      );
    }
  }

  async login(credentials: CredentialParams): Promise<{accessToken: string}> {
    // Retrieve the user from the database based on the username
    const { username, password } = credentials;
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = {username};
      const accessToken = await this.jwtService.sign(payload)
      return { accessToken }
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
