import connectDB from '@/lib/mongodb';
import { getUserIdFromToken } from '@/lib/getUserFromToken';
import User from '@/models/User';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import Address from '@/models/Address';
import WeightAttribute from '@/models/WeightAttribute';

export async function GET(req) {
    await connectDB();

    const userId = getUserIdFromToken(req);
    if (!userId) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {

        const user = await User.findById(userId).select('name email phone');


        const orders = await Order.find({ user_id: userId }).select('_id total_amount upi_transaction_id order_status payment_status createdAt');

        const orderIds = orders.map(order => order._id);


        const orderItems = await OrderItem.find({ order_id: { $in: orderIds } })
            .populate('product', 'name image variations comboItems')
            .lean();
        const weightUnits = await WeightAttribute.find().lean();
        const formattedItems = orderItems.map(item => {
            const product = item.product;
            let variationInfo = null;
            let comboItemDetails = [];


            if (item.variation && product?.variations?.length > 0) {
                const variation = product.variations.find(v => v._id.toString() === item.variation.toString());
                if (variation) {
                    const unitObj = weightUnits.find(u => u._id.toString() === variation.weightUnit?.toString());

                    variationInfo = {
                        weight: variation.weight,
                        unit: unitObj?.label || '',
                        price: variation.price,
                    };
                }
            }


            if (product?.comboItems?.length > 0) {
                comboItemDetails = product.comboItems.map(ci => {
                    const unitObj = weightUnits.find(u => u._id.toString() === ci.weightUnit?.toString());

                    return {
                        name: ci.name,
                        weight: ci.weight,
                        unit: unitObj?.label || '',
                        price: ci.price,
                    };
                });
            }

            return {
                _id: item._id,
                order_id: item.order_id,
                quantity: item.quantity,
                product: {
                    name: product.name,
                    image: product.image,
                },
                variation: variationInfo,
                comboItems: comboItemDetails
            };
        });


        const addresses = await Address.find({ user_id: userId }).select('door_no address_line city state pincode country');

        return Response.json({
            user,
            orders,
            orderItems: formattedItems,
            addresses
        });

    } catch (error) {
        console.error('Customer profile fetch error:', error);
        return Response.json({ error: 'Failed to load profile data' }, { status: 500 });
    }
}