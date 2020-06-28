import * as bcrypt from 'bcrypt';
import { Encrypter } from '../../data/protocols/encrypter';

export class BcryptAdapter implements Encrypter {
    private readonly salt: number;

    constructor(salt = 12) {
        this.salt = salt;
    }

    encrypt = async (value: string): Promise<string> => {
        await bcrypt.hash(value, this.salt);
        return Promise.resolve('');
    };
}
