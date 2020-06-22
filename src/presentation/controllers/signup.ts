import { HttpRequest, HttpResponse } from '../protocols/http';
import MissingParamError from '../erros/missing-param-error';
import { badRequest } from '../helpers/http-helper';

class SignUpController {
    public handle = (args: { httpRequest: HttpRequest }): HttpResponse => {
        if (!args.httpRequest.body.name) {
            return badRequest(new MissingParamError('name'));
        }

        if (!args.httpRequest.body.email) {
            return badRequest(new MissingParamError('email'));
        }

        return undefined;
    };
}

export default SignUpController;
