'use client'

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

export default function OffersPage() {
    const [offers, setOffers] = useState([]);
    const [form, setForm] = useState({
        type: 'order_percentage',
        percentage: '',
        startDate: '',
        endDate: '',
    });

    const fetchOffers = async () => {
        const res = await fetch('/api/admin/offer');
        const data = await res.json();
        setOffers(data.offers || []);
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = form._id ? 'PUT' : 'POST';
        const url = form._id ? `/api/admin/offer/${form._id}` : '/api/admin/offer';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setForm({ type: 'order_percentage', percentage: '', startDate: '', endDate: '' });
            fetchOffers();
        }
    };

    const toggleOffer = async (id, currentStatus) => {
        await fetch(`/api/admin/offer/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: !currentStatus }),
        });
        fetchOffers();
    };

    return (
        <DashboardLayout>
            <h2>Manage Offers</h2>

            <Form onSubmit={handleSubmit} className="mb-4">
                <Form.Group>
                    <Form.Label>Offer Type</Form.Label>
                    <Form.Select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                        <option value="order_percentage">Order Percentage</option>
                        <option value="delivery_charge">Delivery Charge</option>
                    </Form.Select>
                </Form.Group>

                {form.type === 'order_percentage' && (
                    <Form.Group className="mt-2">
                        <Form.Label>Discount Percentage</Form.Label>
                        <Form.Control
                            type="number"
                            value={form.percentage}
                            onChange={(e) => setForm({ ...form, percentage: e.target.value })}
                            required
                        />
                    </Form.Group>
                )}

                <Form.Group className="mt-2">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        required
                    />
                </Form.Group>

                <Button type="submit" className="mt-3">Create Offer</Button>
            </Form>

            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Percentage</th>
                        <th>Status</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {offers.map((offer) => (
                        <tr key={offer._id}>
                            <td>{offer.type}</td>
                            <td>{offer.percentage || '-'}</td>
                            <td style={{ color: offer.isActive ? 'green' : 'red' }}>
                                {offer.isActive ? 'Active' : 'Inactive'}
                            </td>
                            <td>{offer.startDate?.slice(0, 10)}</td>
                            <td>{offer.endDate?.slice(0, 10)}</td>
                            <td>
                                <Button
                                    variant={offer.isActive ? 'danger' : 'success'}
                                    size="sm"
                                    onClick={() => toggleOffer(offer._id, offer.isActive)}
                                >
                                    {offer.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="ms-2"
                                    onClick={() => setForm({
                                        _id: offer._id,
                                        type: offer.type,
                                        percentage: offer.percentage || '',
                                        startDate: offer.startDate?.slice(0, 10),
                                        endDate: offer.endDate?.slice(0, 10),
                                    })}
                                >
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </DashboardLayout>
    );
}