interface IErrorDTO {
    message: string;
    statusCode: number;
}

class AppError {
    public readonly message: string;

    public readonly statusCode: number;

    constructor({ message, statusCode }: IErrorDTO) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default AppError;
