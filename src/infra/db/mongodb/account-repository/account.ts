import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
    add = async (
        accountData: Omit<AccountModel, 'id'>
    ): Promise<AccountModel> => {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(accountData);
        return MongoHelper.map(result.ops[0]) as AccountModel;
    };
}
