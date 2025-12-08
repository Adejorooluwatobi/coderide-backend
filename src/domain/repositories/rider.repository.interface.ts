import { CreateRiderParams, UpdateRiderParams } from '../../utils/type';
import { Rider } from '../entities/rider.entity';

export interface IRiderRepository {
  findById(id: string): Promise<Rider | null>;
  findAll(): Promise<Rider[]>;
  findByUserId(userId: string): Promise<Rider | null>;
  findByDefaultPaymentMethodId(defaultPaymentMethodId: string): Promise<Rider | null>;
  create(rider: CreateRiderParams): Promise<Rider>;
  update(id: string, rider: Partial<UpdateRiderParams>): Promise<Rider>;
  delete(id: string): Promise<void>;
}
