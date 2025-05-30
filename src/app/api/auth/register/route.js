import connectMongo from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    await connectMongo();
    const { name, phone, email, password, confirmPassword } = await req.json();

    if (!name || !phone || !email || !password || !confirmPassword) {
        return Response.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (password !== confirmPassword) {
        return Response.json({ message: 'Passwords do not match' }, { status: 400 });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(phone)) {
        return Response.json({ message: 'Invalid phone number' }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
        return Response.json({ message: 'Invalid email address' }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
        return Response.json({ message: 'User already exists with this email or phone' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, phone, email, password: hashedPassword });
    await newUser.save();

    return Response.json({ message: 'User registered successfully' }, { status: 201 });
}