import { AccountModel } from '../../domain/models/account';

export interface AddAccountRepository {
    add(accountData: Omit<AccountModel, 'id'>): Promise<AccountModel>;
}
