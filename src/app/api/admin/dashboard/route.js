import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import { User } from '@/models/User';

export async function GET() {
    try {
        await connectDB();

        const totalOrders = await Order.countDocuments();
        const totalDelivered = await Order.countDocuments({ order_status: 'Delivered' });

        const soldAgg = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { _id: null, total: { $sum: '$items.quantity' } } }
        ]);
        const totalSoldItems = soldAgg[0]?.total || 0;

        const latestOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('_id customerName status totalAmount')
            .populate({
                path: 'user_id',
                select: 'name'
            });

        const latestOrdersFormatted = latestOrders.map(order => ({
            _id: order._id,
            customerName: order.user_id?.name || 'N/A',
            status: order.status || 'pending',
            totalAmount: order.total_amount
        }));

        const products = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name category')
            .populate('category', 'name');
        const popularProducts = await Order.aggregate([
            { $match: { order_status: 'Delivered' } },
            {
                $lookup: {
                    from: 'orderitems',
                    localField: '_id',
                    foreignField: 'order_id',
                    as: 'items'
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalOrdered: { $sum: '$items.quantity' }
                }
            },
            { $sort: { totalOrdered: -1 } },
            { $limit: 3 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: 0,
                    productId: '$product._id',
                    name: '$product.name',
                    totalOrdered: 1
                }
            }
        ]);

        const monthlyRevenue = await Order.aggregate([
            { $match: { order_status: 'Delivered' } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    totalRevenue: { $sum: '$total_amount' }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } }
        ]);
        return NextResponse.json({
            totalOrders,
            totalDelivered,
            totalSoldItems,
            products,
            latestOrders: latestOrdersFormatted,
            monthlyRevenue,
            popularProducts
        });

    } catch (error) {
        console.error('Dashboard API Error:', error);
        return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
    }
}