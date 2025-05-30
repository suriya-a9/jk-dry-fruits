'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { Table, Card, Spinner } from 'react-bootstrap';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();
                if (res.ok) {
                    setOrders(data.orders);
                } else {
                    console.error(data.error || 'Failed to fetch orders');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    async function handleStatusChange(orderId, newStatus) {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newStatus })
            });

            const data = await res.json();

            if (res.ok) {
                setOrders((prev) =>
                    prev.map(order =>
                        order._id === orderId ? { ...order, order_status: newStatus } : order
                    )
                );
            } else {
                alert(data.error || 'Failed to update order status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Error updating status');
        }
    }

    return (
        <>
            <DashboardLayout>
                <div className="container py-4">
                    <h2 className="mb-4 text-danger">My Orders</h2>

                    {loading ? (
                        <div className="text-center"><Spinner animation="border" /></div>
                    ) : orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        orders.map(order => (
                            <Card key={order._id} className="mb-4 shadow-sm">
                                <Card.Header style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <strong>Order ID:</strong> {order._id} <br />
                                        <small className="text-muted"><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</small> <br />
                                        <b>User:</b> {order.user?.name} ({order.user?.email}) <br />
                                        <b>Phone:</b> {order.user?.phone}
                                    </div>
                                    <div>
                                        <p style={{ marginBottom: '0px' }}><b>Payment status:</b> {order.payment_status}</p>
                                        <p style={{ marginBottom: '0px' }}>
                                            <b>Order status:</b>{' '}
                                            <select
                                                value={order.order_status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="form-select form-select-sm d-inline-block w-auto ms-2"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </p>
                                    </div>
                                </Card.Header>

                                <Card.Body>
                                    {/* ✅ Show Address */}
                                    <div className="mb-3">
                                        <h6>Shipping Address</h6>
                                        <p className="mb-1">
                                            <b>{order.address?.full_name}</b><br />
                                            {order.address?.door_no}, {order.address?.address_line}<br />
                                            {order.address?.area}, {order.address?.city} - {order.address?.pincode}<br />
                                            {order.address?.state}, {order.address?.country}
                                        </p>
                                    </div>

                                    {/* Product Table */}
                                    <Table responsive bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Qty</th>
                                                <th>Variation</th>
                                                <th>Combo Items</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <img src={item.product.image} alt={item.product.name} width="50" className="me-2" />
                                                        {item.product.name}
                                                    </td>
                                                    <td>{item.quantity}</td>
                                                    <td>
                                                        {item.variation ? (
                                                            <>
                                                                {item.variation.weight} {item.variation.unit} - ₹{item.variation.price}
                                                            </>
                                                        ) : (
                                                            '—'
                                                        )}
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
                                                        ) : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>

                                    <div className="text-end mt-3">
                                        <strong>Total: ₹{order.total_amount}</strong> <br />
                                        <small>Transaction ID: {order.upi_transaction_id}</small>
                                    </div>
                                </Card.Body>
                            </Card>

                        ))
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}