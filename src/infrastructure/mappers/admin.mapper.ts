import { Admin as PrismaAdmin } from '@prisma/client';
import { Admin } from '../../domain/entities/admin.entity';
import { AdminStatus } from 'src/domain/enums/admin-status.enum';

export class AdminMapper {
  static toDomain(prismaAdmin: PrismaAdmin): Admin {
    return new Admin({
      id: prismaAdmin.id,
      username: prismaAdmin.username,
      password: prismaAdmin.password,
      permissions: prismaAdmin.permissions,
      status: prismaAdmin.status as AdminStatus,
    });
  }

  static toPrisma(admin: Admin): Omit<PrismaAdmin, 'id'> {
    return {
      username: admin.username,
      password: admin.password,
      permissions: admin.permissions,
      status: admin.status as AdminStatus,
    };
  }

  static toSecureResponse(admin: Admin) {
    return {
      id: admin.id,
      username: admin.username,
      permissions: admin.permissions,
      status: admin.status as AdminStatus,
    };
  }
}
