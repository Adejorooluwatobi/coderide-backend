import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { User } from '../../../../domain/entities/user.entity';
import { CreateUserParams, UpdateUserParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { UserMapper } from '../../../mappers/user.mapper';
import { UserType as PrismaUserType } from '@prisma/client';
import { UserType } from '../../../../domain/enums/user-type.enum';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  private static readonly INCLUDE_RELATIONS = {
    rider: true,
    driver: true,
    paymentMethods: true,
    notifications: true,
    sentRatings: true,
    receivedRatings: true,
  };

  private mapUserTypeToPrisma(userType: UserType): PrismaUserType {
    return userType as PrismaUserType;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      include: PrismaUserRepository.INCLUDE_RELATIONS
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({
        include: PrismaUserRepository.INCLUDE_RELATIONS
      });
      return users.map(UserMapper.toDomain);
    } catch (error) {
      console.error('Error in PrismaUserRepository.findAll:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ 
      where: { email },
      include: PrismaUserRepository.INCLUDE_RELATIONS
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async create(params: CreateUserParams): Promise<User> {
    const { userType, ...rest } = params;
    const user = await this.prisma.user.create({ 
      data: { 
        ...rest, 
        userType: this.mapUserTypeToPrisma(userType) 
      },
      include: PrismaUserRepository.INCLUDE_RELATIONS
    });
    return UserMapper.toDomain(user);
  }

  async update(id: string, params: Partial<UpdateUserParams>): Promise<User> {
    const { userType, ...rest } = params;
    const user = await this.prisma.user.update({ 
      where: { id }, 
      data: { 
        ...rest, 
        ...(userType && { userType: this.mapUserTypeToPrisma(userType) }) 
      },
      include: PrismaUserRepository.INCLUDE_RELATIONS
    });
    return UserMapper.toDomain(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
