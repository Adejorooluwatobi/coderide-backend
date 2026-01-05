import { Module } from '@nestjs/common';
import { DriverController } from '../controllers/driver.controller';
import { DriverService } from '../../domain/services/driver.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaDriverRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.driver.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [DriverController],
  providers: [
    DriverService,
    {
      provide: 'IDriverRepository',
      useClass: PrismaDriverRepository,
    },
  ],
  exports: [DriverService, 'IDriverRepository'],
})
export class DriverModule {}
