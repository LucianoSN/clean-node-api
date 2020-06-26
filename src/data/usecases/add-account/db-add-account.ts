import {
    AccountModel,
    AddAccount,
    Encrypter,
} from './db-add-account-protocols';

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
