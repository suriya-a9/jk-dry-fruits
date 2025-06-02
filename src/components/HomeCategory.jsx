'use client';

import { useEffect, useState, useRef } from 'react';
import "./HomeCategory.css";
import Link from 'next/link';

export default function HomeCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    const onMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
    };

    const onMouseLeave = () => {
        isDragging.current = false;
    };

    const onMouseUp = () => {
        isDragging.current = false;
    };

    const onMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 1; // scroll speed
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    return (
        <section className="home-categories py-5" style={{ backgroundColor: 'white' }}>
            <div className="container">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="section-title" style={{ color: 'red', fontWeight: 'bold' }}>Categories</h2>
                    <Link href="/categories" className="text-danger fw-bold" style={{ textDecoration: 'none' }}>
                        View all →
                    </Link>
                </div>

                {loading ? (
                    <p className="text-center" style={{ color: 'black' }}>Loading categories...</p>
                ) : (
                    <div
                        className="d-flex overflow-auto category-scroll"
                        style={{ gap: '20px', cursor: isDragging.current ? 'grabbing' : 'grab' }}
                        ref={scrollRef}
                        onMouseDown={onMouseDown}
                        onMouseLeave={onMouseLeave}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                    >
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className="text-center p-3 rounded"
                                style={{
                                    minWidth: '200px',
                                    background: '#F4ECE1',
                                    flex: '0 0 auto'
                                }}
                            >
                                <img
                                    src={'/assets/admin/product-placeholder.webp'}
                                    alt={category.name}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        marginBottom: '10px'
                                    }}
                                    className="rounded-circle mx-auto"
                                />
                                <p className="text-danger fw-bold">{category.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}