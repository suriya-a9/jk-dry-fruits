'use client';

import { Container, Nav, Navbar, Form, Button, InputGroup, Modal, Offcanvas } from 'react-bootstrap';
import { FaHeart, FaShoppingCart, FaSearch, FaTrashAlt, FaBars, FaUser } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaWeightHanging } from 'react-icons/fa6';
import { Dropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

function Header() {
    const pathname = usePathname();
    const [showModal, setShowModal] = useState(false);
    const [isLoginView, setIsLoginView] = useState(true);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', password: '', confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
    const [showCartOffcanvas, setShowCartOffcanvas] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [query, setQuery] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedVariations, setSelectedVariations] = useState({});
    const [isHeartActive, setIsHeartActive] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [mobileQuery, setMobileQuery] = useState('');
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (e) {
                console.warn('Invalid user data in localStorage. Clearing it.');
                localStorage.removeItem('user');
            }
        }
    }, []);

    useEffect(() => {
        async function fetchWishlist() {
            const token = localStorage.getItem('token');
            console.log(token);
            if (!token) return;

            const res = await fetch('/api/wishlist', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setWishlistProducts(data.wishlist.map(item => item.product));
        }

        if (showWishlistDropdown) {
            fetchWishlist();
        }
    }, [showWishlistDropdown]);

    const removeFromWishlist = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        await fetch('/api/wishlist', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId })
        });


        setWishlistProducts(wishlistProducts.filter(p => p._id !== productId));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.wishlist-dropdown-wrapper')) {
                setShowWishlistDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: formData.email, password: formData.password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);


            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            setShowModal(false);
            setFormData({ name: '', phone: '', email: '', password: '', confirmPassword: '' });
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegister = async () => {
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);


            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            setShowModal(false);
            setFormData({ name: '', phone: '', email: '', password: '', confirmPassword: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (e) {
                console.warn('Invalid user data in localStorage. Clearing it.');
                localStorage.removeItem('user');
            }
        }
    }, []);

    useEffect(() => {
        async function fetchCartItems() {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch('/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setCartItems(data.cart || []);
        }
        if (showCartOffcanvas) {
            fetchCartItems();
        }
    }, [showCartOffcanvas]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.reload();
    };

    const handleQuantityChange = async (cartItemId, operation) => {
        const token = localStorage.getItem('token');
        if (!token) return;


        const currentItem = cartItems.find(item => item.cartItemId === cartItemId);
        const updatedQuantity = operation === 'increase' ? currentItem.quantity + 1 : currentItem.quantity - 1;


        if (updatedQuantity < 1) return;


        const res = await fetch('/api/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cartItemId, quantity: updatedQuantity })
        });

        if (res.ok) {

            setCartItems(cartItems.map(item =>
                item.cartItemId === cartItemId ? { ...item, quantity: updatedQuantity } : item
            ));
        } else {
            toast.error('Failed to update quantity.');
        }
    };

    const handleDeleteFromCart = async (cartItemId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cartItemId })
        });

        if (res.ok) {
            setCartItems(cartItems.filter(item => item._id !== cartItemId));
            window.location.reload();
        } else {
            toast.error('Failed to remove item from cart.');
        }
    };
    const handleVariationChange = (productId, variationId) => {
        setSelectedVariations(prev => ({
            ...prev,
            [productId]: variationId
        }));
    };
    const handleAddToCart = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.info("Please login to add to cart");
            return;
        }


        const variationId = selectedVariations[product._id];


        if (product.variations?.length > 0 && !variationId) {
            toast.info("Please select a variation before adding to cart.");
            return;
        }

        const body = {
            productId: product._id,
            quantity: 1,
            variationId: variationId || null,
            comboItems: product.comboItems || [],
        };

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Item added to cart!');
            } else {
                toast.error(data.error || 'Failed to add to cart');
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            toast.error('Something went wrong');
        }
    };

    const handleSearch = async (e, searchText) => {
        e.preventDefault();


        const finalQuery = searchText !== undefined ? searchText : query;

        if (!finalQuery.trim()) return;

        try {
            const res = await fetch(`/api/products/search?q=${encodeURIComponent(finalQuery)}`);
            const data = await res.json();
            setSearchResults(data.products || []);
            setShowSearchModal(true);
        } catch (err) {
            console.error('Search failed:', err);
        }
    };


    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary d-none d-md-flex">
                <Container>
                    <Navbar.Brand href="/">
                        <img src={'/assets/admin/admin-logo.webp'} alt="Logo" height="40" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/" style={{ color: pathname === '/' ? '#F02131' : 'inherit' }}>Shop All</Nav.Link>
                            <Nav.Link href="/categories" style={{ color: pathname === '/categories' ? '#F02131' : 'inherit' }}>Categories</Nav.Link>
                            {/* <Nav.Link href="/products" style={{ color: pathname === '/products' ? '#F02131' : 'inherit' }}>Products</Nav.Link> */}
                        </Nav>

                        <Form className="d-flex me-3" onSubmit={handleSearch}>
                            <InputGroup>
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="search-input"
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleSearch}
                                    className="search-button"
                                >
                                    <FaSearch />
                                </Button>
                            </InputGroup>
                        </Form>

                        <Nav className="d-flex align-items-center me-3">
                            <Nav.Link>
                                <div className="wishlist-dropdown-wrapper position-relative">
                                    <FaHeart
                                        size={20}
                                        style={{
                                            color: isHeartActive ? '#F02131' : '#6c757d',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            setIsHeartActive(prev => !prev);
                                            setShowWishlistDropdown(prev => !prev);
                                        }}
                                    />

                                    {showWishlistDropdown && (
                                        <div
                                            className="wishlist-dropdown position-absolute bg-white shadow rounded p-3"
                                            style={{
                                                top: '30px',
                                                right: '0',
                                                width: '300px',
                                                zIndex: 9999
                                            }}
                                        >
                                            {wishlistProducts.length === 0 ? (
                                                <p className="mb-0 text-center text-muted">Your wishlist is empty.</p>
                                            ) : (
                                                wishlistProducts.map(product => (
                                                    <div key={product._id} className="d-flex flex-column border-bottom py-2">
                                                        <div className="d-flex align-items-center justify-content-between gap-2">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        objectFit: 'cover',
                                                                        borderRadius: '4px'
                                                                    }}
                                                                />
                                                                <div>
                                                                    <small className="fw-bold">{product.name}</small><br />
                                                                    {product.price && <small>₹{product.price}</small>}
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => removeFromWishlist(product._id)}
                                                            >
                                                                X
                                                            </Button>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            className="mt-2 w-100"
                                                            onClick={() => handleAddToCart(product)}
                                                            style={{ backgroundColor: '#dc3545', border: '1px solid #dc3545', color: 'white' }}
                                                        >
                                                            Add to Cart
                                                        </Button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Nav.Link>

                            <Nav.Link href='/cart' className="ms-2">
                                <FaShoppingCart size={20} style={{ color: pathname === '/cart' ? '#F02131' : '#6c757d' }} />
                            </Nav.Link>
                        </Nav>

                        {!user ? (
                            <Button
                                variant="primary"
                                style={{ color: '#F02131', border: '1px solid #F02131', backgroundColor: 'white' }}
                                onClick={() => setShowModal(true)}
                            >
                                Login / Signup
                            </Button>
                        ) : (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="light" style={{ color: '#F02131', border: '1px solid #F02131', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                    <FaUserCircle style={{ marginRight: 6 }} />
                                    {user.name || 'Profile'}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
                                    {/* Add more profile options here if needed */}
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout} className="text-danger">Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="d-flex d-lg-none justify-content-between align-items-center px-3 py-2 shadow-sm border-top border-danger position-relative" style={{ height: '100px' }}>

                <div className="d-flex align-items-center" style={{ gap: '25px' }}>
                    <button
                        className="btn btn-link p-0 text-dark"
                        onClick={() => setShowMobileMenu(true)}
                    >
                        <FaBars size={22} style={{ cursor: 'pointer', color: 'rgb(108, 117, 125)' }} />
                    </button>

                    <FaSearch
                        size={18}
                        style={{ cursor: 'pointer', color: 'rgb(108, 117, 125)' }}
                        onClick={() => setShowMobileSearch(prev => !prev)}
                    />

                    <div className="position-relative">
                        <FaHeart
                            size={18}
                            style={{
                                color: isHeartActive ? '#F02131' : '#6c757d',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setIsHeartActive(prev => !prev);
                                setShowWishlistDropdown(prev => !prev);
                            }}
                        />
                        {showWishlistDropdown && (
                            <div
                                className="wishlist-dropdown position-absolute bg-white shadow rounded p-3"
                                style={{
                                    top: '30px',
                                    left: '-100px',
                                    width: '280px',
                                    zIndex: 9999
                                }}
                            >
                                {wishlistProducts.length === 0 ? (
                                    <p className="mb-0 text-center text-muted">Your wishlist is empty.</p>
                                ) : (
                                    wishlistProducts.map(product => (
                                        <div key={product._id} className="d-flex flex-column border-bottom py-2">
                                            <div className="d-flex align-items-center justify-content-between gap-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                    <div>
                                                        <small className="fw-bold">{product.name}</small><br />
                                                        {product.price && <small>₹{product.price}</small>}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => removeFromWishlist(product._id)}
                                                >
                                                    X
                                                </Button>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="mt-2 w-100"
                                                onClick={() => handleAddToCart(product)}
                                                style={{ backgroundColor: '#dc3545', border: '1px solid #dc3545', color: 'white' }}
                                            >
                                                Add to Cart
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="position-absolute top-50 start-50 translate-middle">
                    <img
                        src="/assets/admin/admin-logo.webp"
                        alt="Logo"
                        height="35"
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                <div className="d-flex align-items-center" style={{ gap: '40px' }}>
                    <div onClick={() => {
                        if (!user) {
                            setShowModal(true); 
                        }
                    }} style={{ cursor: 'pointer' }}>
                        {user ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle
                                    variant="link"
                                    bsPrefix="p-0 border-0 bg-transparent"
                                    style={{ boxShadow: 'none' }}
                                >
                                    <FaUser size={18} style={{ color: 'rgb(108, 117, 125)' }} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout} className="text-danger">Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <FaUser size={18} style={{ color: 'rgb(108, 117, 125)' }} />
                        )}
                    </div>
                    <a href="/cart" className="position-relative text-dark">
                        <FaShoppingCart size={18} style={{ color: 'rgb(108, 117, 125)' }} />
                        {cartItems?.length > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                                {cartItems.length}
                            </span>
                        )}
                    </a>
                </div>
            </div>

            {showMobileSearch && (
                <div className="px-3 py-2 border-bottom bg-white d-lg-none">
                    <Form onSubmit={(e) => {
                        handleSearch(e, mobileQuery);
                        setShowMobileSearch(false);
                    }}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Search products..."
                                value={mobileQuery}
                                onChange={(e) => setMobileQuery(e.target.value)}
                            />
                            <Button
                                variant="outline-secondary"
                                type="submit"
                            >
                                <FaSearch />
                            </Button>

                        </InputGroup>
                    </Form>
                </div>
            )}

            <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <Nav.Link href="/" style={{ color: '#EF2231' }}>Shop All</Nav.Link>
                        <Nav.Link href="/categories" style={{ color: '#EF2231' }}>Categories</Nav.Link>
                        {/* <Nav.Link href="/wishlist">Wishlist</Nav.Link> */}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>

            {/* <Offcanvas show={showCartOffcanvas} onHide={() => setShowCartOffcanvas(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Your Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <ul className="list-unstyled">
                            {cartItems.map((item) => (
                                <li key={item.cartItemId} className="border-bottom py-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <strong>{item.product.name}</strong><br />

                                                {item.variation && (
                                                    <div className="mt-1">
                                                        <small className="text-muted">
                                                            Weight: {item.variation.weight}{item.variation.weightUnit} — ₹{item.variation.price}
                                                        </small>
                                                    </div>
                                                )}

                                                {item.product.comboItems && item.product.comboItems.length > 0 && (
                                                    <div className="mt-1">
                                                        <Dropdown>
                                                            <Dropdown.Toggle variant="link" id="dropdown-items" className="text-muted" style={{ textDecoration: 'none' }}>
                                                                Combo Items
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu>
                                                                {item.product.comboItems.map((comboItem, index) => (
                                                                    <Dropdown.Item key={index}>
                                                                        <small>{comboItem.name} — {comboItem.weight}{comboItem.weightUnit}</small>
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                )}
                                            </div>

                                            <small>Quantity: {item.quantity}</small><br />
                                            <div className="mt-2">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => handleQuantityChange(item.cartItemId, 'decrease')}
                                                >
                                                    -
                                                </Button>
                                                <span className="mx-2">{item.quantity}</span>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => handleQuantityChange(item.cartItemId, 'increase')}
                                                >
                                                    +
                                                </Button>
                                            </div>

                                        </div>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteFromCart(item.cartItemId)}>
                                            <FaTrashAlt />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Offcanvas.Body>
            </Offcanvas> */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                {/* <Modal.Header closeButton>
                    <Modal.Title>{isLoginView ? 'Login' : 'Register'}</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                    <div className="text-center mb-4">
                        <h4 className="fw-bold">{isLoginView ? 'Login' : 'Register'}</h4>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                            Best place to buy and sell digital products
                        </p>
                    </div>

                    <Form>
                        {!isLoginView && (
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        {!isLoginView && (
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm your password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        )}

                        <Button
                            className="w-100 py-2"
                            style={{
                                backgroundColor: '#F02131',
                                border: 'none',
                                fontWeight: 'bold'
                            }}
                            onClick={isLoginView ? handleLogin : handleRegister}
                        >
                            {isLoginView ? 'LOGIN' : 'REGISTER'}
                        </Button>

                        <div className="text-center mt-3">
                            <Button variant="link" onClick={() => setIsLoginView(!isLoginView)} style={{ color: '#EF2231' }}>
                                {isLoginView ? "Don't have an account? Register" : "Already have an account? Login"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showSearchModal} onHide={() => setShowSearchModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Products</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {searchResults.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        <div className="row">
                            {searchResults.map(product => (
                                <div key={product._id} className="col-md-6 mb-4">
                                    <div className="border rounded p-3 h-100">
                                        <div className="d-flex align-items-center mb-2">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 6,
                                                    objectFit: 'cover',
                                                    marginRight: 15
                                                }}
                                            />
                                            <div>
                                                <h5 className="mb-1">{product.name}</h5>
                                                <p className="mb-0"><strong>Category:</strong> {product.category?.name}</p>
                                                {product.price && (
                                                    <p className="mb-0"><strong>Price:</strong> ₹{product.price}</p>
                                                )}
                                            </div>
                                        </div>

                                        {product.variations?.length > 0 ? (
                                            <div className="mb-2">
                                                <Form.Group controlId={`variation-${product._id}`}>
                                                    <Form.Label><strong>Choose Variation:</strong></Form.Label>
                                                    <Form.Select
                                                        size="sm"
                                                        value={selectedVariations[product._id] || ''}
                                                        onChange={(e) => handleVariationChange(product._id, e.target.value)}
                                                    >
                                                        <option value="">Select weight</option>
                                                        {product.variations.map((variation, index) => (
                                                            <option key={index} value={variation._id}>
                                                                {variation.weight} {variation.weightUnit?.label} - ₹{variation.price}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>
                                        ) : (
                                            product.price && (
                                                <p><strong>Price:</strong> ₹{product.price}</p>
                                            )
                                        )}

                                        {product.comboItems?.length > 0 && (
                                            <div className="mb-2">
                                                <strong>Combo Items:</strong>
                                                <Form.Select size="sm" className="mt-1">
                                                    {product.comboItems.map((item, i) => (
                                                        <option key={i} value={i}>
                                                            {item.name} - {item.weight} {item.weightUnit?.label}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        )}
                                        <Button
                                            size="sm"
                                            className="mt-2 w-100"
                                            onClick={() => handleAddToCart(product)}
                                            style={{ backgroundColor: '#dc3545', border: '1px solid #dc3545', color: 'white' }}
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" style={{ backgroundColor: '#dc3545', color: 'white', border: 'none !important' }} onClick={() => setShowSearchModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-right" />
        </>
    );
}

export default Header;