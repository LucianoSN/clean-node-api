import { AccountModel } from '../models/account';

export interface AddAccount {
    add(account: Omit<AccountModel, 'id'>): AccountModel;
}
