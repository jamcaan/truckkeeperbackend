import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DriverService } from './driver.service';
import { Driver } from '@prisma/client';
import { CreateDriverDto } from './dto/driver.dto';



@Controller('driver')
@UseGuards(AuthGuard())
export class DriversController {

  constructor(private driverService: DriverService){}

  @Post('/addDriver')
  addDriver(@Body() createDriver: CreateDriverDto) {
    this.driverService.createDriver(createDriver);
  }

  @Get('userId/:userId')
  async getDriversByUserId(@Param('userId') userId: string): Promise<Driver[]> {
    return this.driverService.getDriversByUserId(userId);
  }
}
