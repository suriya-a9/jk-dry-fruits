import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
    await connectMongo();
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
        return Response.json({ message: 'Email/Phone and password are required' }, { status: 400 });
    }

    const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) {
        return Response.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return Response.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const token = jwt.sign(
        { userId: user._id, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    return Response.json({
        message: 'Login successful',
        token,
        user: {
            name: user.name,
            email: user.email,
            phone: user.phone
        }
    }, { status: 200 });
}