import connectMongo from '@/lib/mongodb';
import Order from '@/models/Order';
import { getUserIdFromToken } from '@/lib/getUserFromToken';

export async function PATCH(req, { params }) {
    await connectMongo();

    const userId = getUserIdFromToken(req);
    if (!userId) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { newStatus } = await req.json();

    if (!newStatus) {
        return Response.json({ error: 'Missing newStatus' }, { status: 400 });
    }

    try {
        const order = await Order.findOne({ _id: id, user_id: userId });

        if (!order) {
            return Response.json({ error: 'Order not found' }, { status: 404 });
        }

        order.order_status = newStatus;
        await order.save();

        return Response.json({ success: true, message: 'Order status updated.' });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'Failed to update order status' }, { status: 500 });
    }
}