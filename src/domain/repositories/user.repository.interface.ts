import { CreateUserParams, UpdateUserParams } from '../../utils/type';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserParams): Promise<User>;
  update(id: string, user: Partial<UpdateUserParams>): Promise<User>;
  delete(id: string): Promise<void>;
}
