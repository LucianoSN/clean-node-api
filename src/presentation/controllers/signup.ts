import {
    Controller,
    EmailValidator,
    HttpRequest,
    HttpResponse,
    HttpSignUpRequest,
} from '../protocols';

import { badRequest, serverError } from '../helpers/http-helper';
import { InvalidParamError, MissingParamError } from '../erros';

class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }

    public handle = (args: {
        httpRequest: HttpSignUpRequest;
    }): HttpResponse => {
        try {
            const requiredFields = [
                'name',
                'email',
                'password',
                'passwordConfirmation',
            ];

            const {
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

    private confirmationIsValid = (args: {
        password: string;
        passwordConfirmation: string;
    }): boolean => {
        return args.password === args.passwordConfirmation;
    };
}

export default SignUpController;
