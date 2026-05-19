import { StatusCodes } from 'http-status-codes';

export default class ApiError {
    statusCode: StatusCodes;
    error: string
    isCommunicable?: boolean;
    constructor(errorMessage: string, statusCode: StatusCodes, isCommunicable?: boolean) {
        this.error = errorMessage;
        this.statusCode = statusCode;
        this.isCommunicable = isCommunicable;
    }
}