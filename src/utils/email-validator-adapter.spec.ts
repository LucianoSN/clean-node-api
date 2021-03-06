import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

const makeSut = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter();
};

describe('Email Validator Adapter', () => {
    it('should return false if validator returns false,', async () => {
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

        const sut = makeSut();
        const isValid = sut.isValid({ email: 'invalid_email@mail.com' });

        expect(isValid).toBeFalsy();
    });

    it('should return true if validator returns true,', async () => {
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);

        const sut = makeSut();
        const isValid = sut.isValid({ email: 'valid_email@mail.com' });

        expect(isValid).toBeTruthy();
    });

    it('should call validator with correct email,', async () => {
        const isEmailSpy = jest.spyOn(validator, 'isEmail');

        const sut = makeSut();
        sut.isValid({ email: 'any_email@mail.com' });

        expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
    });
});
