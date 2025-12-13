import { Inject, Injectable, Logger, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import type { IUserRepository } from '../repositories/user.repository.interface';
import * as bcrypt from 'bcrypt'; // Added bcrypt import

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

    async findById(id: string): Promise<User | null> {  
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn(`User not found with id: ${id}`);
      return null;
    }
    return user;
  }

   async findAll(): Promise<User[]> {
    try {
      this.logger.log('Attempting to fetch all users');
      const users = await this.userRepository.findAll();
      this.logger.log(`Found ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error('Error in findAll:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email || typeof email !== 'string' || !this.isValidEmail(email)) {
      this.logger.warn(`Invalid email format: ${email}`);
      return null;
    }
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.warn(`User not found with email: ${email}`);
      return null;
    }
    return user;
  }

  // ALL BUSINESS LOGIC (EMAIL CHECK, HASHING, EXISTENCE) MOVED HERE
  async create(userData: Partial<User>): Promise<User> {
    if (!userData.email || !this.isValidEmail(userData.email)) {
      this.logger.error(`Invalid email provided: ${userData.email}`);
      throw new BadRequestException('Invalid email format'); // THROW NESTJS EXCEPTION
    }
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
        throw new ConflictException('User with this email already exists'); // THROW CONFLICT
    }   
    // HASHING LOGIC MOVED FROM CONTROLLER TO SERVICE
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }
    const newUser = await this.userRepository.create(userData as User);
    this.logger.log(`User created with id: ${newUser.id}`);
    return newUser;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      this.logger.error(`Cannot update, user not found with id: ${id}`);
      // THROW NESTJS EXCEPTION
      throw new NotFoundException('User not found'); 
    }
    // If you were updating the password, hashing would also happen here.
    
    const updatedUser = await this.userRepository.update(id, userData as User);
    this.logger.log(`User updated with id: ${updatedUser.id}`);
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const existingUser = await this.userRepository.findById(id);  
    if (!existingUser) {
      this.logger.error(`Cannot delete, user not found with id: ${id}`);
      // THROW NESTJS EXCEPTION
      throw new NotFoundException('User not found'); 
    }
    await this.userRepository.delete(id);
    this.logger.log(`User deleted with id: ${id}`);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}