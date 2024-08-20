import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: any) {
    try {
      const user = this.usersRepository.create(createUserDto);
      await this.usersRepository.save(user);

      return this.usersRepository.findOne({
        where: { userId: (user as any)?.userId },
        // select only the fields we need
        select: ['userId', 'firstName', 'lastName', 'username', 'email'],
      });
    } catch (error) {
      console.error('An unexpected error occurred:', error.message);
      throw new Error('An unexpected error occurred');
    }
  }

  findAll() {
    try {
      const users = this.usersRepository.find({ select: ['userId', 'firstName', 'lastName', 'username', 'email'] });
      return users;
    } catch (error) {
      console.error('An unexpected error occurred:', error.message);
      throw new Error('An unexpected error occurred');
    }
  }

  async findOne(id: number) {
    try {
      
      const user = await this.usersRepository.findOne({
        where: { userId: id },
        relations: ['subscription'],
        select: [
          'userId',
          'firstName',
          'lastName',
          'username',
          'email',
          'isActive',
          'createdAt',
          'updatedAt',
          'subscription'
        ]
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error('An unexpected error occurred:', error.message);
        throw new Error('An unexpected error occurred');
      }
    }
  }

  async update(id: number, updateUserDto: any) {
    try {
      const user = await this.usersRepository.update(id, updateUserDto);

      if (user?.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return this.findOne(id);

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error('An unexpected error occurred:', error.message);
        throw new Error('An unexpected error occurred');
      }
    }
  }

  async remove(id: number) {
    try {
      const user = await this.usersRepository.delete(id);

      if (user?.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // return message
      return {
        statusCode: HttpStatus.OK,
        message: `User with ID ${id} has been deleted`,
      }

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error('An unexpected error occurred:', error.message);
        throw new Error('An unexpected error occurred');
      }
    }
  }
}
