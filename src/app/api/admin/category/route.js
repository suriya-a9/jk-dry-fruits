// src/app/api/admin/category/route.js

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

    const exists = await Category.findOne({ name });
    if (exists) {
        return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }

    const newCategory = new Category({ name });
    await newCategory.save();
    return NextResponse.json({ message: 'Category created', category: newCategory }, { status: 201 });
}