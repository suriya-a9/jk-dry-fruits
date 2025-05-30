import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import deleteImage from '@/lib/deleteImage';

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find()
            .populate('category')
            .populate('variations.weightUnit')
            .populate('comboItems.weightUnit');

        return NextResponse.json(products);
    } catch (err) {
        console.error('Failed to fetch products:', err);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        console.log('🔹 Incoming body:', JSON.stringify(body, null, 2));

        const { category, name, image, weightUnit, comboItems = [], variations = [], inStock = true } = body;

        if (!category || !name) {
            console.log('❌ Missing required fields');
            return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
        }


        const isComboCategory = await Category.findById(category).then(cat => cat.name.toLowerCase() === 'combo');

        const productData = {
            category,
            name,
            image: image || '/assets/admin/product-placeholder.webp',
            inStock,
        };

        if (isComboCategory) {
            if (!comboItems.length) {
                return NextResponse.json({ error: 'Combo items required for combo category' }, { status: 400 });
            }
            if (!body.price) {
                return NextResponse.json({ error: 'Price is required for combo products' }, { status: 400 });
            }

            productData.comboItems = comboItems;
            productData.price = body.price;
            productData.variations = [];

        } else {
            if (!variations.length) {
                return NextResponse.json({ error: 'At least one variation required for non-combo product' }, { status: 400 });
            }

            productData.variations = variations;
            productData.comboItems = [];
            productData.price = undefined;
        }

        console.log('✅ Prepared productData:', productData);

        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        console.log('✅ Product saved:', savedProduct);

        return NextResponse.json({ message: 'Product added', product: savedProduct }, { status: 201 });

    } catch (error) {
        console.error('🔥 Error adding product:', error);
        return NextResponse.json({ error: 'Server Error', details: error.message }, { status: 500 });
    }
}