import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';
import { ApiExtraModels, ApiOperation } from '@nestjs/swagger';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';
import { CreateUserDto } from 'src/application/DTO/user/create-user.dto';
import { UpdateUserDto } from 'src/application/DTO/user/update-user.dto';
// REMOVED 'import * as bcrypt from 'bcrypt';' - Hashing is service logic

@ApiExtraModels()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserId(@Param('id') userId: string) {
    const user = await this.userService.findById(userId);
    // CORRECTED: Throw NotFoundException (404) for missing resources
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const secureUser = UserMapper.toSecureResponse(user);
    return {
      succeeded: true,
      message: 'User retrieved successfully',
      resultData: secureUser
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    const users = await this.userService.findAll();
    const secureUsers = users.map(user => UserMapper.toSecureResponse(user));
    return {
      succeeded: true,
      message: 'Users retrieved successfully',
      resultData: secureUsers
    };
  }

  // @Get('me')
  // @ApiOperation({ summary: 'Get current user' })
  // // NOTE: This endpoint needs a correct way to get the current user's ID, 
  // // usually via a Guard/Decorator (e.g., @Req() req or @User() decorator).
  // // The current use of @Param('id') is incorrect for a 'me' route. 
  // // For now, we fix the exception handling.
  // async getCurrentUser(@Request() req: any) { 
  //   const userInfo = this.extractUserId(req.user);
  //   const userId = userInfo.id;
  //   const user = await this.userService.findById(userId);
  //   // CORRECTED: Throw NotFoundException (404)
  //   if (!user) {
  //     throw new NotFoundException('Current user not found');
  //   }
  //   const secureUser = UserMapper.toSecureResponse(user);
  //   return {
  //     succeeded: true,
  //     message: 'Current user retrieved successfully',
  //     resultData: secureUser
  //   };
  // }

  // private extractUserId(user: any): { id: string; type: string } {
  //   if (user.user?.id) return { id: user.user.id, type: 'user' };
  //   throw new NotFoundException('User ID not found in token');
  // }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  async getUserByEmail(@Param('email') email: string) { 
    const user = await this.userService.findByEmail(email);
    // CORRECTED: Throw NotFoundException (404)
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const secureUser = UserMapper.toSecureResponse(user);
    return {
      succeeded: true,
      message: 'User retrieved successfully',
      resultData: secureUser
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async createUser(@Body(new ValidationPipe()) userData: CreateUserDto) {
    // ALL BUSINESS/VALIDATION LOGIC REMOVED AND DELEGATED TO SERVICE
    // The service now handles: email/password existence, email format, email uniqueness, and password hashing.
    
    // The controller now only calls the service and handles its exceptions
    const user = await this.userService.create(userData);
    
    // Note: Since the service throws exceptions on failure, this check might be redundant, 
    // but it's safe to keep if the service can return null in other scenarios.
    // However, after the service fix, this check is likely unnecessary.
    
    const secureUser = UserMapper.toSecureResponse(user);
    return {
      succeeded: true,
      message: 'User created successfully',
      resultData: secureUser
    };
  }
  
  // NOTE: NestJS's global exception filter will automatically catch the NotFoundException 
  // and ConflictException thrown by the service and convert them into the correct 404/409 HTTP responses.
  // You do not need explicit try/catch blocks here unless you need custom response formatting.


  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  async updateUser(@Param('id') userId: string, @Body(new ValidationPipe()) userData: Partial<UpdateUserDto>) {
    // Service handles the 'User not found' check and throws NotFoundException (404)
    const updatedUser = await this.userService.update(userId, userData);
    
    const secureUser = UserMapper.toSecureResponse(updatedUser);
    return {
      succeeded: true,
      message: 'User updated successfully',
      resultData: secureUser
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  // CORRECTED: Added @Param('id') to get the ID from the URL
  async deleteUser(@Param('id') userId: string) {
    // Service handles the 'User not found' check and throws NotFoundException (404)
    await this.userService.delete(userId);
    
    // The previous incorrect check (`if (!userId)`) is removed.
    
    return { message: 'User deleted successfully' };
  }
}