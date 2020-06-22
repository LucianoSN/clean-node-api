import { HttpRequest, HttpResponse } from '../protocols/http';
import MissingParamError from '../erros/missing-param-error';

class SignUpController {
    public handle = (args: { httpRequest: HttpRequest }): HttpResponse => {
        if (!args.httpRequest.body.name) {
            return {
                statusCode: 400,
                body: new MissingParamError('name'),
            };
        }

        if (!args.httpRequest.body.email) {
            return {
                statusCode: 400,
                body: new MissingParamError('email'),
            };
        }

        return undefined;
    };
}

export default SignUpController;
