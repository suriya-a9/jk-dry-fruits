'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputGroup, FormControl } from 'react-bootstrap';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
} from 'react-bootstrap';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            toast.error(res.error);
        } else {
            toast.success('Logged in successfully');
            router.push('/admin/dashboard');
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
                            <img src={"/assets/admin/admin-logo.webp"} alt='logo' />
                            <h2 className="mb-4 text-center" style={{ fontSize: '20px', padding: '20px 0px' }}>Login into your account</h2>
                            <Form onSubmit={handleLogin} style={{ width: '100%', padding: '25px 0px' }}>
                                <Form.Group className="mb-3" controlId="formEmail" style={{ paddingTop: '10px' }}>
                                    <Form.Label style={{ fontSize: '15px' }}>Email Id:</Form.Label>
                                    <InputGroup>
                                        <FormControl
                                            type="email"
                                            placeholder="info@dryfruits.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            style={{ backgroundColor: "#EEEEEE", height: '50px' }}
                                        />
                                        <InputGroup.Text style={{ padding: '0' }}>
                                            <img
                                                src={"/assets/admin/mail_icon.webp"}
                                                alt="Email"
                                                style={{ width: '50px', height: '50px' }}
                                            />
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formPassword" style={{ paddingTop: '10px' }}>
                                    <Form.Label style={{ fontSize: '15px' }}>Password</Form.Label>
                                    <InputGroup>
                                        <FormControl
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            style={{ backgroundColor: "#EEEEEE", height: '50px' }}
                                        />
                                        <InputGroup.Text style={{ padding: '0' }}>
                                            <img
                                                src={"/assets/admin/mail_icon.webp"}
                                                alt="Password"
                                                style={{ width: '50px', height: '50px' }}
                                            />
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <div className="text-end">
                                    <a href="/admin/forgot-password" className="text-primary" style={{ fontSize: '0.9rem' }}>
                                        Forgot Password?
                                    </a>
                                </div>

                                <Button type="submit" className="w-100" style={{ backgroundColor: '#AE0210', border: '#AE0210', marginTop: '20px', padding: '10px 0px', boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
                                    Login
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}