import { User as PrismaUser, UserType as PrismaUserType } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';
import { UserType } from 'src/domain/enums/user-type.enum';
import { RiderMapper } from './rider.mapper';
import { DriverMapper } from './driver.mapper';
import { PaymentMethodMapper } from './payment-method.mapper';
import { NotificationMapper } from './notification.mapper';
import { RatingMapper } from './rating.mapper';

export class UserMapper {
  private static mapUserTypeToDomain(prismaUserType: PrismaUserType): UserType {
    return prismaUserType as UserType;
  }

  static toDomain(prismaUser: any): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      phone: prismaUser.phone,
      password: prismaUser.password,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      profilePicture: prismaUser.profilePicture ?? undefined,
      userType: prismaUser.userType as UserType,
      isActive: prismaUser.isActive,
      isVerified: prismaUser.isVerified,
      deletedAt: prismaUser.deletedAt ?? undefined,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      // Mapping relations
      rider: prismaUser.rider ? RiderMapper.toDomain(prismaUser.rider) : undefined,
      driver: prismaUser.driver ? DriverMapper.toDomain(prismaUser.driver) : undefined,
      paymentMethods: prismaUser.paymentMethods?.map((pm: any) => PaymentMethodMapper.toDomain(pm)) || [],
      notifications: prismaUser.notifications?.map((n: any) => NotificationMapper.toDomain(n)) || [],
      sentRatings: prismaUser.sentRatings?.map((r: any) => RatingMapper.toDomain(r)) || [],
      receivedRatings: prismaUser.receivedRatings?.map((r: any) => RatingMapper.toDomain(r)) || [],
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
      userType: user.userType as UserType,
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
      rider: user.rider,
      driver: user.driver,
      paymentMethods: user.paymentMethods,
      notifications: user.notifications,
      sentRatings: user.sentRatings,
      receivedRatings: user.receivedRatings,
    };
  }
}
