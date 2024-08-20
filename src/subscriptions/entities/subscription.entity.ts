
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn()
    subscriptionId: number;

    @Column()
    type: string;

    @Column({ length: 500 })
    description: string;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    price: number;

    @OneToMany(() => User, user => user.subscription)
    users: User[];
}
