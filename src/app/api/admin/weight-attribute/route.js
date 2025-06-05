import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WeightAttribute from '@/models/WeightAttribute';

export async function GET() {
    await connectDB();
    const attributes = await WeightAttribute.find();
    return NextResponse.json(attributes);
}

export async function POST(req) {
    await connectDB();
    const { label } = await req.json();

    if (!label || typeof label !== 'string' || !label.trim()) {
        return NextResponse.json({ error: 'Label is required' }, { status: 400 });
    }

    const exists = await WeightAttribute.findOne({ label: label.trim() });
    if (exists) {
        return NextResponse.json({ error: 'Attribute already exists' }, { status: 409 });
    }

    const newAttr = new WeightAttribute({ label: label.trim() });
    await newAttr.save();

    return NextResponse.json(
        { message: 'Attribute created successfully', attribute: newAttr },
        { status: 201 }
    );
}