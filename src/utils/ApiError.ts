interface IApiError extends Error {
    statusCode: number;
    message: string;
    data: any;
    success: boolean;
    errors: any[];
    stack?: string; // Optional because the stack may or may not be provided
}

class ApiError extends Error implements IApiError {
    statusCode: number;
    data: any;
    success: boolean;
    errors: any[];

    constructor(
        statusCode: number,
        message: string = "An error occurred",
        errors: any[] = [],
        stack: string = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
