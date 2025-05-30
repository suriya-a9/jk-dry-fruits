// src/app/api/admin/category/[id]/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function PUT(req, { params }) {
    await connectDB();
    const { name } = await req.json();
    const updated = await Category.findByIdAndUpdate(params.id, { name }, { new: true });

    return NextResponse.json({ message: 'Category updated', category: updated });
}

export async function DELETE(req, { params }) {
    await connectDB();
    await Category.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Category deleted' });
}