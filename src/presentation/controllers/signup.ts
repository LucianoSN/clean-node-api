import { HttpRequest, HttpResponse } from '../protocols/http';
import MissingParamError from '../erros/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import InvalidParamError from '../erros/invalid-param-error';

class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }

    public handle = (args: { httpRequest: HttpRequest }): HttpResponse => {
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
    };
}

export default SignUpController;
