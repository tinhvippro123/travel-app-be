import { JwtPayload } from '../dto/auth.dto.js';

export abstract class ITokenService {
    abstract generateAccessToken(payload: JwtPayload): Promise<string>;

    abstract generateRefreshToken(): Promise<string>;

    abstract verifyAccessToken(accessToken: string): Promise<JwtPayload>;

    abstract verifyRefreshToken(refreshToken: string): Promise<JwtPayload>;
}