import { HttpRequest, HttpResponse } from './http';

export interface Controller {
    handle(args: { httpRequest: HttpRequest }): Promise<HttpResponse>;
}
