import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
    ) {}

    async create(user: User, createProfileDto: CreateProfileDto) {

        try {

            // check first how many profiles the user has
            const userProfiles = await this.countUserProfiles(user);

            // if the user has 4 profiles, return an error
            if (userProfiles.count >= 4) {
                throw new NotAcceptableException('You can only have 4 profiles');
            }

            const profile = new Profile();

            // check if the profile name already exists
            if (userProfiles.names.some(name => name === createProfileDto.name)) {
                throw new NotAcceptableException(`Profile ${createProfileDto.name} already exists`);
            }

            profile.name = createProfileDto.name;
            profile.user = user;

            await this.profileRepository.save(profile);

            return {
                statusCode: HttpStatus.OK,
                message: `Profile ${profile.name} created successfully`,
            }
        } catch (error) {
            if (error instanceof NotAcceptableException) {
                throw error;
            }else {
                console.error('An unexpected error occurred:', error.message);
                throw new Error('An unexpected error occurred');
            }
        }
    }

    async countUserProfiles(user: User) {
        const profiles = await this.profileRepository.findAndCount({ where: { user: { userId: user.userId } } });

        // get the count of profiles and name of the profiles
        const count = profiles[1];
        const profileNames = profiles[0].map(profile => profile.name);

        return { count, names: profileNames };
    }

    async delete(user: User, profileId: number) {
        try {
            const profile = await this.profileRepository.findOne({ where: { profileId, user: { userId: user.userId } } });

            if (!profile) {
                throw new NotAcceptableException('Profile not found');
            }

            await this.profileRepository.delete(profileId);

            return {
                statusCode: HttpStatus.OK,
                message: `Profile ${profile.name} deleted successfully`,
            }
        } catch (error) {
            if (error instanceof NotAcceptableException) {
                throw error;
            }else {
                console.error('An unexpected error occurred:', error.message);
                throw new Error('An unexpected error occurred');
            }
        }
    }

    async update(user: User, profileId: number, updateProfileDto: UpdateProfileDto) {
        try {
            const profile = await this.profileRepository.findOne({ where: { profileId, user: { userId: user.userId } } });

            if (!profile) {
                throw new NotAcceptableException('Profile not found');
            }

            // check if the profile name already exists
            const userProfiles = await this.countUserProfiles(user);

            if (userProfiles.names.some(name => name === updateProfileDto.name)) {
                throw new NotAcceptableException(`Profile ${updateProfileDto.name} already exists`);
            }

            profile.name = updateProfileDto.name;

            await this.profileRepository.save(profile);

            return {
                statusCode: HttpStatus.OK,
                message: `Profile ${profile.name} updated successfully`,
            }
        } catch (error) {
            if (error instanceof NotAcceptableException) {
                throw error;
            }else {
                console.error('An unexpected error occurred:', error.message);
                throw new Error('An unexpected error occurred');
            }
        }
    }
    
}
