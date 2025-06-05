

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json(categories);
}

export async function POST(req) {
    await connectDB();

    const { name } = await req.json();


    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ error: 'Category name is required and must be a non-empty string.' }, { status: 400 });
    }


    const namePattern = /^[a-zA-Z0-9\s\-&]+$/;
    if (!namePattern.test(name)) {
        return NextResponse.json({ error: 'Category name contains invalid characters.' }, { status: 400 });
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
        return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }

    const newCategory = new Category({ name: name.trim() });
    await newCategory.save();

    return NextResponse.json({ message: 'Category created', category: newCategory }, { status: 201 });
}