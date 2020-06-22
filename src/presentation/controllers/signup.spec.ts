import SignUpController from './signup';
import MissingParamError from '../erros/missing-param-error';
import InvalidParamError from '../erros/invalid-param-error';
import { EmailValidator } from '../protocols/email-validator';

type SutTypes = {
    sut: SignUpController;
    emailValidatorStub: EmailValidator;
};

const makeSut = (): SutTypes => {
    class EmailValidatorStub implements EmailValidator {
        isValid = (args: { email: string }): boolean => {
            return true;
        };
    }

    const emailValidatorStub = new EmailValidatorStub();
    const sut = new SignUpController(emailValidatorStub);

    return {
        sut,
        emailValidatorStub,
    };
};

describe('SignUp Controller', () => {
    it('should return 400 if no name is provided', async () => {
        const { sut } = makeSut();

        const request = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const httpResponse = sut.handle({ httpRequest: request });

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('name'));
    });

    it('should return 400 if no email is provided', async () => {
        const { sut } = makeSut();

        const request = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const httpResponse = sut.handle({ httpRequest: request });

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });

    it('should return 400 if no password is provided', async () => {
        const { sut } = makeSut();

        const request = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                passwordConfirmation: 'any_password',
            },
        };

        const httpResponse = sut.handle({ httpRequest: request });

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });

    it('should return 400 if no password confirmation is provided', async () => {
        const { sut } = makeSut();

        const request = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
            },
        };

        const httpResponse = sut.handle({ httpRequest: request });

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(
            new MissingParamError('passwordConfirmation')
        );
    });

    it('should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const request = {
            body: {
                name: 'any_name',
                email: 'invalid_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const httpResponse = sut.handle({ httpRequest: request });

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });

    it('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        const request = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        sut.handle({ httpRequest: request });

        expect(isValidSpy).toHaveBeenCalledWith({
            email: 'any_email@mail.com',
        });
    });
});
