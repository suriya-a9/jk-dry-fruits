'use client'

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Row, Col, InputGroup, Spinner
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState('all');

    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        name: '', image: '', category: '', weightUnit: '', comboItems: [], variations: [], price: ''
    });

    const isComboCategory = () => {
        const selectedCat = categories.find(cat => cat._id === form.category);
        return selectedCat?.name?.toLowerCase() === 'combo';
    };

    const fetchData = async () => {
        const [prodRes, catRes, attrRes] = await Promise.all([
            fetch('/api/admin/product'),
            fetch('/api/admin/category'),
            fetch('/api/admin/weight-attribute')
        ]);
        const [prodData, catData, attrData] = await Promise.all([
            prodRes.json(), catRes.json(), attrRes.json()
        ]);
        setProducts(prodData);
        setCategories(catData);
        setAttributes(attrData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);
    const updateComboItem = (index, field, value) => {
        setForm(prev => {
            const updated = [...prev.comboItems];
            if (!updated[index]) {
                updated[index] = { name: '', weight: '', weightUnit: '', attributes: [] };
            }

            updated[index] = {
                ...updated[index],
                [field]: value,
            };

            return { ...prev, comboItems: updated };
        });
    }


    const addComboItem = () => {
        setForm(prev => ({
            ...prev,
            comboItems: [...prev.comboItems, { name: '', weight: '', weightUnit: '', attributes: [] }]
        }));
    };

    const removeComboItem = (index) => {
        const updated = form.comboItems.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, comboItems: updated }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const updateVariation = (index, field, value) => {
        const updated = [...form.variations];
        updated[index][field] = value;
        setForm(prev => ({ ...prev, variations: updated }));
    };

    const addVariation = () => {
        setForm(prev => ({
            ...prev,
            variations: [...prev.variations, { weight: '', weightUnit: '', price: '' }]
        }));
    };

    const removeVariation = (index) => {
        const updated = form.variations.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, variations: updated }));
    };
    const filteredProducts = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const priceMatch = p.variations?.some(v =>
            v.price?.toString().includes(searchTerm)
        );

        const stockMatch =
            stockFilter === 'all'
                ? true
                : stockFilter === 'in'
                    ? p.inStock
                    : !p.inStock;

        return (nameMatch || categoryMatch || priceMatch) && stockMatch;
    });

    const handleSave = async () => {
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/admin/product/${editId}` : '/api/admin/product';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success(result.message || 'Product saved successfully');
                setShowModal(false);
                setForm({
                    name: '', image: '', category: '', weightUnit: '',
                    comboItems: [], variations: []
                });
                setEditId(null);
                fetchData();
            } else {
                toast.error(result.error || 'Failed to save product');
            }
        } catch (error) {
            toast.error('An error occurred while saving');
        }
    };

    const handleEdit = (product) => {
        const isCombo = product.comboItems && product.comboItems.length > 0;

        setForm({
            name: product.name,
            image: product.image,
            category: product.category._id,
            weightUnit: product.weightUnit?._id || '',
            price: product.price || '',
            comboItems: (product.comboItems || []).map(item => ({
                name: item.name,
                weight: item.weight,
                weightUnit: item.weightUnit?._id || '',
                attributes: item.attributes || [],
            })),
            variations: isCombo
                ? []
                : (product.variations || []).map(v => ({
                    weight: v.weight,
                    weightUnit: v.weightUnit?._id || '',
                    price: v.price
                }))
        });

        setEditId(product._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            try {
                const res = await fetch(`/api/admin/product/${id}`, { method: 'DELETE' });
                const result = await res.json();

                if (res.ok) {
                    toast.success(result.message || 'Product deleted successfully');
                    fetchData();
                } else {
                    toast.error(result.error || 'Failed to delete product');
                }
            } catch (error) {
                toast.error('An error occurred while deleting');
            }
        }
    };

    const toggleStockStatus = async (id, newStatus) => {
        const product = products.find(p => p._id === id);
        if (!product) return;

        const updatedData = {
            ...product,
            inStock: newStatus,
        };

        try {
            const res = await fetch(`/api/admin/product/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success('Stock status updated');
                fetchData();
            } else {
                toast.error(result.error || 'Failed to update stock status');
            }
        } catch (error) {
            toast.error('An error occurred while updating stock status');
        }
    };

    return (
        <>
            <DashboardLayout>
                <Row className="mb-3">
                    <Col><h4>Products</h4></Col>
                    <Col className="text-end">
                        <Button onClick={() => {
                            setShowModal(true);
                            setEditId(null);
                            setForm({ name: '', image: '', category: '', weightUnit: '', comboItems: [], variations: [] });
                        }} style={{ backgroundColor: 'rgb(240, 33, 49)', border: 'none', }}>+ Add Product</Button>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Control
                            type="text"
                            placeholder="Search by name, category, or price"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                            <option value="all">All Stock Status</option>
                            <option value="in">In Stock</option>
                            <option value="out">Out of Stock</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Table striped bordered hover style={{ paddingBottom: '45px' }}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            {/* <th>Price</th> */}
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((p, i) => (
                            <tr key={p._id}>
                                <td>{i + 1}</td>
                                <td>{p.name}</td>
                                {/* <td>
                                    {p.variations.map((v, idx) => (
                                        <div key={idx}>
                                            {v.weight} {v.weightUnit?.label} — ₹{v.price}
                                        </div>
                                    ))}
                                </td> */}
                                <td>{p.category?.name}</td>
                                <td>
                                    <span style={{ color: p.inStock ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                    <br />
                                    <Button
                                        size="sm"
                                        variant={p.inStock ? 'danger' : 'success'}
                                        onClick={() => toggleStockStatus(p._id, !p.inStock)}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        {p.inStock ? 'Make Out of Stock' : 'Make In Stock'}
                                    </Button>
                                </td>
                                <td>
                                    <img
                                        src={p.image || '/assets/admin/product-placeholder.webp'}
                                        height="40"
                                        style={{ width: '40px' }}
                                        alt="Product Image"
                                    />
                                </td>
                                <td>
                                    <Button size="sm" variant="warning" onClick={() => handleEdit(p)}>Edit</Button>{' '}
                                    <Button size="sm" variant="danger" onClick={() => handleDelete(p._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </Table>

                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{editId ? 'Edit Product' : 'Add Product'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select name="category" value={form.category} onChange={handleChange}>
                                        <option value="">-- Select --</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control name="name" value={form.name} onChange={handleChange} />
                                </Form.Group>

                                {!isComboCategory() ? (
                                    <>
                                        <h6>Variations</h6>
                                        {form.variations.map((v, idx) => (
                                            <div key={idx} className="mb-3 p-2 border rounded">
                                                <Row>
                                                    <Col>
                                                        <InputGroup>
                                                            <Form.Control
                                                                placeholder="Weight"
                                                                type="number"
                                                                value={v.weight}
                                                                onChange={(e) => updateVariation(idx, 'weight', e.target.value)}
                                                            />
                                                            <Form.Select
                                                                value={v.weightUnit}
                                                                onChange={(e) => updateVariation(idx, 'weightUnit', e.target.value)}
                                                            >
                                                                <option value="">--Unit--</option>
                                                                {attributes.map(attr => (
                                                                    <option key={attr._id} value={attr._id}>{attr.label}</option>
                                                                ))}
                                                            </Form.Select>
                                                        </InputGroup>
                                                    </Col>
                                                    <Col>
                                                        <Form.Control
                                                            placeholder="Price ₹"
                                                            type="number"
                                                            value={v.price}
                                                            onChange={(e) => updateVariation(idx, 'price', e.target.value)}
                                                        />
                                                    </Col>
                                                </Row>
                                                <div className="text-end mt-2">
                                                    <Button size="sm" variant="danger" onClick={() => removeVariation(idx)}>Remove</Button>
                                                </div>
                                            </div>
                                        ))}
                                        <Button size="sm" onClick={addVariation} style={{ backgroundColor: 'rgb(240, 33, 49)', border: 'none', }}>+ Add Variation</Button>
                                    </>
                                ) : (
                                    <>
                                        <h6>Combo Items</h6>
                                        {form.comboItems.map((item, idx) => (
                                            <div key={idx} className="mb-3 p-2 border rounded">
                                                <Row className="mb-2">
                                                    <Col><Form.Control
                                                        placeholder="Name"
                                                        value={item.name}
                                                        onChange={(e) => updateComboItem(idx, 'name', e.target.value)}
                                                    /></Col>
                                                    <Col>
                                                        <InputGroup>
                                                            <Form.Control
                                                                placeholder="Weight"
                                                                type="number"
                                                                value={item.weight}
                                                                onChange={(e) => updateComboItem(idx, 'weight', e.target.value)}
                                                            />
                                                            <Form.Select
                                                                value={item.weightUnit}
                                                                onChange={(e) => updateComboItem(idx, 'weightUnit', e.target.value)}
                                                            >
                                                                <option value="">--Unit--</option>
                                                                {attributes.map(attr => (
                                                                    <option key={attr._id} value={attr._id}>{attr.label}</option>
                                                                ))}
                                                            </Form.Select>
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                                <Form.Control
                                                    placeholder="Attributes (e.g. key:value)"
                                                    onBlur={(e) => {
                                                        const value = e.target.value;
                                                        const attrs = value.split(',').map(str => {
                                                            const [key, val] = str.split(':');
                                                            return { key: key?.trim(), value: val?.trim() };
                                                        });
                                                        updateComboItem(idx, 'attributes', attrs);
                                                    }}
                                                />
                                                <div className="text-end mt-2">
                                                    <Button size="sm" variant="danger" onClick={() => removeComboItem(idx)}>Remove</Button>
                                                </div>
                                            </div>
                                        ))}
                                        <Button size="sm" onClick={addComboItem} style={{ backgroundColor: 'rgb(240, 33, 49)', border: 'none', }}>+ Add Item</Button>
                                    </>
                                )}

                                {isComboCategory() && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price (₹)</Form.Label>
                                        <Form.Control
                                            name="price"
                                            type="number"
                                            value={form.price || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label>Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const data = new FormData();
                                            data.set('image', file);

                                            const res = await fetch('/api/upload', {
                                                method: 'POST',
                                                body: data,
                                            });

                                            const result = await res.json();
                                            if (result?.url) {
                                                setForm((prev) => ({ ...prev, image: result.url }));
                                            }
                                        }}
                                    />
                                </Form.Group>

                            </Col>

                            <Col md={6} className="text-center d-flex align-items-center justify-content-center">
                                {form.image ? (
                                    <img src={form.image} alt="Preview" style={{ maxHeight: 180, maxWidth: '100%' }} />
                                ) : (
                                    <img
                                        src="/assets/admin/product-placeholder.webp"
                                        alt="Preview"
                                        style={{ maxHeight: 180, maxWidth: '100%' }}
                                    />
                                )}
                            </Col>

                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button onClick={handleSave} style={{ backgroundColor: 'rgb(240, 33, 49)', border: 'none', }}>{editId ? 'Update' : 'Add Product'}</Button>
                    </Modal.Footer>
                </Modal>
            </DashboardLayout>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}