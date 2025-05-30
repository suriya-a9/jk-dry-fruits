

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

export async function GET() {
    try {
        await connectDB();

        const categories = await Category.find();

        const result = await Promise.all(
            categories.map(async (category) => {
                const products = await Product.find({ category: category._id, inStock: true })
                    .populate('category')
                    .populate('variations.weightUnit')
                    .populate('comboItems.weightUnit');

                return {
                    category,
                    products
                };
            })
        );

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error('Error fetching categories with products:', error);
        return NextResponse.json({ error: 'Failed to fetch categories with products', details: error.message }, { status: 500 });
    }
}