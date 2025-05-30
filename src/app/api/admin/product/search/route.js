import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    await dbConnect();

    try {
        const products = await Product.find({
            name: { $regex: query, $options: 'i' }
        })
            .limit(10)
            .populate('category', 'name')
            .populate('variations.weightUnit', 'label')
            .populate('comboItems.weightUnit', 'label');

        return NextResponse.json(products);
    } catch (err) {
        console.error('Search API error:', err);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}