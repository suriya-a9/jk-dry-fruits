import jwt from 'jsonwebtoken';

export function getUserIdFromToken(req) {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();

    console.log('Auth header:', authHeader);
    console.log('Token:', token);

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        return decoded.userId;
    } catch (error) {
        console.error('Invalid token:', error.message);
        return null;
    }
}