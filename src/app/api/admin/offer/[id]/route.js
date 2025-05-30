import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Offer from '@/models/Offer';

export async function PUT(req, { params }) {
    await connectDB();
    const body = await req.json();
    const updated = await Offer.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
    await connectDB();
    await Offer.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' });
}