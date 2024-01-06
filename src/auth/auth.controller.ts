/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body, UseGuards, Res, Req } from '@nestjs/common';

import {
  AuthService,
  CreateUserWithAddressParams,
  CredentialParams,
} from './auth.service';
import { AuthMiddleware } from './auth.middleware';
import { Response } from 'express';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('/signup')
  // signup(@Body() body: CreateUserWithAddressParams,  req: Response){
  //     return this.authService.signup(body, req)
  // }

  @Post('/signup')
  async signup(@Body() createUserAndAddress: CreateUserWithAddressParams) {
    return this.authService.signup(createUserAndAddress);

    // Set the token as a cookie in the response
  }

  @Post('/signin')
  async login(
    @Body() credentials: CredentialParams,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(credentials);
  }
}
