import connectMongo from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import WeightAttribute from '@/models/WeightAttribute';
import User from '@/models/User';
import Address from '@/models/Address';

export async function GET(req) {
    await connectMongo();

    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        const weightUnits = await WeightAttribute.find().lean();

        const ordersWithDetails = await Promise.all(
            orders.map(async (order) => {
                const [user, address] = await Promise.all([
                    User.findById(order.user_id).lean(),
                    Address.findById(order.address_id).lean(),
                ]);

                const items = await OrderItem.find({ order_id: order._id })
                    .populate({
                        path: 'product',
                        select: 'name image variations comboItems'
                    });

                const formattedItems = items.map(item => {
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
                        product: {
                            name: product?.name || 'N/A',
                            image: product?.image || '',
                        },
                        quantity: item.quantity,
                        variation: variationInfo,
                        comboItems: comboItemDetails,
                    };
                });

                return {
                    ...order.toObject(),
                    user: {
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                    },
                    address: address ? {
                        full_name: address.full_name,
                        door_no: address.door_no,
                        address_line: address.address_line,
                        area: address.area,
                        city: address.city,
                        state: address.state,
                        pincode: address.pincode,
                        country: address.country,
                    } : null,
                    items: formattedItems
                };
            })
        );

        return Response.json({ orders: ordersWithDetails }, { status: 200 });

    } catch (err) {
        console.error('Error fetching admin orders:', err);
        return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}