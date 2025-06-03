"use client";

import { useEffect, useState, useRef } from "react";
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { FaHeart } from "react-icons/fa6";
import mongoose from "mongoose";
import Header from "@/components/Header";
import { FaArrowRight, FaRegHeart } from "react-icons/fa6";
import Footer from "@/components/Footer";
import HomeBanner from "@/components/Banner";
import HomeMarquee from "@/components/Marquee";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [visibleCount, setVisibleCount] = useState(9);
    const [wishlist, setWishlist] = useState([]);
    const [selectedVariations, setSelectedVariations] = useState({});

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/categories-with-products");
                const data = await res.json();
                setCategories(data || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        }
        fetchCategories();
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

        setWishlist(isWishlisted ? wishlist.filter(id => id !== productId) : [...wishlist, productId]);
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
        if (variationId && !mongoose.Types.ObjectId.isValid(variationId)) {
            toast.error('Invalid variation selected.');
            return;
        }

        const body = {
            productId: product._id,
            quantity: 1,
            variationId: variationId || null,
            comboItems: [],
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


    const allProducts = categories.flatMap(cat => cat.products);

    const filteredProducts = activeCategory === 'all'
        ? allProducts
        : categories.find(cat => cat.category._id === activeCategory)?.products || [];

    const activeCategoryName = activeCategory === 'all'
        ? 'ALL'
        : categories.find(cat => cat.category._id === activeCategory)?.category.name || '';

    useEffect(() => {
        setVisibleCount(9);
    }, [activeCategory]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setShowLeftArrow(el.scrollLeft > 0);
        setShowRightArrow(el.scrollLeft + el.offsetWidth < el.scrollWidth - 1);
    };

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -150, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 150, behavior: 'smooth' });
    };

    useEffect(() => {
        checkScroll();
        const handleResize = () => checkScroll();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [categories]);

    return (
        <>
            <Header />
            <HomeBanner />
            <HomeMarquee />
            <section className="categories bg-white" id="oderProducts" style={{ margin: '40px 0px' }}>
                <div className="container">
                    <div className="row">
                        <div className="d-custom-none mb-3 position-relative">
                            <div
                                ref={scrollRef}
                                className="d-flex overflow-auto gap-2 px-2 no-scrollbar"
                                style={{
                                    scrollBehavior: 'smooth',
                                    whiteSpace: 'nowrap',
                                    paddingBottom: '10px',
                                }}
                                onScroll={checkScroll}
                            >
                                <button
                                    className={`btn flex-shrink-0 px-3 py-2 rounded-pill ${activeCategory === 'all' ? 'btn-dark text-white' : 'btn-outline-dark'}`}
                                    onClick={() => setActiveCategory('all')}
                                >
                                    Show All
                                </button>

                                {categories.map(cat => (
                                    <button
                                        key={cat.category._id}
                                        className={`btn flex-shrink-0 px-3 py-2 rounded-pill ${activeCategory === cat.category._id ? 'btn-dark text-white' : 'btn-outline-dark'}`}
                                        onClick={() => setActiveCategory(cat.category._id)}
                                    >
                                        {cat.category.name}
                                        <span className="badge bg-danger ms-1">{cat.products.length}</span>
                                    </button>
                                ))}
                            </div>

                            {showLeftArrow && (
                                <button
                                    onClick={scrollLeft}
                                    className="btn position-absolute top-50 start-0 translate-middle-y bg-white shadow"
                                    style={{ zIndex: 10, borderRadius: '50%', padding: '10px', marginTop: '-5px', color: '#F02131' }}
                                >
                                    <FaChevronLeft />
                                </button>
                            )}

                            {showRightArrow && (
                                <button
                                    onClick={scrollRight}
                                    className="btn position-absolute top-50 end-0 translate-middle-y bg-white shadow"
                                    style={{ zIndex: 10, borderRadius: '50%', padding: '10px', marginTop: '-5px', color: '#F02131' }}
                                >
                                    <FaChevronRight />
                                </button>
                            )}
                        </div>

                        <div className="d-none d-custom-block col-md-3">
                            <div className="p-3 border-end">
                                <h5 className="fw-bold text-white bg-danger" style={{ padding: '30px 10px' }}>Categories</h5>

                                <button
                                    className={`btn w-100 text-start mb-2 ${activeCategory === 'all' ? 'btn-dark text-white' : 'btn-light'}`}
                                    onClick={() => setActiveCategory('all')}
                                    style={{ padding: '20px 10px', borderRadius: '0px' }}
                                >
                                    Show All
                                </button>

                                {categories.map(cat => (
                                    <button
                                        key={cat.category._id}
                                        className={`btn w-100 d-flex justify-content-between align-items-center mb-2 ${activeCategory === cat.category._id ? 'btn-dark text-white' : 'btn-light'}`}
                                        onClick={() => setActiveCategory(cat.category._id)}
                                        style={{ padding: '20px 10px', borderRadius: '0px', borderBottom: '2px solid black', }}
                                    >
                                        <div>
                                            {cat.category.name} <span className="badge bg-danger ms-2">{cat.products.length}</span>
                                        </div>
                                        <FaArrowRight />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="col-12 col-md-9">
                            <div className="flex-grow-1 p-3">
                                <div className="row">
                                    {filteredProducts.slice(0, visibleCount).map((product, index) => (
                                        <div key={product._id || index} className="col-12 col-md-4 mb-4 custom-col">
                                            <div className="card text-center h-100 rounded-4 product-card visible" style={{ alignItems: 'center', borderBottom: '3px solid black', boxShadow: 'rgba(0,0,0,0.24) 0px 3px 8px' }}>
                                                <div className="w-100 d-flex justify-content-between align-items-center px-3 pt-3">
                                                    <span className="badge bg-warning text-dark">New</span>
                                                    <button
                                                        className="btn p-0 border-0 bg-transparent text-danger"
                                                        title="Add to wishlist"
                                                        onClick={() => toggleWishlist(product._id)}
                                                    >
                                                        {wishlist.includes(product._id) ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                                                    </button>
                                                </div>

                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="rounded-circle mx-auto my-3"
                                                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                                />

                                                <h5 className="fw-bold" style={{ margin: '10px 0px' }}>{product.name}</h5>

                                                {(!product.variations || product.variations.length === 0) && (
                                                    <p style={{ fontSize: "14px", margin: '10px 0px' }}>
                                                        Our Price = <strong>₹{product.price}</strong>
                                                    </p>
                                                )}

                                                {product.variations && product.variations.length > 0 && (
                                                    <div className="mb-2 w-75 mx-auto text-center">
                                                        <label className="form-label small fw-semibold">Select weight</label>
                                                        <select
                                                            className="form-select"
                                                            value={selectedVariations[product._id] || ''}
                                                            onChange={(e) => handleVariationChange(product._id, e.target.value)}
                                                        >
                                                            <option value="">Select weight</option>
                                                            {product.variations.map((variation, vIndex) => (
                                                                <option key={variation._id || vIndex} value={variation._id}>
                                                                    {variation.weight} {variation.weightUnit?.label} — ₹{variation.price}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                <button
                                                    className="btn btn-danger w-75"
                                                    style={{ margin: '20px 0px' }}
                                                    onClick={() => handleAddToCart(product)}
                                                >
                                                    Add To Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {visibleCount < filteredProducts.length && (
                                    <div className="text-center mt-4">
                                        <button className="btn px-4 py-2" onClick={handleLoadMore} style={{ border: '1px solid #F02131', color: '#F02131' }}>
                                            Load More
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <ToastContainer position="top-right" />
        </>
    );
}