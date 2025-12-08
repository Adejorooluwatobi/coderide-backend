import { Injectable } from '@nestjs/common';
import { IDriverDocumentRepository } from '../../../../domain/repositories/driver-document.repository.interface';
import { DriverDocument } from '../../../../domain/entities/driver-document.entity';
import { DocumentStatus, Prisma } from '@prisma/client';
import { CreateDriverDocumentParams, UpdateDriverDocumentParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { DriverDocumentMapper } from '../../../mappers/driver-document.mapper';

@Injectable()
export class PrismaDriverDocumentRepository implements IDriverDocumentRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<DriverDocument | null> {
    const doc = await this.prisma.driverDocument.findUnique({ where: { id } });
    return doc ? DriverDocumentMapper.toDomain(doc) : null;
  }

  async findAll(): Promise<DriverDocument[]> {
    const docs = await this.prisma.driverDocument.findMany();
    return docs.map(DriverDocumentMapper.toDomain);
  }

  async findByDriverId(driverId: string): Promise<DriverDocument[]> {
    const docs = await this.prisma.driverDocument.findMany({ where: { driverId } });
    return docs.map(DriverDocumentMapper.toDomain);
  }

  async findByStatus(status: string): Promise<DriverDocument[]> {
    const docs = await this.prisma.driverDocument.findMany({ where: { status: status as DocumentStatus } });
    return docs.map(DriverDocumentMapper.toDomain);
  }

  async create(params: CreateDriverDocumentParams): Promise<DriverDocument> {
    const doc = await this.prisma.driverDocument.create({ data: params as Prisma.DriverDocumentUncheckedCreateInput });
    return DriverDocumentMapper.toDomain(doc);
  }

  async update(id: string, params: Partial<UpdateDriverDocumentParams>): Promise<DriverDocument> {
    const doc = await this.prisma.driverDocument.update({ where: { id }, data: params as Prisma.DriverDocumentUpdateInput });
    return DriverDocumentMapper.toDomain(doc);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.driverDocument.delete({ where: { id } });
  }
}
