import { HttpRequest, HttpResponse } from '../protocols/http';

class SignUpController {
    public handle = (args: { httpRequest: HttpRequest }): HttpResponse => {
        if (!args.httpRequest.body.name) {
            return {
                statusCode: 400,
                body: new Error('Missing param: name'),
            };
        }

        if (!args.httpRequest.body.email) {
            return {
                statusCode: 400,
                body: new Error('Missing param: email'),
            };
        }

        return undefined;
    };
}

export default SignUpController;
