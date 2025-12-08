import { CreateReferralParams, UpdateReferralParams } from '../../utils/type';
import { Referral } from '../entities/referral.entity';

export interface IReferralRepository {
  findById(id: string): Promise<Referral | null>;
  findAll(): Promise<Referral[]>;
  findByReferredId(referredId: string): Promise<Referral | null>;
  findByReferrerId(referrerId: string): Promise<Referral[]>;
  findByCode(code: string): Promise<Referral | null>;
  create(referral: CreateReferralParams): Promise<Referral>;
  update(id: string, referral: Partial<UpdateReferralParams>): Promise<Referral>;
  delete(id: string): Promise<void>;
}
