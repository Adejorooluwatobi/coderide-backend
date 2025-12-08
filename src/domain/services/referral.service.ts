import { Inject, Injectable, Logger } from '@nestjs/common';
import { Referral } from '../entities/referral.entity';
import type { IReferralRepository } from '../repositories/referral.repository.interface';
import { CreateReferralParams, UpdateReferralParams } from 'src/utils/type';

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);
  constructor(
    @Inject('IReferralRepository')
    private readonly referralRepository: IReferralRepository,
  ) {}

  async findById(id: string): Promise<Referral | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.referralRepository.findById(id);
  }

  async findAll(): Promise<Referral[]> {
    this.logger.log('Fetching all referrals');
    return this.referralRepository.findAll();
  }

  async findByReferredId(referredId: string): Promise<Referral | null> {
    if (!referredId || typeof referredId !== 'string') {
      this.logger.warn(`Invalid referredId provided: ${referredId}`);
      return null;
    }
    return this.referralRepository.findByReferredId(referredId);
  }

  async findByReferrerId(referrerId: string): Promise<Referral[]> {
    if (!referrerId || typeof referrerId !== 'string') {
      this.logger.warn(`Invalid referrerId provided: ${referrerId}`);
      return [];
    }
    return this.referralRepository.findByReferrerId(referrerId);
  }

  async findByCode(code: string): Promise<Referral | null> {
    if (!code || typeof code !== 'string') {
      this.logger.warn(`Invalid code provided: ${code}`);
      return null;
    }
    return this.referralRepository.findByCode(code);
  } 

  async create(referral: CreateReferralParams): Promise<Referral> {
    this.logger.log(`Creating referral with data: ${JSON.stringify(referral)}`);
    return this.referralRepository.create(referral);
  }

  async update(id: string, referral: Partial<UpdateReferralParams>): Promise<Referral> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating referral with id: ${id} and data: ${JSON.stringify(referral)}`);
    return this.referralRepository.update(id, referral);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting referral with id: ${id}`);
    return this.referralRepository.delete(id);
  }
}
