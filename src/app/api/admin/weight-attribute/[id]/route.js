import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WeightAttribute from '@/models/WeightAttribute';
import Product from '@/models/Product';

export async function PUT(req, { params }) {
    await connectDB();
    const { label } = await req.json();

    if (!label || typeof label !== 'string' || !label.trim()) {
        return NextResponse.json({ error: 'Label is required' }, { status: 400 });
    }

    const exists = await WeightAttribute.findOne({ label: label.trim(), _id: { $ne: params.id } });
    if (exists) {
        return NextResponse.json({ error: 'Another attribute with this label already exists' }, { status: 409 });
    }

    const attr = await WeightAttribute.findByIdAndUpdate(
        params.id,
        { label: label.trim() },
        { new: true }
    );

    if (!attr) {
        return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Attribute updated', attribute: attr }, { status: 200 });
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

    const deleted = await WeightAttribute.findByIdAndDelete(params.id);
    if (!deleted) {
        return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}