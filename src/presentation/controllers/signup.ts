import {
    HttpRequest,
    HttpResponse,
    Controller,
    EmailValidator,
} from '../protocols';

import { badRequest, serverError } from '../helpers/http-helper';
import { MissingParamError, InvalidParamError } from '../erros';

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

            const emailIsValid = this.emailValidator.isValid({
                email: args.httpRequest.body.email,
            });

            if (!emailIsValid) {
                return badRequest(new InvalidParamError('email'));
            }

            return undefined;
        } catch (error) {
            return serverError();
        }
    };
}

export default SignUpController;
