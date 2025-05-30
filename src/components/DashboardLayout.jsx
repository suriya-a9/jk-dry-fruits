'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Container, Row, Col, Nav, Navbar, Form, InputGroup, FormControl, Dropdown, Button } from 'react-bootstrap';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import "./DashboardLayout.css";

function CustomToggle({ children, onClick }) {
    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            style={{ cursor: 'pointer' }}
        >
            {children}
        </div>
    );
}

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleLogout = () => {
        signOut({ callbackUrl: '/admin/login' });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        try {
            const res = await fetch(`/api/admin/product/search?q=${encodeURIComponent(searchTerm)}`);
            const data = await res.json();
            setSearchResults(data);
            setShowDropdown(true);
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
            setShowDropdown(false);
        }
    };


    return (
        <Container fluid className="vh-100 p-0" style={{ overflow: 'hidden' }}>
            <Navbar bg="light" expand="lg" className="px-4 shadow-sm" style={{ height: '70px' }}>
                <Navbar.Brand style={{ fontWeight: 'bold' }}>
                    <img src={'/assets/admin/admin-logo.webp'} alt="img" />
                </Navbar.Brand>

                {/* <Form className="d-flex mx-auto" style={{ width: '70%' }}>
                    <InputGroup style={{ backgroundColor: '#f1f1f1' }}>
                        <FormControl
                            type="search"
                            placeholder="Search Your Product"
                            style={{ backgroundColor: '#FFFFFF', borderRight: 'none', border: '1px solid #F02131' }}
                        />
                        <InputGroup.Text style={{ backgroundColor: '#FFFFFF', borderRight: 'none', border: '1px solid #F02131' }}>
                            <FaSearch style={{ color: '#F02131' }} />
                        </InputGroup.Text>
                    </InputGroup>
                </Form> */}

                <Form className="d-flex mx-auto w-75 position-relative" onSubmit={handleSearch}>
                    <InputGroup style={{ backgroundColor: '#f1f1f1', width: '100%' }}>
                        <FormControl
                            type="search"
                            placeholder="Search Your Product"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F02131', color: '#F02131' }}
                        />
                        <InputGroup.Text style={{ backgroundColor: '#FFFFFF', border: '1px solid #F02131', color: '#F02131' }}>
                            <Button style={{ backgroundColor: '#FFFFFF', border: 'none', color: '#F02131' }} type="submit">
                                <FaSearch />
                            </Button>
                        </InputGroup.Text>
                    </InputGroup>

                    {showDropdown && searchResults.length > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '100%',
                                backgroundColor: 'white',
                                zIndex: 1000,
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                maxHeight: '300px',
                                overflowY: 'auto',
                                border: '1px solid #ddd',
                                borderTop: 'none',
                            }}
                        >
                            {searchResults.map((product) => (
                                <div
                                    key={product._id}
                                    style={{
                                        padding: '10px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #f1f1f1',
                                        color: 'black'
                                    }}
                                    onClick={() => {
                                        router.push(`/admin/dashboard/products/${product._id}`);
                                        setShowDropdown(false);
                                        setSearchTerm('');
                                    }}
                                >
                                    <strong>{product.name}</strong>
                                </div>
                            ))}
                        </div>
                    )}
                </Form>

                <Dropdown align="end">
                    <Dropdown.Toggle variant="light" style={{ color: '#F02131', border: '1px solid #F02131', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        <FaUserCircle style={{ marginRight: 6 }} />
                        Admin
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Navbar>

            <Row className="h-100">
                <Col xs={2} className="bg-light p-0 border-end">
                    <Nav defaultActiveKey="/admin/dashboard" className="flex-column pt-4">
                        <Nav.Link
                            active={pathname === '/admin/dashboard'}
                            onClick={() => router.push('/admin/dashboard')}
                            className="px-4"
                        >
                            Dashboard
                        </Nav.Link>
                        <Nav.Link
                            active={pathname === '/admin/dashboard/categories'}
                            onClick={() => router.push('/admin/dashboard/categories')}
                            className="px-4"
                        >
                            Category
                        </Nav.Link>
                        <Nav.Link
                            active={pathname === '/admin/dashboard/attributes'}
                            onClick={() => router.push('/admin/dashboard/attributes')}
                            className="px-4"
                        >
                            Attributes
                        </Nav.Link>
                        <Nav.Link
                            active={pathname === '/admin/dashboard/products'}
                            onClick={() => router.push('/admin/dashboard/products')}
                            className="px-4"
                        >
                            Products
                        </Nav.Link>
                        <Nav.Link
                            active={pathname === '/admin/dashboard/orders'}
                            onClick={() => router.push('/admin/dashboard/orders')}
                            className="px-4"
                        >
                            Orders
                        </Nav.Link>
                        <Nav.Link
                            active={pathname === '/admin/dashboard/offers'}
                            onClick={() => router.push('/admin/dashboard/offers')}
                            className="px-4"
                        >
                            Offers
                        </Nav.Link>
                        <Nav.Link
                            active={pathname === '/admin/dashboard/charge'}
                            onClick={() => router.push('/admin/dashboard/charge')}
                            className="px-4"
                        >
                            Charge
                        </Nav.Link>
                    </Nav>
                </Col>

                <Col xs={10} className="p-4 dashboard-children" style={{ overflow: 'scroll', backgroundColor: '#F8F8F8', color: '#AE0210', height: '700px', marginBottom: '100px' }}>
                    {children}
                </Col>
            </Row>
        </Container>
    );
}