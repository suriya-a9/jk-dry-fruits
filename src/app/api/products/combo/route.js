import connectDB from '@/lib/mongodb';
import Product from "@/models/Product";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const comboCategory = await Category.findOne({ name: /^combo$/i });

        if (!comboCategory) {
            return NextResponse.json({ products: [] });
        }

        const products = await Product.find({ category: comboCategory._id, inStock: true })
            .populate('category')
            .populate({ path: 'comboItems.weightUnit' });


        const lastSixProducts = products.slice(-6);

        return NextResponse.json({ products: lastSixProducts });

    } catch (err) {
        console.error('Failed to fetch combo products:', err);
        return NextResponse.json({ error: 'Failed to fetch combo products' }, { status: 500 });
    }
}