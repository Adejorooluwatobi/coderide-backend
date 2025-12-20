import { Injectable } from '@nestjs/common';
import { IDriverRepository } from '../../../../domain/repositories/driver.repository.interface';
import { Driver } from '../../../../domain/entities/driver.entity';
import { Prisma } from '@prisma/client';
import { CreateDriverApplicationParams, CreateCompanyDriverParams, UpdateDriverParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { DriverMapper } from '../../../mappers/driver.mapper';
import { DocumentStatus } from '../../../../domain/enums/document-status.enum';

@Injectable()
export class PrismaDriverRepository implements IDriverRepository {
  constructor(private prisma: PrismaService) {}

  private static readonly INCLUDE_RELATIONS = {
    user: true,
    ownedVehicles: true,
    vehicleAssignments: {
      include: {
        vehicle: true,
      },
      where: {
        returnedAt: null,
      },
    },
    rides: true,
  };

  async findById(id: string): Promise<Driver | null> {
    const driver = await this.prisma.driver.findUnique({ where: { id }, include: PrismaDriverRepository.INCLUDE_RELATIONS });
    return driver ? DriverMapper.toDomain(driver) : null;
  }

  async findAll(): Promise<Driver[]> {
    const drivers = await this.prisma.driver.findMany({ include: PrismaDriverRepository.INCLUDE_RELATIONS });
    return drivers.map(DriverMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<Driver | null> {
    const driver = await this.prisma.driver.findUnique({ where: { userId }, include: PrismaDriverRepository.INCLUDE_RELATIONS });
    return driver ? DriverMapper.toDomain(driver) : null;
  }

  async findByLicenseNumber(licenseNumber: string): Promise<Driver | null> {
    const driver = await this.prisma.driver.findUnique({ where: { licenseNumber }, include: PrismaDriverRepository.INCLUDE_RELATIONS });
    return driver ? DriverMapper.toDomain(driver) : null;
  }

  async createApplication(params: CreateDriverApplicationParams): Promise<Driver> {
    const driver = await this.prisma.driver.create({
      data: {
        userId: params.userId,
        licenseNumber: params.licenseNumber,
        licenseExpiry: params.licenseExpiry,
        bankAccountDetails: params.bankAccountDetails!,
        documentStatus: DocumentStatus.PENDING,
        rating: null,
        totalRides: 0,
        totalEarnings: 0,
        isOnline: false,
      },
      include: PrismaDriverRepository.INCLUDE_RELATIONS,
    });
    return DriverMapper.toDomain(driver);
  }

  async createCompanyDriver(params: CreateCompanyDriverParams): Promise<Driver> {
    const driver = await this.prisma.driver.create({
      data: {
        userId: params.userId,
        licenseNumber: params.licenseNumber,
        licenseExpiry: params.licenseExpiry,
        bankAccountDetails: params.bankAccountDetails!,
        documentStatus: params.documentStatus || DocumentStatus.APPROVED,
        latitude: params.latitude,
        longitude: params.longitude,
        rating: null,
        totalRides: 0,
        totalEarnings: 0,
        isOnline: false,
      },
      include: PrismaDriverRepository.INCLUDE_RELATIONS,
    });
    return DriverMapper.toDomain(driver);
  }

  async update(id: string, params: Partial<UpdateDriverParams>): Promise<Driver> {
    const driver = await this.prisma.driver.update({ where: { id }, data: params as Prisma.DriverUpdateInput, include: PrismaDriverRepository.INCLUDE_RELATIONS });
    return DriverMapper.toDomain(driver);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.driver.delete({ where: { id } });
  }
}
