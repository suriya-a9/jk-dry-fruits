import connectMongo from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import Product from '@/models/Product';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

function getUserIdFromRequest(req) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch (err) {
        return null;
    }
}

export async function GET(req) {
    await connectMongo();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const wishlist = await Wishlist.find({ user: userId }).populate('product');
    return Response.json({ wishlist }, { status: 200 });
}

export async function POST(req) {
    await connectMongo();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
        return Response.json({ message: 'Product ID is required' }, { status: 400 });
    }

    const existing = await Wishlist.findOne({ user: userId, product: productId });
    if (existing) {
        return Response.json({ message: 'Product already in wishlist' }, { status: 200 });
    }

    const wishlistItem = new Wishlist({ user: userId, product: productId });
    await wishlistItem.save();

    return Response.json({ message: 'Product added to wishlist' }, { status: 201 });
}

export async function DELETE(req) {
    await connectMongo();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
        return Response.json({ message: 'Product ID is required' }, { status: 400 });
    }

    await Wishlist.findOneAndDelete({ user: userId, product: productId });
    return Response.json({ message: 'Product removed from wishlist' }, { status: 200 });
}