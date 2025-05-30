import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await connectDB();
        const { email, newPassword } = await req.json();

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        return NextResponse.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}