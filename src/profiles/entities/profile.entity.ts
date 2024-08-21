import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {

    @PrimaryGeneratedColumn()
    profileId: number

    @Column({ length: 50 })
    name: string;
    
    @ManyToOne(() => User, user => user.profiles)
    user: User;
}