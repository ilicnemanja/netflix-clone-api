import { Controller, Get, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from './entities/user.entity';
import { JwtDto } from 'src/auth/dto/jwt.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getMe(@GetUser() tokenObj: JwtDto) {
    return this.usersService.findOne(tokenObj.user.userId);
  }
  
  @Patch()
  update(@GetUser() tokenObj: JwtDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(tokenObj.user.userId, updateUserDto);
  }

  @Delete()
  remove(@GetUser() tokenObj: JwtDto) {
    return this.usersService.remove(tokenObj.user.userId);
  }
}
