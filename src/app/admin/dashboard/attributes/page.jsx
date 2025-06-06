
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AttributesClient from './AttributesClient.jsx';

export default async function AttributesPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/admin/login');
    }

    return <AttributesClient />;
}