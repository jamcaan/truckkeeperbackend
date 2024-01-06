/* eslint-disable no-empty-pattern */

import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { User, UserType } from '@prisma/client';
import { CreateAddressDto, CreateUserDto } from './dto/auth.dto';
import jwt, { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Logger } from '@nestjs/common';
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
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private logger: Logger,
  ) {}

  async signup(createUserAndAddress: CreateUserWithAddressParams): Promise<{
    user: Omit<User, 'username' | 'password'>;
  }> {
    try {
      // Validate input
      if (
        !createUserAndAddress ||
        !createUserAndAddress.user.username ||
        !createUserAndAddress.user.password
      ) {
        throw new BadRequestException('Invalid input data');
      }

      // Check if the username is already taken
      const existingUser = await this.prismaService.user.findUnique({
        where: { username: createUserAndAddress.user.username },
      });

      if (existingUser) {
        throw new ConflictException('Username is already taken');
      }

      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(
        createUserAndAddress.user.password,
        10,
      );

      // Create a new user in the database
      const newUser = await this.prismaService.user.create({
        data: {
          first_name: createUserAndAddress.user.first_name,
          last_name: createUserAndAddress.user.last_name,
          company_name: createUserAndAddress.user.company_name,
          phone_number: createUserAndAddress.user.phone_number,
          email: createUserAndAddress.user.email,
          username: createUserAndAddress.user.username,
          password: hashedPassword,
          active: createUserAndAddress.user.active,
          role: UserType.USER,
          user_id: uuid(),
          address: {
            create: {
              street: createUserAndAddress.address.street,
              state: createUserAndAddress.address.state,
              city: createUserAndAddress.address.city,
              zip_code: createUserAndAddress.address.zipCode,
            },
          },
        },
        include: {
          address: true, // Include the associated address in the created user object
        },
      });

      /*
      Temporarily removing accessToken from the singup.
      TODO: more research on the best place to put with signin or signup
      */
      // Generate JWT token with user information
      // const payload = { userId: newUser.id, username: newUser.username };
      // const accessToken = await this.jwtService.sign(payload, {
      //   expiresIn: '1h',
      // });

      // Log successful signup
      this.logger.log(`User signed up: ${newUser.username}`);

      // Exclude 'username' and 'password' fields from the returned user object
      const { username, password, ...userWithoutSensitiveInfo } = newUser;

      // Return token and user information to the frontend
      // return { user: userWithoutSensitiveInfo, accessToken };

      //Returning without accessToken
      return { user: userWithoutSensitiveInfo };
    } catch (error) {
      // Log and rethrow any unexpected errors during signup
      this.logger.error(`Error during signup: ${error.message}`);
      throw error;
    }
  }

  async login(credentials: CredentialParams): Promise<{
    accessToken: string;
    userId: string;
    username: string;
    userRole: string;
    expiresIn: number;
  }> {
    try {
      // Validate input
      if (!credentials || !credentials.username || !credentials.password) {
        throw new BadRequestException('Invalid input data');
      }

      // Retrieve the user from the database based on the username
      const { username, password } = credentials;
      const user = await this.prismaService.user.findUnique({
        where: { username },
      });
      // Validate user credentials
      if (user && (await bcrypt.compare(password, user.password))) {
        // Generate JWT token with a limited expiration time
        const payload = { username, userId: user.id }; // Include user ID if needed
        const accessToken = await this.jwtService.sign(payload, {
          expiresIn: '1h',
        });

        // Log successful login
        this.logger.log(`Successful login for user: ${username}`);

        // Return token to the frontend
        return {
          userId: user.user_id,
          username: user.username,
          userRole: user.role,
          accessToken,
          expiresIn: 3600,
        };
      } else {
        // Log failed login attempt
        this.logger.warn(`Failed login attempt for user: ${username}`);

        // Throw a generic unauthorized exception to avoid leaking information
        throw new UnauthorizedException('Invalid username or password');
      }
    } catch (error) {
      // Log and rethrow any unexpected errors
      this.logger.error(`Error during login: ${error.message}`);
      throw error;
    }
  }
}
