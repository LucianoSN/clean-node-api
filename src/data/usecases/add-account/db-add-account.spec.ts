import { Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

describe('DbAddAccount UseCase', () => {
    it('should call Encrypted with correct password', async () => {
        class EncrypterStub implements Encrypter {
            encrypt = async (value: string): Promise<string> => {
                return new Promise(resolve => resolve('hashed_password'));
            };
        }

        const encrypterStub = new EncrypterStub();
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

        const sut = new DbAddAccount(encrypterStub);

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        };

        await sut.add(accountData);

        expect(encryptSpy).toHaveBeenCalledWith('valid_password');
    });
});
