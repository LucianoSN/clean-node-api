import * as bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return Promise.resolve('hash');
    },
}));

const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter();
};

describe('Bcrypt Adapter', () => {
    it('should call bcrypt with correct values', async () => {
        const salt = 12;
        const hashSpy = jest.spyOn(bcrypt, 'hash');

        const sut = makeSut();
        await sut.encrypt('any_value');

        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });

    it('should return a hash on success', async () => {
        const sut = makeSut();
        const hash = await sut.encrypt('any_value');

        expect(hash).toBe('hash');
    });
});
