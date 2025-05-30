import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import WeightAttribute from '@/models/WeightAttribute';

export async function GET() {
    try {
        await connectDB();

        const products = await Product.find({ inStock: true })
            .populate('category')
            .populate('comboItems.weightUnit')
            .populate('variations.weightUnit');

        return NextResponse.json({ products }, { status: 200 });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
    }
}