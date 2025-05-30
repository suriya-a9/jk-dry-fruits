import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Offer from '@/models/Offer';

export async function GET() {
    await connectDB();
    const offers = await Offer.find();
    return NextResponse.json({ offers });
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        const newOffer = new Offer(body);
        const saved = await newOffer.save();

        return NextResponse.json(saved, { status: 201 });
    } catch (err) {
        console.error('Offer creation error:', err);
        return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
    }
}