import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator';

describe('Email Validator Adapter', () => {
    it('should return false if validator returns false,', async () => {
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

        const sut = new EmailValidatorAdapter();
        const isValid = sut.isValid({ email: 'invalid_email@mail.com' });

        expect(isValid).toBeFalsy();
    });

    it('should return true if validator returns true,', async () => {
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);

        const sut = new EmailValidatorAdapter();
        const isValid = sut.isValid({ email: 'valid_email@mail.com' });

        expect(isValid).toBeTruthy();
    });
});
