import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '../../../../domain/repositories/admin.repository.interface';
import { Admin } from '../../../../domain/entities/admin.entity';
import { CreateAdminParams, UpdateAdminParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { AdminMapper } from '../../../mappers/admin.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaAdminRepository implements IAdminRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    return admin ? AdminMapper.toDomain(admin) : null;
  }

  async findAll(): Promise<Admin[]> {
    const admins = await this.prisma.admin.findMany();
    return admins.map(AdminMapper.toDomain);
  }

  async findByUsername(username: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({ where: { username } });
    return admin ? AdminMapper.toDomain(admin) : null;
  }

  async create(params: CreateAdminParams): Promise<Admin> {
    const admin = await this.prisma.admin.create({ data: params as Prisma.AdminUncheckedCreateInput });
    return AdminMapper.toDomain(admin);
  }

  async update(id: string, params: Partial<UpdateAdminParams>): Promise<Admin> {
    const admin = await this.prisma.admin.update({ where: { id }, data: params as Prisma.AdminUpdateInput });
    return AdminMapper.toDomain(admin);
  }

  async updateStatus(id: string, status: string): Promise<Admin> {
    const admin = await this.prisma.admin.update({
      where: { id },
      data: { status: status as any },
    });
    return AdminMapper.toDomain(admin);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.admin.delete({ where: { id } });
  }
}
