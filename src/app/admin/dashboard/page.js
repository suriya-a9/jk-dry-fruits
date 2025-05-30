// src/app/admin/dashboard/page.jsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

import DashboardHome from '@/components/DashboardHome';
import DashboardLayout from '@/components/DashboardLayout';

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/admin/login');
    }

    return (
        <DashboardLayout>
            <DashboardHome />
        </DashboardLayout>
    );
}