export interface EmailValidator {
    isValid(args: { email: string }): boolean;
}
