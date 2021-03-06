import { DbAddAccount } from './db-add-account';
import { AccountModel } from '../../../domain/models/account';
import { Encrypter, AddAccountRepository } from './db-add-account-protocols';

type SutTypes = {
    sut: DbAddAccount;
    encrypterStub: Encrypter;
    addAccountRepositoryStub: AddAccountRepository;
};

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        encrypt = async (value: string): Promise<string> => {
            return new Promise(resolve => resolve('hashed_password'));
        };
    }

    return new EncrypterStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(
            accountData: Omit<AccountModel, 'id'>
        ): Promise<AccountModel> {
            const fakeAccount: AccountModel = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email',
                password: 'hashed_password',
            };

            return new Promise(resolve => resolve(fakeAccount));
        }
    }

    return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter();
    const addAccountRepositoryStub = makeAddAccountRepository();
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub,
    };
};

describe('DbAddAccount UseCase', () => {
    it('should call Encrypted with correct password', async () => {
        const { sut, encrypterStub } = makeSut();

        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        };

        await sut.add(accountData);

        expect(encryptSpy).toHaveBeenCalledWith('valid_password');
    });

    it('should throw if Encrypted throws', async () => {
        const { sut, encrypterStub } = makeSut();

        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            Promise.reject(new Error())
        );

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        };

        const promise = sut.add(accountData);

        await expect(promise).rejects.toThrow();
    });

    it('should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();

        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        };

        await sut.add(accountData);

        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password',
        });
    });

    it('should throw if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();

        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
            Promise.reject(new Error())
        );

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        };

        const promise = sut.add(accountData);

        await expect(promise).rejects.toThrow();
    });

    it('should return an account on success', async () => {
        const { sut } = makeSut();

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        };

        const account = await sut.add(accountData);

        expect(account).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password',
        });
    });
});
