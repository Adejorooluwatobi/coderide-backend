import { User as PrismaUser } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      phone: prismaUser.phone,
      password: prismaUser.password,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      profilePicture: prismaUser.profilePicture ?? undefined,
      userType: prismaUser.userType,
      isActive: prismaUser.isActive,
      isVerified: prismaUser.isVerified,
      deletedAt: prismaUser.deletedAt ?? undefined,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  static toPrisma(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture ?? null,
      userType: user.userType,
      isActive: user.isActive,
      isVerified: user.isVerified,
      deletedAt: user.deletedAt ?? null,
    };
  }

  static toSecureResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      userType: user.userType,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
