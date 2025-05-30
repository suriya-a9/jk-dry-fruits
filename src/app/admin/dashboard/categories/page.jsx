'use client'

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Spinner } from 'react-bootstrap';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        const res = await fetch('/api/admin/category');
        const data = await res.json();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async () => {
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/admin/category/${editId}` : '/api/admin/category';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });

        if (res.ok) {
            setModalShow(false);
            setName('');
            setEditId(null);
            fetchCategories();
        }
    };

    const handleEdit = (category) => {
        setEditId(category._id);
        setName(category.name);
        setModalShow(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            await fetch(`/api/admin/category/${id}`, { method: 'DELETE' });
            fetchCategories();
        }
    };

    // if (loading) return <Spinner animation="border" />;

    return (
        <>
            <DashboardLayout>
                <Row className="mb-3">
                    <Col><h4>Categories</h4></Col>
                    <Col className="text-end">
                        <Button onClick={() => { setModalShow(true); setEditId(null); setName(''); }} style={{ backgroundColor: 'rgb(240, 33, 49)', border: 'none', }}>+ Add Category</Button>
                    </Col>
                </Row>

                <Table striped bordered hover>
                    <thead>
                        <tr><th>#</th><th>Name</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, i) => (
                            <tr key={cat._id}>
                                <td>{i + 1}</td>
                                <td>{cat.name}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(cat)}>Edit</Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(cat._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={modalShow} onHide={() => setModalShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editId ? 'Edit Category' : 'Add Category'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter category name"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button onClick={handleSave} style={{ backgroundColor: 'rgb(240, 33, 49)', border: 'none', }}>{editId ? 'Update' : 'Add'}</Button>
                    </Modal.Footer>
                </Modal>
            </DashboardLayout>
        </>
    );
}