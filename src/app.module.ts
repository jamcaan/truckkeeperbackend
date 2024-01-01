import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { DriversModule } from './drivers/drivers.module';



@Module({
  imports: [AuthModule, PrismaModule, DriversModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {
  
}
