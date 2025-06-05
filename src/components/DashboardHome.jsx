'use client'

import { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Spinner } from 'react-bootstrap';
import { FaBox, FaCheckCircle, FaShoppingCart } from 'react-icons/fa';
import { FaCircle } from 'react-icons/fa';

export default function DashboardHome() {
    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        totalDelivered: 0,
        totalSoldItems: 0,
        products: [],
        latestOrders: [],
        monthlyRevenue: [],
        popularProducts: [],
        loading: true
    });
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    useEffect(() => {

        async function fetchDashboard() {
            try {
                const res = await fetch('/api/admin/dashboard');
                const data = await res.json();
                setDashboardData({ ...data, loading: false });
            } catch (err) {
                console.error(err);
                setDashboardData(prev => ({ ...prev, loading: false }));
            }
        }

        fetchDashboard();
    }, []);

    if (dashboardData.loading) {
        return <Spinner animation="border" />;
    }
    const sortedPopularProducts = [...dashboardData.popularProducts].sort((a, b) => b.totalOrdered - a.totalOrdered);

    const { totalOrders, totalDelivered, totalSoldItems, products, latestOrders, monthlyRevenue } = dashboardData;

    const filteredRevenue = monthlyRevenue?.find(r =>
        r._id.month === parseInt(selectedMonth) &&
        r._id.year === parseInt(selectedYear)
    )?.totalRevenue || 0;

    return (
        <>
            <h4 className="mb-4" style={{ color: '#AE0210', fontWeight: 'bold', fontSize: '26px' }}>Hello! User 👋</h4>
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body className="d-flex align-items-center" style={{ justifyContent: 'start', gap: '30px' }}>
                            <FaBox size={40} className="text-primary me-3" />
                            <div className="text-left">
                                <h2 className="mb-1" style={{ fontSize: '50px', }}>{totalOrders}</h2>
                                <div className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Total Orders</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body className="d-flex align-items-center" style={{ justifyContent: 'start', gap: '30px' }}>
                            <FaCheckCircle size={40} className="text-success me-3" />
                            <div className="text-left">
                                <h2 className="mb-1" style={{ fontSize: '50px' }}>{totalDelivered}</h2>
                                <div className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Total Delivered</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                {/* <Col>
                    <Card className="shadow-sm">
                        <Card.Body className="d-flex align-items-center" style={{ justifyContent: 'start', gap: '30px' }}>
                            <FaShoppingCart size={40} className="text-warning me-3" />
                            <div className="text-left">
                                <h2 className="mb-1" style={{ fontSize: '50px' }}>{totalSoldItems}</h2>
                                <div className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Sold Items</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col> */}
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body className="d-flex flex-column">
                            <div className="d-flex align-items-center mb-3" style={{ justifyContent: 'start', gap: '30px' }}>
                                <FaCheckCircle size={40} className="text-danger me-3" />
                                <div className="text-left">
                                    <h2 className="mb-1" style={{ fontSize: '30px' }}>₹{filteredRevenue}</h2>
                                    <div className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Revenue</div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <select
                                    className="form-select form-select-sm w-50 me-2"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    className="form-select form-select-sm w-50"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    {[...new Set(monthlyRevenue?.map(r => r._id.year))].map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div className="d-flex justify-content-center align-items-end gap-4 mb-4">
                {sortedPopularProducts.map((product, index) => (
                    <div
                        key={index}
                        className="text-white d-flex flex-column align-items-center justify-content-end p-3 rounded"
                        style={{
                            backgroundColor: '#F02131',
                            height: index === 0 ? '200px' : index === 1 ? '170px' : '150px',
                            width: '150px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: index === 0 ? '40px' : index === 1 ? '30px' : '20px',
                                marginBottom: '8px'
                            }}
                        >
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                        <div className="fw-bold text-center">{product.name}</div>
                        <div>Ordered: {product.totalOrdered}</div>
                    </div>
                ))}
            </div>


            <Table style={{ border: '1px solid #9E9E9E' }}>
                <thead>
                    <tr>
                        <th colSpan="4" className="bg-white" style={{ border: '1px solid #F02131' }}>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <span className="fw-bold fs-5">Products</span>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => window.location.href = '/admin/dashboard/products'}
                                    style={{ border: '1px solid #F02131', color: '#F02131' }}
                                >
                                    View All
                                </button>
                            </div>
                        </th>
                    </tr>

                    <tr>
                        <th style={{ width: '5%' }}>#</th>
                        <th>Name</th>
                        <th>Category</th>
                        {/* <th>Weight</th> */}
                    </tr>
                </thead>
                <tbody>
                    {(products && products.length > 0) ? (
                        products.map((product, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.category.name}</td>
                                {/* <td>{product.weight} {product.weightUnit?.label}</td> */}
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4">No products available</td></tr>
                    )}
                </tbody>
            </Table>

            <Table style={{ border: '1px solid #9E9E9E' }}>
                <thead>
                    <tr>
                        <th colSpan="5" className="bg-white" style={{ border: '1px solid #F02131' }}>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <span className="fw-bold fs-5">Orders</span>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => window.location.href = '/admin/dashboard/orders'}
                                    style={{ border: '1px solid #F02131', color: '#F02131' }}
                                >
                                    View All
                                </button>
                            </div>
                        </th>
                    </tr>

                    <tr>
                        <th style={{ width: '5%' }}>#</th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {(latestOrders && latestOrders.length > 0) ? (
                        latestOrders.map((order, idx) => (
                            <tr key={order._id}>
                                <td>{idx + 1}</td>
                                <td>{order._id}</td>
                                <td>{order.customerName}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4">No orders yet</td></tr>
                    )}
                </tbody>
            </Table>
        </>
    );
}