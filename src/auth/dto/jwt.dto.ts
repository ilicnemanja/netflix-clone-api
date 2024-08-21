import { User } from "src/users/entities/user.entity";

export class JwtDto {
    sub: number;
    user: User;
    iat: number;
    exp: number;
}