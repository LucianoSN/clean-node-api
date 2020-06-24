import { EmailValidator } from '../presentation/protocols/email-validator';

export class EmailValidatorAdapter implements EmailValidator {
    isValid(args: { email: string }): boolean {
        return false;
    }
}
