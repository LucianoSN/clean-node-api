import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

describe('SignUp Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        await (await MongoHelper.getCollection('accounts')).deleteMany({});
    });

    it('should return an account on success', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'Steve Jobs',
                email: 'jobs@apple.com',
                password: '123',
                passwordConfirmation: '123',
            })
            .expect(200);
    });
});
