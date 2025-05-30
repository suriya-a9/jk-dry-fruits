import connectMongo from '@/lib/mongodb';
import Address from '@/models/Address';
import { getUserIdFromToken } from '@/lib/getUserFromToken';

export async function GET(req) {
    await connectMongo();

    const userId = getUserIdFromToken(req);
    if (!userId) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const addresses = await Address.find({ user_id: userId }).sort({ createdAt: -1 });
        return Response.json({ addresses }, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'Failed to fetch addresses' }, { status: 500 });
    }
}