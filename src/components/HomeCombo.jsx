'use client';

import { useState, useEffect } from 'react';
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

export default function HomeCombo() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    const [selectedVariations, setSelectedVariations] = useState({});

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products/combo');
                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        async function fetchWishlist() {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch('/api/wishlist', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const wishlistProductIds = data.wishlist.map(item => item.product._id);
            setWishlist(wishlistProductIds);
        }

        fetchWishlist();
    }, []);

    const toggleWishlist = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.info("Please login to use wishlist");
            return;
        }

        const isWishlisted = wishlist.includes(productId);
        const method = isWishlisted ? 'DELETE' : 'POST';

        await fetch('/api/wishlist', {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId })
        });

        if (isWishlisted) {
            setWishlist(wishlist.filter(id => id !== productId));
            toast.success("Removed from wishlist");
        } else {
            setWishlist([...wishlist, productId]);
            toast.success("Added to wishlist");
        }
    };

    const handleAddToCart = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.info("Please login to add to cart");
            return;
        }

        const variationId = selectedVariations[product._id];
        if (variationId && !variationId.match(/^[a-f\d]{24}$/i)) {
            toast.error('Invalid variation selected.');
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

    return (
        <>
            <section className="home-combo py-5" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 style={{ color: 'black', fontWeight: 'bold' }}>All Type of Dry Fruits Are Here</h2>
                        <div style={{
                            width: '150px',
                            height: '3px',
                            borderBottom: '3px dashed red',
                            margin: '8px auto 0 auto'
                        }}></div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 style={{ textDecoration: 'none', color: 'red', fontWeight: 'bold' }}>Combo Offers</h4>
                        <a href="/categories" style={{ textDecoration: 'none', color: 'red', fontWeight: 'bold' }}>
                            View all →
                        </a>
                    </div>
                    {loading ? (
                        <p className="text-center" style={{ color: 'black' }}>Loading products...</p>
                    ) : (
                        <div className="row">
                            {products.map((product) => (
                                <div key={product._id} className="col-md-4 mb-4">
                                    <div className="card position-relative p-3 shadow-sm rounded-4 text-center" style={{ background: "#F4ECE1", placeItems: 'center' }}>

                                        <div className="badge position-absolute" style={{ top: "15px", left: "15px", backgroundColor: '#C6A270', color: 'white' }}>
                                            Combo Dry Fruits Pack of 4
                                        </div>

                                        <div className="position-absolute" style={{ top: "15px", right: "15px", fontSize: "20px", color: "red" }}>
                                            <div onClick={() => toggleWishlist(product._id)} style={{ cursor: "pointer" }}>
                                                {wishlist.includes(product._id) ? <FaHeart /> : <FaRegHeart />}
                                            </div>
                                        </div>

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="rounded-circle mx-auto d-block my-3"
                                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                        />

                                        <h5 className="mt-2">{product.name}</h5>

                                        <p className="mb-3" style={{ fontSize: "16px" }}>
                                            {product.comboItems?.length || 0} Items = <strong>₹{product.price}</strong>
                                        </p>

                                        <button className="btn btn-danger w-50" onClick={() => handleAddToCart(product)}>Add To Cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <ToastContainer position="top-right" />
        </>
    );
}