import { HttpRequest, HttpResponse } from '../protocols/http';
import MissingParamError from '../erros/missing-param-error';
import { badRequest } from '../helpers/http-helper';

class SignUpController {
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

        return undefined;
    };
}

export default SignUpController;
