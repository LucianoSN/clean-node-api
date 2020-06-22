export interface HttpResponse {
    statusCode: number;
    body: any;
}

export interface HttpRequest {
    body?: any;
}

export interface HttpSignUpRequest {
    body: {
        email?: string;
        password?: string;
        passwordConfirmation?: string;
    };
}
