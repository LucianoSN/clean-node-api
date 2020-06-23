import SignUpController from './signup';
import { ServerError, MissingParamError, InvalidParamError } from '../erros';
import { EmailValidator } from '../protocols';
import { AccountModel } from '../../domain/models/account';
import { AddAccount } from '../../domain/usecases/add-account';

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid = (args: { email: string }): boolean => {
            return true;
        };
    }

    return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        add = (account: Omit<AccountModel, 'id'>): AccountModel => {
            return {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'valid_password',
            };
        };
    }

    return new AddAccountStub();
};

type SutTypes = {
    sut: SignUpController;
    emailValidatorStub: EmailValidator;
    addAccountStub: AddAccount;
};

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();
    const sut = new SignUpController(emailValidatorStub, addAccountStub);

    return {
        sut,
        emailValidatorStub,
        addAccountStub,
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

    it('should return 400 if no password confirmation fails', async () => {
        const { sut } = makeSut();

        const request = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password',
            },
        };

        const httpResponse = sut.handle({ httpRequest: request });

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(
            new InvalidParamError('passwordConfirmation')
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

    it('should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const request = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const httpResponse = sut.handle({ httpRequest: request });

        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    it('should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut();

        const addSpy = jest.spyOn(addAccountStub, 'add');

        const request = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        sut.handle({ httpRequest: request });

        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        });
    });
});
