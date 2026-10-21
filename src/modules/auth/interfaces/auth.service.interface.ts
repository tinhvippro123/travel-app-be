import { LoginDto, RegisterDto, TokenResponse } from "../dto/auth.dto.js";

export abstract class IAuthService {
    abstract login(dto: LoginDto): Promise<TokenResponse>;

    abstract register(dto: RegisterDto): Promise<TokenResponse>;
}
