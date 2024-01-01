import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DriverService } from './driver.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [DriversController],
  providers: [DriverService]
})
export class DriversModule {}
