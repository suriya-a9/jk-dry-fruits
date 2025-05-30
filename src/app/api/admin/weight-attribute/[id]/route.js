import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WeightAttribute from '@/models/WeightAttribute';
import Product from '@/models/Product';

export async function PUT(req, { params }) {
    await connectDB();
    const { label } = await req.json();
    const attr = await WeightAttribute.findByIdAndUpdate(params.id, { label }, { new: true });
    return NextResponse.json(attr);
}

export async function DELETE(req, { params }) {
    await connectDB();

    const usedInProducts = await Product.findOne({ weightAttribute: params.id });

    if (usedInProducts) {
        return NextResponse.json(
            { error: 'Cannot delete. Attribute is in use by existing products.' },
            { status: 400 }
        );
    }

    await WeightAttribute.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted successfully' });
}