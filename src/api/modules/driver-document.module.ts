import { Module } from '@nestjs/common';
import { DriverDocumentController } from '../controllers/driver-document.controller';
import { DriverDocumentService } from '../../domain/services/driver-document.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaDriverDocumentRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.driver-document.repository';

@Module({
  imports: [PrismaModule],
  controllers: [DriverDocumentController],
  providers: [
    DriverDocumentService,
    {
      provide: 'IDriverDocumentRepository',
      useClass: PrismaDriverDocumentRepository,
    },
  ],
  exports: [DriverDocumentService],
})
export class DriverDocumentModule {}
