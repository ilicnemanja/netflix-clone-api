import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { GetUser } from 'src/auth/decorator';
import { JwtDto } from 'src/auth/dto/jwt.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AuthGuard } from 'src/auth/guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfilesController {

    constructor(
        private profilesService: ProfilesService
    ) {}

    @Post('create')
    create(@GetUser() tokenObj: JwtDto, @Body() createProfileDto: CreateProfileDto) {
        return this.profilesService.create(tokenObj.user, createProfileDto);
    }

    @Patch(':id')
    update(@GetUser() tokenObj: JwtDto, @Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
        return this.profilesService.update(tokenObj.user, +id, updateProfileDto);
    }

    @Delete(':id')
    delete(@GetUser() tokenObj: JwtDto, @Param('id') id: string) {
        return this.profilesService.delete(tokenObj.user, +id);
    }
}
