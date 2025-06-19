import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
// Define rate limit constants
const rateLimit = 10; // Max requests per minute
const interval = 60 * 1000; // Time window in milliseconds (1 minute)

// Object to store request counts for each IP address
const requestCounts: any = {};

// Reset request count for each IP address every 'interval' milliseconds
setInterval(() => {
    Object.keys(requestCounts).forEach((ip) => {
        requestCounts[ip] = 0; // Reset request count for each IP address
    });
}, interval);

// Middleware function for rate limiting and timeout handling
export function rateLimitAndTimeout(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const ip = req.ip; // Get client IP address

    if (!ip) {
        res.status(StatusCodes.NOT_ACCEPTABLE).json({
            success: false,
            message: "Something wrong with your proxy",
        });
        return
    }

    // Update request count for the current IP
    requestCounts[ip] = (requestCounts[ip] || 0) + 1;

    // Check if request count exceeds the rate limit
    if (requestCounts[ip] > rateLimit) {
        // Respond with a 429 Too Many Requests status code
        res.status(StatusCodes.TOO_MANY_REQUESTS).json({
            success: false,
            message: "Rate limit exceeded.",
        });
        return
    }

    // Set timeout for each request (example: 10 seconds)
    req.setTimeout(15000, () => {
        // Handle timeout error
        res.status(StatusCodes.GATEWAY_TIMEOUT).json({
            success: false,
            message: "Gateway timeout.",
        });
        req.destroy(); // Abort the request
    });

    next(); // Continue to the next middleware
}
