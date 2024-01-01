import { Injectable } from "@nestjs/common";
import { CreateDriverDto } from "./dto/driver.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Driver } from "./driver.model";

@Injectable()
export class DriverService {

    constructor(private prismaService: PrismaService){}

    async createDriver(driverDto: CreateDriverDto): Promise<Driver>{
        return await this.prismaService.driver.create({
            data: {
                ...driverDto
            },
            include: {
                user: true
            }
        })
    }


    async getDriversByUserId(userId: string): Promise<Driver[]> {
        return this.prismaService.driver.findMany({
          where: {
            user_id: userId,
          },
        });
      }
      
    
}