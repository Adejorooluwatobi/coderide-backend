import { DriverDocument as PrismaDriverDocument } from '@prisma/client';
import { DriverDocument } from '../../domain/entities/driver-document.entity';
import { DocumentType } from '../../domain/enums/document-type.enum';
import { DocumentStatus } from '../../domain/enums/document-status.enum';

export class DriverDocumentMapper {
  static toDomain(prismaDocument: PrismaDriverDocument): DriverDocument {
    return new DriverDocument({
      id: prismaDocument.id,
      driverId: prismaDocument.driverId,
      documentType: prismaDocument.documentType as DocumentType,
      documentUrl: prismaDocument.documentUrl,
      documentNumber: prismaDocument.documentNumber ?? undefined,
      expiryDate: prismaDocument.expiryDate ?? undefined,
      status: prismaDocument.status as DocumentStatus,
      rejectionReason: prismaDocument.rejectionReason ?? undefined,
      uploadedAt: prismaDocument.uploadedAt,
      verifiedAt: prismaDocument.verifiedAt ?? undefined,
      createdAt: prismaDocument.createdAt,
      updatedAt: prismaDocument.updatedAt,
    });
  }

  static toPrisma(document: DriverDocument): Omit<PrismaDriverDocument, 'createdAt' | 'updatedAt'> {
    return {
      id: document.id,
      driverId: document.driverId,
      documentType: document.documentType,
      documentUrl: document.documentUrl,
      documentNumber: document.documentNumber ?? null,
      expiryDate: document.expiryDate ?? null,
      status: document.status,
      rejectionReason: document.rejectionReason ?? null,
      uploadedAt: document.uploadedAt,
      verifiedAt: document.verifiedAt ?? null,
    };
  }
}
