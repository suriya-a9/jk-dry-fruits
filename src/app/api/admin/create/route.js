

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import Admin from '../../../../models/Admin';
import connectMongo from '../../../../../src/lib/mongodb';

export async function POST(request) {

    const { email, password } = await request.json();


    await connectMongo();


    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return NextResponse.json(
            { message: 'Admin already exists' },
            { status: 400 }
        );
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newAdmin = new Admin({
        email,
        password: hashedPassword,
    });


    await newAdmin.save();


    return NextResponse.json({ message: 'Admin created successfully' });
}