import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import WeightAttribute from '@/models/WeightAttribute';

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const searchQuery = searchParams.get('q') || '';

        const products = await Product.find({
            name: { $regex: searchQuery, $options: 'i' },
            inStock: true
        })
            .populate('category', 'name')
            .populate('variations.weightUnit', 'label')
            .populate('comboItems.weightUnit', 'label');

        return NextResponse.json({ products });
    } catch (err) {
        console.error('Search API error:', err);
        return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
    }
}