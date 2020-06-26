import { AccountModel } from '../models/account';

export interface AddAccount {
    add(accountData: Omit<AccountModel, 'id'>): Promise<AccountModel>;
}
