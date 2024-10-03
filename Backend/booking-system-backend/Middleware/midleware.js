import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRAET_KEY); // Verify token
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware/route
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};
