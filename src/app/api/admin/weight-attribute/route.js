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

    if (!label) {
        return NextResponse.json({ message: 'Label is required' }, { status: 400 });
    }

    const exists = await WeightAttribute.findOne({ label });
    if (exists) {
        return NextResponse.json({ message: 'Attribute already exists' }, { status: 409 });
    }

    const newAttr = new WeightAttribute({ label });
    await newAttr.save();

    return NextResponse.json({ message: 'Attribute created', attribute: newAttr }, { status: 201 });
}