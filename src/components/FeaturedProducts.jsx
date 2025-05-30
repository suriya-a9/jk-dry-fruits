"use client";

import { useState, useEffect } from "react";
import mongoose from "mongoose";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Navigation } from "swiper/modules";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import "swiper/css";
import "swiper/css/navigation";
import "./FeaturedProducts.css";

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [selectedVariations, setSelectedVariations] = useState({});

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/products");
                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
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
            alert("Please login to use wishlist");
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
        } else {
            setWishlist([...wishlist, productId]);
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
            alert("Please login to add to cart");
            return;
        }

        const variationId = selectedVariations[product._id];
        console.log('Received variationId:', variationId);
        if (variationId && !mongoose.Types.ObjectId.isValid(variationId)) {
            alert('Invalid variation selected.');
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
                alert('Item added to cart!');
            } else {
                alert(data.error || 'Failed to add to cart');
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('Something went wrong');
        }
    };

    return (
        <section className="featured-products py-5" style={{ background: "white" }} id="oderProducts">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{ color: "red", fontWeight: "bold" }}>Featured Products</h2>

                    <div className="d-flex gap-2">
                        <div className="swiper-button-prev-custom btn btn-light rounded-circle shadow-sm" style={{ width: "40px", height: "40px" }}>
                            <span style={{ fontSize: "20px" }}><IoIosArrowBack style={{ color: '#EF2231' }} /></span>
                        </div>
                        <div className="swiper-button-next-custom btn btn-light rounded-circle shadow-sm" style={{ width: "40px", height: "40px" }}>
                            <span style={{ fontSize: "20px" }}><IoIosArrowForward style={{ color: '#EF2231' }} /></span>
                        </div>
                    </div>
                </div>

                <Swiper
                    slidesPerView={4}
                    spaceBetween={20}
                    navigation={{
                        nextEl: ".swiper-button-next-custom",
                        prevEl: ".swiper-button-prev-custom",
                    }}
                    modules={[Navigation]}
                    className="mySwiper"
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        992: { slidesPerView: 3 },
                        1200: { slidesPerView: 4 },
                    }}
                >
                    {products.map((product) => (
                        <SwiperSlide key={product._id}>
                            <div className="card position-relative p-3 rounded-4 text-center" style={{ background: "white", borderBottom: '3px solid black', placeItems: "center", width: '100%', boxShadow: ' rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>

                                <div className="badge position-absolute" style={{ top: "15px", left: "15px", backgroundColor: '#C6A270', color: 'white' }}>
                                    New
                                </div>

                                <div
                                    className="position-absolute"
                                    style={{ top: "15px", right: "15px", fontSize: "20px", color: "red", cursor: "pointer" }}
                                    onClick={() => toggleWishlist(product._id)}
                                >
                                    {wishlist.includes(product._id) ? <FaHeart /> : <FaRegHeart />}
                                </div>


                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="rounded-circle mx-auto d-block my-3"
                                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                />

                                <h5 className="mt-2" style={{ color: 'black', fontSize: '18px', fontWeight: 'bold' }}>{product.name}</h5>

                                {product.variations && product.variations.length > 0 ? (
                                    <div className="my-3 w-75 mx-auto text-center">
                                        <label style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                                            Select Weight:
                                        </label>
                                        <select
                                            className="form-select"
                                            value={selectedVariations[product._id] || ''}
                                            onChange={(e) => handleVariationChange(product._id, e.target.value)}
                                        >
                                            <option value="">Select weight</option>
                                            {product.variations.map((variation, index) => (
                                                <option key={index} value={variation._id} className="text-center">
                                                    {variation.weight} {variation.weightUnit?.label} - ₹{variation.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="my-3 w-75 mx-auto text-center">
                                        <p style={{ fontSize: "14px", margin: '20px 0px' }}>
                                            Price : {''}<strong>₹{product.price}</strong>
                                        </p>
                                    </div>
                                )}

                                <button
                                    className="btn btn-danger w-75"
                                    style={{ borderRadius: '5px', margin: '20px 0px' }}
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add To Cart
                                </button>

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}