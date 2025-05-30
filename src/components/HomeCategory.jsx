'use client';

import { useEffect, useState } from 'react';
import "./HomeCategory.css";
import Link from 'next/link';

export default function HomeCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    <div className="d-flex overflow-auto" style={{ gap: '80px' }}>
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