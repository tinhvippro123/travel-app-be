import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { IHashService } from '../interfaces/hash.service.interface.js';

@Injectable()
export class HashService implements IHashService {
    async hash(password: string): Promise<string> {
        return hash(password, 12);
    }

    async compare(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return compare(password, hashedPassword);
    }
}