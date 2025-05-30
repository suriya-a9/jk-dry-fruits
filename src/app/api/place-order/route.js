import connectMongo from '@/lib/mongodb';
import Address from '@/models/Address';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import OrderItem from '@/models/OrderItem';
import { getUserIdFromToken } from '@/lib/getUserFromToken';

export async function POST(req) {
    await connectMongo();

    const userId = getUserIdFromToken(req);
    if (!userId) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
        address_id,
        full_name, door_no, address_line, city, state, pincode, country, area,
        total_amount, upi_transaction_id
    } = body;

    try {
        let addressIdToUse;

        if (address_id) {

            const existingAddress = await Address.findOne({ _id: address_id, user_id: userId });
            if (!existingAddress) {
                return Response.json({ error: 'Invalid address selected' }, { status: 400 });
            }
            addressIdToUse = address_id;
        } else {

            const newAddress = await Address.create({
                user_id: userId,
                full_name, door_no, address_line, city, state, pincode, country, area
            });
            addressIdToUse = newAddress._id;
        }

        const cartItems = await Cart.find({ user: userId });
        if (cartItems.length === 0) {
            return Response.json({ error: 'Cart is empty.' }, { status: 400 });
        }

        const newOrder = await Order.create({
            user_id: userId,
            address_id: addressIdToUse,
            total_amount,
            upi_transaction_id,
            payment_status: 'Paid',
            order_status: 'Pending'
        });

        const orderItems = cartItems.map(item => ({
            order_id: newOrder._id,
            product: item.product,
            quantity: item.quantity,
            variation: item.variation || null,
            comboItems: item.comboItems || []
        }));

        await OrderItem.insertMany(orderItems);
        await Cart.deleteMany({ user: userId });

        return Response.json({ success: true }, { status: 200 });

    } catch (err) {
        console.error(err);
        return Response.json({ error: 'Failed to place order' }, { status: 500 });
    }
}