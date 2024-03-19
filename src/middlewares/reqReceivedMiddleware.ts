import { Request, Response, NextFunction } from 'express';
/**
 * Middleware function that logs the received request information.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
const reqReceivedMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} RECEIVED ${req.protocol}:/${req.url}`);
    next();
}

export default reqReceivedMiddleware;