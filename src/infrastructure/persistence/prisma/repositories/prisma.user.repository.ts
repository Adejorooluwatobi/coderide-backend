import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { User } from '../../../../domain/entities/user.entity';
import { CreateUserParams, UpdateUserParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { UserMapper } from '../../../mappers/user.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(UserMapper.toDomain);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async create(params: CreateUserParams): Promise<User> {
    const user = await this.prisma.user.create({ data: params as Prisma.UserUncheckedCreateInput });
    return UserMapper.toDomain(user);
  }

  async update(id: string, params: Partial<UpdateUserParams>): Promise<User> {
    const user = await this.prisma.user.update({ where: { id }, data: params as Prisma.UserUpdateInput });
    return UserMapper.toDomain(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
