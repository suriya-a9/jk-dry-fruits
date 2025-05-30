'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    InputGroup,
} from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const res = await fetch('/api/admin/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword }),
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message || 'Something went wrong');
        } else {
            toast.success('Password updated! Redirecting...');
            setTimeout(() => {
                router.push('/admin/login');
            }, 2000);
        }
    };

    return (
        <Container fluid className="vh-100">
            <Row className="h-100">
                <Col md={8} className="text-white d-flex align-items-center" style={{ padding: '0px' }}>
                    <div className="text-center" style={{ width: '100%' }}>
                        <img src={"/assets/admin/login-vector.webp"} alt='background' style={{ position: 'absolute' }} />
                        <img src={"/assets/admin/login-background.webp"} alt='background' style={{ width: '100%', height: '45pc', objectFit: 'cover' }} />
                    </div>
                </Col>
                <Col md={4} className="bg-white d-flex align-items-center" style={{ padding: '0px' }}>
                    <Card style={{ width: '100%', border: 'none' }} className="">
                        <Card.Body className='d-flex align-items-center' style={{ flexDirection: 'column' }}>
                            <h3 className="text-center mb-4" style={{ fontSize: '20px', padding: '20px 0px' }}>Reset Admin Password</h3>
                            <Form onSubmit={handleSubmit} style={{ width: '100%', padding: '25px 0px' }}>
                                <Form.Group className="mb-3" style={{ paddingTop: '10px' }}>
                                    <Form.Label style={{ fontSize: '15px' }}>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ backgroundColor: "#EEEEEE", height: '50px' }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" style={{ paddingTop: '10px' }}>
                                    <Form.Label style={{ fontSize: '15px' }}>New Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            style={{
                                                backgroundColor: "#EEEEEE",
                                                height: '50px',
                                                borderRight: 'none',
                                            }}
                                        />
                                        {/* <InputGroup.Text
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: '#EEEEEE',
                                                borderLeft: 'none',
                                            }}
                                        >
                                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                        </InputGroup.Text> */}
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-4" style={{ paddingTop: '10px' }}>
                                    <Form.Label style={{ fontSize: '15px' }}>Confirm New Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            style={{
                                                backgroundColor: "#EEEEEE",
                                                height: '50px',
                                                borderRight: 'none',
                                            }}
                                        />
                                        {/* <InputGroup.Text
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: '#EEEEEE',
                                                borderLeft: 'none',
                                            }}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </InputGroup.Text> */}
                                    </InputGroup>
                                </Form.Group>


                                <Button type="submit" variant="primary" className="w-100" style={{ backgroundColor: '#AE0210', border: '#AE0210', marginTop: '20px', padding: '10px 0px', boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
                                    Update Password
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}