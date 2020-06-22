import {
    Controller,
    EmailValidator,
    HttpRequest,
    HttpResponse,
} from '../protocols';

import { badRequest, serverError } from '../helpers/http-helper';
import { InvalidParamError, MissingParamError } from '../erros';

class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }

    public handle = (args: { httpRequest: HttpRequest }): HttpResponse => {
        try {
            const requiredFields = [
                'name',
                'email',
                'password',
                'passwordConfirmation',
            ];

            for (const field of requiredFields) {
                if (!args.httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field));
                }
            }

            if (
                !this.passwordConfirmationIsValid({
                    password: args.httpRequest.body.password,
                    passwordConfirmation:
                        args.httpRequest.body.passwordConfirmation,
                })
            ) {
                return badRequest(
                    new InvalidParamError('passwordConfirmation')
                );
            }

            if (!this.emailIsValid(args.httpRequest.body.email)) {
                return badRequest(new InvalidParamError('email'));
            }

            return undefined;
        } catch (error) {
            return serverError();
        }
    };

    private emailIsValid = (email: string): boolean => {
        return this.emailValidator.isValid({
            email,
        });
    };

    private passwordConfirmationIsValid = (args: {
        password: string;
        passwordConfirmation: string;
    }): boolean => {
        return args.password === args.passwordConfirmation;
    };
}

export default SignUpController;
