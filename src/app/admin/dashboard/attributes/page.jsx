'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Row, Col, Spinner
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function AttributesPage() {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ label: '' });
    const [editId, setEditId] = useState(null);

    const fetchAttributes = async () => {
        const res = await fetch('/api/admin/weight-attribute');
        const data = await res.json();
        setAttributes(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAttributes();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/admin/weight-attribute/${editId}` : '/api/admin/weight-attribute';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const result = await res.json();

        if (res.ok) {
            toast.success(result.message || 'Saved successfully');
            fetchAttributes();
            setShowModal(false);
            setEditId(null);
            setForm({ label: '' });
        } else {
            toast.error(result.error || 'Something went wrong');
        }
    };

    const handleEdit = (attr) => {
        setEditId(attr._id);
        setForm({ label: attr.label });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            const res = await fetch(`/api/admin/weight-attribute/${id}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (res.ok) {
                toast.success(result.message || 'Deleted successfully');
                fetchAttributes();
            } else {
                toast.error(result.error || 'Something went wrong');
            }
        }
    };

    // if (loading) return <Spinner animation="border" />;

    return (
        <>
            <DashboardLayout>
                <Row className="mb-3">
                    <Col><h4>Weight Attributes</h4></Col>
                    <Col className="text-end">
                        <Button onClick={() => {
                            setShowModal(true);
                            setEditId(null);
                            setForm({ label: '' });
                        }} style={{ backgroundColor: 'rgb(240, 33, 49)', border: 'none', }}>+ Add Attribute</Button>
                    </Col>
                </Row>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Label</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attributes.map((attr, i) => (
                            <tr key={attr._id}>
                                <td>{i + 1}</td>
                                <td>{attr.label}</td>
                                <td>
                                    <Button size="sm" variant="warning" onClick={() => handleEdit(attr)}>Edit</Button>{' '}
                                    <Button size="sm" variant="danger" onClick={() => handleDelete(attr._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editId ? 'Edit Attribute' : 'Add Attribute'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Label</Form.Label>
                            <Form.Control
                                name="label"
                                value={form.label}
                                onChange={handleChange}
                                placeholder="e.g., kg, gm, g"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button onClick={handleSave} style={{ backgroundColor: 'rgb(240, 33, 49)', border: 'none', }}>{editId ? 'Update' : 'Save'}</Button>
                    </Modal.Footer>
                </Modal>
            </DashboardLayout>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}