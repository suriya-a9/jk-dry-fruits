'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { Card, Table, Spinner } from 'react-bootstrap';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/customer/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();
                if (res.ok) {
                    setProfile(data);
                } else {
                    console.error(data.error);
                }
            } catch (err) {
                console.error('Profile fetch error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );
    }

    if (!profile) {
        return <p className="text-danger">Failed to load profile.</p>;
    }

    const { user, orders, orderItems, addresses } = profile;

    return (
        <>
            <Header />
            <section className='profile-section' style={{ backgroundColor: 'white' }}>
                <div className="container py-5">
                    <h2 className="mb-4 text-danger">Customer Profile</h2>

                    {/* User Info */}
                    <Card className="mb-4">
                        <Card.Header><strong>User Info</strong></Card.Header>
                        <Card.Body>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone:</strong> {user.phone}</p>
                        </Card.Body>
                    </Card>

                    {/* Orders */}
                    <Card className="mb-4">
                        <Card.Header><strong>Orders</strong></Card.Header>
                        <Card.Body style={{ height: '500px', overflowY: 'scroll' }}>
                            {orders.length === 0 ? (
                                <p>No orders found.</p>
                            ) : (
                                orders.map(order => (
                                    <Card key={order._id} className="mb-3">
                                        <Card.Body>
                                            <p><strong>Order ID:</strong> {order._id}</p>
                                            <p><strong>Total:</strong> ₹{order.total_amount}</p>
                                            <p><strong>UPI Transaction ID:</strong> {order.upi_transaction_id}</p>
                                            <p><strong>Order Status:</strong> {order.order_status}</p>
                                            <p><strong>Payment Status:</strong> {order.payment_status}</p>

                                            <div style={{ overflowX: 'auto' }}>
                                                <Table
                                                    bordered
                                                    size="sm"
                                                    className="mt-3"
                                                    style={{ minWidth: '600px' }} // 👈 prevents table from squeezing
                                                >
                                                    <thead>
                                                        <tr>
                                                            <th>Product</th>
                                                            <th>Quantity</th>
                                                            <th>Variation</th>
                                                            <th>Combo Items</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orderItems
                                                            .filter(item => item.order_id === order._id)
                                                            .map(item => (
                                                                <tr key={item._id}>
                                                                    <td>
                                                                        <img
                                                                            src={item.product.image}
                                                                            alt={item.product.name}
                                                                            width="40"
                                                                            className="me-2"
                                                                        />
                                                                        {item.product.name}
                                                                    </td>
                                                                    <td>{item.quantity}</td>
                                                                    <td>
                                                                        {item.variation
                                                                            ? `${item.variation.weight} ${item.variation.unit || ''} - ₹${item.variation.price}`
                                                                            : '—'}
                                                                    </td>
                                                                    <td>
                                                                        {item.comboItems.length > 0 ? (
                                                                            <details>
                                                                                <summary style={{ cursor: 'pointer' }}>View Items</summary>
                                                                                <ul className="mb-0 ps-3 mt-2">
                                                                                    {item.comboItems.map((ci, i) => (
                                                                                        <li key={i}>
                                                                                            {ci.name} - {ci.weight} {ci.unit}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </details>
                                                                        ) : (
                                                                            '—'
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))
                            )}
                        </Card.Body>
                    </Card>

                    {/* Addresses */}
                    <Card>
                        <Card.Header><strong>Saved Addresses</strong></Card.Header>
                        <Card.Body>
                            {addresses.length === 0 ? (
                                <p>No addresses found.</p>
                            ) : (
                                addresses.map((addr, idx) => (
                                    <div key={idx} className="mb-3">
                                        <p>
                                            {addr.door_no}, {addr.address_line},<br />
                                            {addr.city}, {addr.state} - {addr.pincode}<br />
                                            {addr.country}
                                        </p>
                                        <hr />
                                    </div>
                                ))
                            )}
                        </Card.Body>
                    </Card>
                </div>
            </section >
            <Footer />
        </>
    );
}