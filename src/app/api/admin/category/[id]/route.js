import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function PUT(req, { params }) {
    await connectDB();

    const { name } = await req.json();


    if (!name || name.trim().length === 0) {
        return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }


    const duplicate = await Category.findOne({ name, _id: { $ne: params.id } });
    if (duplicate) {
        return NextResponse.json({ error: 'Another category with the same name exists' }, { status: 400 });
    }

    const updated = await Category.findByIdAndUpdate(params.id, { name }, { new: true });

    if (!updated) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category updated', category: updated });
}

export async function DELETE(req, { params }) {
    await connectDB();

    const deleted = await Category.findByIdAndDelete(params.id);

    if (!deleted) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted' });
}