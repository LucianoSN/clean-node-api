import { EmailValidatorAdapter } from './email-validator';

describe('Email Validator Adapter', () => {
    it('should return false if validator returns false,', async () => {
        const sut = new EmailValidatorAdapter();
        const isValid = sut.isValid({ email: 'invalid_email@mail.com' });
        expect(isValid).toBeFalsy();
    });
});
