import { AddAccount } from '../../../domain/usecases/add-account';
import { AccountModel } from '../../../domain/models/account';
import { Encrypter } from '../../protocols/encrypter';

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter;

    constructor(encrypter: Encrypter) {
        this.encrypter = encrypter;
    }

    add = async (account: Omit<AccountModel, 'id'>): Promise<AccountModel> => {
        await this.encrypter.encrypt(account.password);
        return Promise.resolve(undefined);
    };
}
