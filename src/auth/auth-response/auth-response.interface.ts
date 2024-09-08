import { User } from "src/users/entities/user.entity";

export interface AuthResponse {
    user: User;
    token: string;
}
