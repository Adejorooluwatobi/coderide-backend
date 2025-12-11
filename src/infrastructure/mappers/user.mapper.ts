import { User as PrismaUser, UserType as PrismaUserType } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';
import { UserType } from 'src/domain/enums/user-type.enum';

export class UserMapper {
  private static mapUserTypeToDomain(prismaUserType: PrismaUserType): UserType {
    return prismaUserType === 'RIDER' ? UserType.RIDER : UserType.DRIVER;
  }

  private static mapUserTypeToPrisma(userType: UserType): PrismaUserType {
    return userType === UserType.RIDER ? 'RIDER' : 'DRIVER';
  }

  static toDomain(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      phone: prismaUser.phone,
      password: prismaUser.password,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      profilePicture: prismaUser.profilePicture ?? undefined,
      userType: this.mapUserTypeToDomain(prismaUser.userType),
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
      userType: this.mapUserTypeToPrisma(user.userType),
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
