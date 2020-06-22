class SignUpController {
    public handle = (args: { httpRequest: any }): any => {
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

        return {};
    };
}

export default SignUpController;
