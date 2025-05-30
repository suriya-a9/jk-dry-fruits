import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import deleteImage from '@/lib/deleteImage';

export async function PUT(req, { params }) {
    await connectDB();

    const { id } = params;
    const body = await req.json();

    const { name, price, category, image, comboItems = [], variations = [], isCombo, inStock } = body;

    const updatedProduct = await Product.findByIdAndUpdate(id, {
        name, price, category, image, comboItems, variations, isCombo, inStock
    }, { new: true });

    return Response.json(updatedProduct);
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const product = await Product.findById(params.id);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }


        deleteImage(product.image);


        await product.deleteOne();

        return NextResponse.json({ message: 'Product and image deleted' });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}