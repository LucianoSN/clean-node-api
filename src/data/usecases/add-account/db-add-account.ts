import {
    AccountModel,
    AddAccount,
    AddAccountRepository,
    Encrypter,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter;

    private readonly addAccountRepository: AddAccountRepository;

    constructor(
        encrypter: Encrypter,
        addAccountRepository: AddAccountRepository
    ) {
        this.encrypter = encrypter;
        this.addAccountRepository = addAccountRepository;
    }

    add = async (
        accountData: Omit<AccountModel, 'id'>
    ): Promise<AccountModel> => {
        const hashedPassword = await this.encrypter.encrypt(
            accountData.password
        );

        return this.addAccountRepository.add({
            ...accountData,
            password: hashedPassword,
        });
    };
}
