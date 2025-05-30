
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CartItem from '@/models/Cart';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { getUserIdFromToken } from '@/lib/getUserFromToken';

export async function POST(req) {
    try {
        await connectDB();

        const userId = getUserIdFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { productId, quantity, variationId, comboItems } = body;

        if (!productId || !quantity) {
            return NextResponse.json({ error: 'Product ID and quantity are required.' }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json({ error: 'Invalid productId.' }, { status: 400 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
        }

        const productHasVariations = Array.isArray(product.variations) && product.variations.length > 0;
        if (productHasVariations && !variationId) {
            return NextResponse.json({ error: 'Please select a variation before adding to cart.' }, { status: 400 });
        }

        let variationObjectId = null;
        if (variationId) {
            if (mongoose.Types.ObjectId.isValid(variationId)) {
                variationObjectId = new mongoose.Types.ObjectId(variationId);
            } else {
                return NextResponse.json({ error: 'Invalid variationId.' }, { status: 400 });
            }

            const variationExists = product.variations.some(variation =>
                variation._id.equals(variationObjectId)
            );
            if (!variationExists) {
                return NextResponse.json({ error: 'Selected variation does not exist for this product.' }, { status: 400 });
            }
        }

        let safeComboItems = [];
        if (Array.isArray(comboItems)) {
            safeComboItems = comboItems.filter(id => mongoose.Types.ObjectId.isValid(id)).map(id => new mongoose.Types.ObjectId(id));
        }

        const existingItem = await CartItem.findOne({
            product: productId,
            variation: variationObjectId,
            user: userId
        });

        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();

            return NextResponse.json({ message: 'Cart updated.', item: existingItem }, { status: 200 });
        }

        const newItem = new CartItem({
            user: userId,
            product: productId,
            quantity,
            variation: variationObjectId,
            comboItems: safeComboItems
        });

        await newItem.save();

        return NextResponse.json({ message: 'Item added to cart.', item: newItem }, { status: 201 });

    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json({ error: 'Failed to add to cart.', details: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectDB();

        const userId = getUserIdFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const cartItems = await CartItem.find({ user: userId })
            .populate({
                path: 'product',
                populate: [
                    {
                        path: 'comboItems.weightUnit',
                        select: 'label'
                    },
                    {
                        path: 'variations.weightUnit',
                        select: 'label'
                    }
                ]
            })


        const formattedCart = cartItems.map(item => {
            const product = item.product;
            const variation = item.variation;


            if (variation) {

                const variationDetails = product.variations.find(v => v._id.equals(item.variation));

                return {
                    cartItemId: item._id,
                    quantity: item.quantity,
                    product: {
                        _id: product._id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        category: product.category?.name,
                        comboItems: Array.isArray(product.comboItems) ? product.comboItems.map(ci => ({
                            name: ci.name,
                            weight: ci.weight,
                            weightUnit: ci.weightUnit?.label || '',
                            price: ci.price || 0
                        })) : []
                    },
                    variation: variationDetails ? {
                        _id: variationDetails._id,
                        weight: variationDetails.weight,
                        weightUnit: variationDetails.weightUnit?.label,
                        price: variationDetails.price
                    } : null
                };
            } else {

                return {
                    cartItemId: item._id,
                    quantity: item.quantity,
                    product: {
                        _id: product._id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        category: product.category?.name,
                        comboItems: Array.isArray(product.comboItems) ? product.comboItems.map(ci => ({
                            name: ci.name,
                            weight: ci.weight,
                            weightUnit: ci.weightUnit?.label || '',
                            price: ci.price || 0
                        })) : []
                    },
                    variation: null
                };
            }
        });

        return NextResponse.json({ cart: formattedCart }, { status: 200 });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: 'Failed to fetch cart.', details: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectDB();
        const { cartItemId, quantity } = await req.json();


        if (quantity < 1) {
            return NextResponse.json({ error: 'Quantity must be greater than 0' }, { status: 400 });
        }


        const cartItem = await CartItem.findById(cartItemId);
        if (!cartItem) {
            return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        return NextResponse.json({ success: true, cartItem }, { status: 200 });
    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        const userId = getUserIdFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { cartItemId } = await req.json();

        if (!cartItemId || !mongoose.Types.ObjectId.isValid(cartItemId)) {
            return NextResponse.json({ error: 'Invalid cart item ID.' }, { status: 400 });
        }

        const item = await CartItem.findOneAndDelete({ _id: cartItemId, user: userId });

        if (!item) {
            return NextResponse.json({ error: 'Cart item not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Item removed from cart.' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        return NextResponse.json({ error: 'Failed to delete item.', details: error.message }, { status: 500 });
    }
}