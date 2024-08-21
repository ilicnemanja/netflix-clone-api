import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async signIn(email: string, pass: string): Promise<{ access_token: string }> {
        try {
            const user = await this.usersService.findOneByEmail(email);

            if (!user) {
                throw new UnauthorizedException("User not found");
            }

            if (user?.password !== pass) {
                throw new UnauthorizedException("Invalid credentials");
            }
            
            const payload = { sub: user.userId, user: user };

            return {
                access_token: await this.jwtService.signAsync(payload)
            };

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            } else if (error instanceof NotFoundException) {
                throw new UnauthorizedException("Invalid credentials");
            } else {
                console.error('An unexpected error occurred:', error.message);
                throw new Error('An unexpected error occurred');
            }
        }
    }

    async signUp(createUserDto: any) {
        try {
          const user = this.usersRepository.create(createUserDto);
          await this.usersRepository.save(user);

          const userObj = await this.usersRepository.findOne({
            where: { userId: (user as any)?.userId },
            // select only the fields we need
            select: ['userId', 'firstName', 'lastName', 'username', 'email'],
          });
    
          return userObj;
        } catch (error) {
          console.error('An unexpected error occurred:', error.message);
          throw new Error('An unexpected error occurred');
        }
      }
}