import * as bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

describe('Bcrypt Adapter', () => {
    it('should call bcrypt with correct value', async () => {
        const hashSpy = jest.spyOn(bcrypt, 'hash');

        const sut = new BcryptAdapter();
        await sut.encrypt('any_value');
        const salt = 12;

        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });
});
