import {
    AddAccount,
    Controller,
    EmailValidator,
    HttpResponse,
    HttpSignUpRequest,
} from './signup-protocols';

import { badRequest, serverError, success } from '../../helpers/http-helper';
import { InvalidParamError, MissingParamError } from '../../erros';

class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;

    private readonly addAccount: AddAccount;

    constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidator = emailValidator;
        this.addAccount = addAccount;
    }

    public handle = async (args: {
        httpRequest: HttpSignUpRequest;
    }): Promise<HttpResponse> => {
        try {
            const requiredFields = [
                'name',
                'email',
                'password',
                'passwordConfirmation',
            ];

            const {
                name,
                email,
                password,
                passwordConfirmation,
            } = args.httpRequest.body;

            for (const field of requiredFields) {
                if (!args.httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field));
                }
            }

            if (
                !this.confirmationIsValid({
                    password,
                    passwordConfirmation,
                })
            ) {
                return badRequest(
                    new InvalidParamError('passwordConfirmation')
                );
            }

            if (!this.emailIsValid(email)) {
                return badRequest(new InvalidParamError('email'));
            }

            const account = await this.addAccount.add({
                email,
                name,
                password,
            });

            return success(account);
        } catch (error) {
            return serverError();
        }
    };

    private emailIsValid = (email: string): boolean => {
        return this.emailValidator.isValid({
            email,
        });
    };

    private confirmationIsValid = (args: {
        password: string;
        passwordConfirmation: string;
    }): boolean => {
        return args.password === args.passwordConfirmation;
    };
}

export default SignUpController;
