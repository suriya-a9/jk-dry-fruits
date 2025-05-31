'use client';

import Cta from '@/components/Cta';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { Card, Button, Table, Modal, Form } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

function CheckoutStep({ subtotal, deliveryCharge, totalAmount, onBack, onPlaceOrder, discountOnOrder }) {
    const [showQR, setShowQR] = useState(false);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [doorNo, setDoorNo] = useState('');
    const [addressLine, setAddressLine] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [country, setCountry] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [addingNewAddress, setAddingNewAddress] = useState(false);
    const [area, setArea] = useState('');
    const [customArea, setCustomArea] = useState('');
    const [offers, setOffers] = useState([]);
    const freeDeliveryAreas = ['Anna Nagar', 'Velachery', 'T Nagar', 'Adyar', 'Kodambakkam'];

    useEffect(() => {
        async function fetchAddresses() {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch('/api/addresses', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setAddresses(data.addresses);
            }
        }

        fetchAddresses();
    }, []);
    useEffect(() => {
        async function fetchOffers() {
            try {
                const res = await fetch('/api/admin/offer');
                const data = await res.json();
                if (res.ok) {
                    setOffers(data.offers);
                }
            } catch (err) {
                console.error('Failed to fetch offers:', err);
            }
        }

        fetchOffers();
    }, []);

    const handlePayNow = () => {
        if (!fullName || !doorNo || !addressLine || !city || !state || !pincode || !country) {
            toast.info('Please fill Address details before proceeding to payment.');
            return;
        }
        setShowQR(true);
    };

    const handleConfirmPayment = async () => {
        if (!fullName || !doorNo || !addressLine || !city || !state || !pincode || !country || !transactionId || !area) {
            toast.info('Please fill all billing details and transaction ID.');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            toast.info('Please login to continue.');
            return;
        }
        const finalAmount = computeFinalAmount();

        // const offers = JSON.parse(localStorage.getItem('offers') || '{}');
        // const isDeliveryFree = offers.delivery_charge === false;

        const selectedArea = area === 'Other' ? customArea : area;

        // if (!isDeliveryFree && area === 'Other' && customArea.trim() !== '') {
        //     finalAmount += 20;
        // }

        const orderPayload = selectedAddressId ? {
            address_id: selectedAddressId,
            total_amount: finalAmount,
            upi_transaction_id: transactionId
        } : {
            full_name: fullName,
            door_no: doorNo,
            address_line: addressLine,
            area: selectedArea,
            city,
            state,
            pincode,
            country,
            total_amount: finalAmount,
            upi_transaction_id: transactionId
        };

        try {
            const res = await fetch('/api/place-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(orderPayload)
            });

            const result = await res.json();
            if (res.ok && result.success) {
                toast.success('Order placed successfully!');
                setShowQR(false);
                onPlaceOrder();
            } else {
                toast.error('Failed to place order.');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred.');
        }
    };

    const computeFinalAmount = () => {
        let amount = totalAmount;

        const deliveryOffer = offers.find(
            offer => offer.type === 'delivery_charge' && offer.isActive
        );

        const isDeliveryFree = Boolean(deliveryOffer);

        if (!isDeliveryFree && area === 'Other' && customArea.trim() !== '') {
            amount += 20;
        }

        return amount;
    };

    const finalAmount = computeFinalAmount();
    const computeDeliveryCharge = () => {
        const deliveryOffer = offers.find(
            offer => offer.type === 'delivery_charge' && offer.isActive
        );

        const isDeliveryFree = Boolean(deliveryOffer);

        if (!isDeliveryFree && area === 'Other' && customArea.trim() !== '') {
            return deliveryCharge + 20;
        }

        return deliveryCharge;
    };

    const adjustedDeliveryCharge = computeDeliveryCharge();
    const adjustedTotalAmount = subtotal + adjustedDeliveryCharge;


    const upiId = '6384820056@kotak811';
    const upiAmount = finalAmount.toFixed(2);
    // const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(fullName)}&am=${upiAmount}&cu=INR`;
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(fullName || 'Recipient')}&am=${upiAmount}&cu=INR&tn=Order%20Payment`;
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => toast.success('UPI Id copied'))
            .catch((err) => console.error('Failed to copy text: ', err));
    };
    return (
        <>
            <div className="row">
                <div className="col-md-8">
                    <Card className='p-3 mb-3'>
                        <h5 className='text-danger'>Select Address</h5>
                        {addresses.length === 0 ? (
                            <p>No saved addresses. Please add a new one below.</p>
                        ) : (
                            <div>
                                {addresses.map(addr => (
                                    <div key={addr._id} className='mb-2'>
                                        <Form.Check
                                            type="radio"
                                            id={`addr-${addr._id}`}
                                            label={`${addr.full_name}, ${addr.door_no}, ${addr.address_line}, ${addr.city}, ${addr.state} - ${addr.pincode}, ${addr.country}`}
                                            name="selectedAddress"
                                            value={addr._id}
                                            checked={selectedAddressId === addr._id}
                                            onChange={() => {
                                                setSelectedAddressId(addr._id);
                                                setFullName(addr.full_name);
                                                setDoorNo(addr.door_no);
                                                setAddressLine(addr.address_line);
                                                setCity(addr.city);
                                                setState(addr.state);
                                                setPincode(addr.pincode);
                                                setCountry(addr.country);
                                                setArea(freeDeliveryAreas.includes(addr.area) ? addr.area : 'Other');
                                                setCustomArea(freeDeliveryAreas.includes(addr.area) ? '' : addr.area || '');
                                                setAddingNewAddress(false);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <Button variant='link' size='sm' onClick={() => setAddingNewAddress(!addingNewAddress)}>
                            {addingNewAddress ? 'Cancel Add New Address' : '➕ Add New Address'}
                        </Button>
                    </Card>
                    {addingNewAddress && (
                        <Card className='p-3'>
                            <h5 className='text-danger'>Billing Details</h5>
                            <Form>
                                <Form.Group className="mb-2">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder='Enter your name' />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Door No</Form.Label>
                                    <Form.Control value={doorNo} onChange={(e) => setDoorNo(e.target.value)} placeholder='Flat / Door No' />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Address Line</Form.Label>
                                    <Form.Control value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder='Street / Locality' />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Area</Form.Label>
                                    <Form.Select
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                    >
                                        <option value="">-- Select Area --</option>
                                        <option value="Anna Nagar">Anna Nagar</option>
                                        <option value="Velachery">Velachery</option>
                                        <option value="T Nagar">T Nagar</option>
                                        <option value="Adyar">Adyar</option>
                                        <option value="Kodambakkam">Kodambakkam</option>
                                        <option value="Other">Other (Enter below)</option>
                                    </Form.Select>
                                </Form.Group>

                                {area === 'Other' && (
                                    <Form.Group className="mb-2">
                                        <Form.Label>Custom Area</Form.Label>
                                        <Form.Control
                                            value={customArea}
                                            onChange={(e) => setCustomArea(e.target.value)}
                                            placeholder="Enter your area"
                                        />
                                    </Form.Group>
                                )}
                                <Form.Group className="mb-2">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control value={city} onChange={(e) => setCity(e.target.value)} placeholder='City' />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control value={state} onChange={(e) => setState(e.target.value)} placeholder='State' />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Pincode</Form.Label>
                                    <Form.Control value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder='Pincode' />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control value={country} onChange={(e) => setCountry(e.target.value)} placeholder='Country' />
                                </Form.Group>
                            </Form>
                        </Card>
                    )}
                </div>

                <div className="col-md-4">
                    <Card border="light" className='p-3'>
                        <h5 className='text-danger mb-3'>Cart Totals</h5>
                        <Table borderless size="sm">
                            <tbody>
                                <tr><td>Sub Total</td><td className='text-end text-danger'>₹{subtotal.toFixed(2)}</td></tr>
                                {discountOnOrder > 0 && (
                                    <tr><td>Order Discount</td><td className='text-end text-success'>− ₹{discountOnOrder.toFixed(2)}</td></tr>
                                )}
                                <tr><td>Shipping Charge</td><td className='text-end'>₹{adjustedDeliveryCharge.toFixed(2)}</td></tr>
                                <tr><td><strong>Total</strong></td><td className='text-end text-danger'><strong>₹{finalAmount.toFixed(2)}</strong></td></tr>
                            </tbody>
                        </Table>

                        <Button variant='secondary' className='w-100 mb-2' onClick={onBack}>← Back to Cart</Button>
                        <Button variant='danger' className='w-100' onClick={handlePayNow}>Pay Now</Button>
                    </Card>
                </div>
            </div>

            <Modal show={showQR} onHide={() => setShowQR(false)} centered>
                {/* <Modal.Header closeButton>
                    <Modal.Title>Scan & Pay via UPI</Modal.Title>
                </Modal.Header> */}
                <Modal.Body className='text-center' style={{ placeItems: 'center' }}>
                    <p>Scan the QR code below to pay ₹{upiAmount}</p>
                    <p>
                        or Pay to this UPI ID <strong style={{ cursor: 'pointer' }} onClick={() => handleCopy(upiId)}>{upiId}&nbsp;</strong><span style={{ cursor: 'pointer' }} onClick={() => handleCopy(upiId)}>(click to copy!)</span>
                    </p>
                    <QRCodeCanvas value={upiUrl} />
                    <Form.Group className="mt-3">
                        <Form.Label>Enter UPI Transaction ID</Form.Label>
                        <Form.Control
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder='Enter Transaction ID after payment'
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowQR(false)}>Cancel</Button>
                    <Button variant='danger' onClick={handleConfirmPayment}>Confirm Payment</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-right" />
        </>
    );
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [step, setStep] = useState(1);
    const [offers, setOffers] = useState([]);
    const [deliveryRules, setDeliveryRules] = useState([]);

    useEffect(() => {
        async function fetchCartItems() {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch('/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setCartItems(data.cart || []);
        }

        fetchCartItems();
    }, []);
    useEffect(() => {
        async function fetchOffers() {
            const res = await fetch('/api/admin/offer');
            const data = await res.json();
            if (res.ok) {
                setOffers(data.offers || []);
            }
        }

        fetchOffers();
    }, []);
    useEffect(() => {
        async function fetchDeliveryRules() {
            const res = await fetch('/api/admin/delivery-charges');
            const data = await res.json();
            if (res.ok) setDeliveryRules(data);
        }
        fetchDeliveryRules();
    }, []);

    const handleQuantityChange = async (cartItemId, operation) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const currentItem = cartItems.find(item => item.cartItemId === cartItemId);
        const updatedQuantity = operation === 'increase' ? currentItem.quantity + 1 : currentItem.quantity - 1;

        if (updatedQuantity < 1) return;

        const res = await fetch('/api/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cartItemId, quantity: updatedQuantity })
        });

        if (res.ok) {
            setCartItems(cartItems.map(item =>
                item.cartItemId === cartItemId ? { ...item, quantity: updatedQuantity } : item
            ));
        } else {
            toast.error('Failed to update quantity.');
        }
    };
    function getDeliveryChargeByWeight(weightInGrams) {
        if (!deliveryRules.length) return 0;

        for (const rule of deliveryRules) {
            if (weightInGrams <= rule.max) {
                return rule.charge;
            }
        }
        return 0;
    }


    const calculateTotalWeight = () => {
        return cartItems.reduce((total, item) => {
            let weight = 0;

            if (item.variation) {
                weight = item.variation.weight || 0;

                if (item.variation.weightUnit === 'gm') {
                    weight = weight / 1000;
                }

                weight *= item.quantity;
            }

            if (Array.isArray(item.product.comboItems)) {
                const comboWeight = item.product.comboItems.reduce((sum, ci) => {
                    let comboItemWeight = ci.weight || 0;
                    if (ci.weightUnit === 'gm') {
                        comboItemWeight = comboItemWeight / 1000;
                    }
                    return sum + comboItemWeight;
                }, 0);
                weight += comboWeight * item.quantity;
            }

            return total + weight;
        }, 0);
    };

    function getTotalWeight(cartItems) {
        let totalWeight = 0;

        for (const item of cartItems) {
            const quantity = item.quantity;

            if (item.variation && item.variation.weight) {
                let weight = item.variation.weight;
                const unit = (item.variation.weightUnit?.label || item.variation.weightUnit || 'gm').toLowerCase();

                if (unit === 'kg') weight *= 1000;
                totalWeight += weight * quantity;
            }

            if (item.variation === null && Array.isArray(item.product.comboItems)) {
                for (const combo of item.product.comboItems) {
                    let weight = combo.weight;
                    const unit = (combo.weightUnit?.label || combo.weightUnit || 'gm').toLowerCase();

                    if (unit === 'kg') weight *= 1000;
                    totalWeight += weight * quantity;
                }
            }
        }

        return totalWeight;
    }

    function stripTime(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    function applyOffers(subtotal, baseDeliveryCharge, cartWeight) {
        const today = stripTime(new Date());
        let discountOnOrder = 0;
        let deliveryCharge = baseDeliveryCharge;
        let freeDeliveryApplied = false;

        for (const offer of offers) {
            const startDate = stripTime(new Date(offer.startDate));
            const endDate = stripTime(new Date(offer.endDate));

            const isActive = (offer.isActive === true || offer.isActive === 'true') &&
                startDate <= today &&
                endDate >= today;

            if (!isActive) continue;
            console.log("inactive offers", isActive);
            if (offer.type === 'order_percentage' && offer.percentage) {
                discountOnOrder += (subtotal * offer.percentage) / 100;
            }

            if (offer.type === 'delivery_charge') {
                if (!offer.minAmount || subtotal >= offer.minAmount) {
                    if (!freeDeliveryApplied) {
                        deliveryCharge = 0;
                        freeDeliveryApplied = true;
                    }
                }
            }
        }

        console.log("Cart Weight (grams):", cartWeight);
        console.log("Delivery Charge:", deliveryCharge);

        if (!freeDeliveryApplied) {
            deliveryCharge = getDeliveryChargeByWeight(cartWeight);
        }

        const total = subtotal - discountOnOrder + deliveryCharge;
        return { discountOnOrder, deliveryCharge, total };
    }



    const handleDeleteFromCart = async (cartItemId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cartItemId })
        });

        if (res.ok) {
            setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
            toast.success('Product removed.');
        } else {
            toast.error('Failed to remove item from cart.');
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const unitPrice = item.variation
                ? item.variation.price
                : item.variation === null ? item.product.price : 0;

            return total + (unitPrice * item.quantity);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const baseDeliveryCharge = 20;
    const cartWeight = getTotalWeight(cartItems);
    const { discountOnOrder, deliveryCharge, total } = applyOffers(subtotal, baseDeliveryCharge, cartWeight);



    const totalAmount = total;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <Header />
            <section className='cartpage bg-white' style={{ color: 'black' }}>
                <div className="container">
                    <h2>Your Shopping Cart</h2>
                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <StepLabel number={1} label="Shopping Cart" active={step === 1} />
                        <Arrow />
                        <StepLabel number={2} label="Checkout" active={step === 2} />
                        <Arrow />
                        <StepLabel number={3} label="Order Complete" active={step === 3} />
                    </div>
                    {step === 1 && (
                        <>
                            {
                                cartItems.length === 0 ? (
                                    <p>Your cart is empty.</p>
                                ) : (
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div style={{ overflowX: 'auto' }}>
                                                <Table responsive style={{ border: '1px solid #AFAFAF', minWidth: '600px' }}>
                                                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                                                        <tr className='text-danger'>
                                                            <th>Product</th>
                                                            <th>Details</th>
                                                            <th>Price</th>
                                                            <th>Quantity</th>
                                                            <th>Subtotal</th>
                                                            <th> </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cartItems.map(item => {
                                                            const isCombo = item.variation === null;
                                                            const detailsLabel = item.variation
                                                                ? `${item.variation.weight}${item.variation.weightUnit}`
                                                                : '0';

                                                            const unitPrice = item.variation
                                                                ? item.variation.price
                                                                : item.product.price;

                                                            const rowSubtotal = unitPrice * item.quantity;

                                                            return (
                                                                <tr key={item.cartItemId}>
                                                                    <td className="align-middle">
                                                                        <img
                                                                            src={item.product.image}
                                                                            alt={item.product.name}
                                                                            width="60"
                                                                            height="60"
                                                                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                                                                        />
                                                                    </td>
                                                                    <td className="align-middle">{item.product.name}</td>
                                                                    <td className="align-middle">₹{unitPrice}</td>
                                                                    <td className="align-middle">
                                                                        <Button
                                                                            variant="outline-secondary"
                                                                            size="sm"
                                                                            onClick={() => handleQuantityChange(item.cartItemId, 'decrease')}
                                                                            style={{ border: '1px solid #F02131' }}
                                                                        >
                                                                            -
                                                                        </Button>
                                                                        <span className="mx-2">{item.quantity}</span>
                                                                        <Button
                                                                            variant="outline-secondary"
                                                                            size="sm"
                                                                            onClick={() => handleQuantityChange(item.cartItemId, 'increase')}
                                                                            style={{ border: '1px solid #F02131' }}
                                                                        >
                                                                            +
                                                                        </Button>
                                                                    </td>
                                                                    <td className="align-middle">₹{rowSubtotal}</td>
                                                                    <td className="align-middle" style={{ width: '40px' }}>
                                                                        <Button
                                                                            variant="link"
                                                                            onClick={() => handleDeleteFromCart(item.cartItemId)}
                                                                            className='p-0 text-danger'
                                                                        >
                                                                            <FaTrashAlt />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </div>

                                        </div>

                                        <div className="col-md-4">
                                            <Card border="light" className='p-3'>
                                                <h5 className='text-danger mb-3'>Cart Totals</h5>
                                                <Table borderless size="sm">
                                                    <tbody>
                                                        <tr><td>Sub Total</td><td className='text-end'>₹{subtotal.toFixed(2)}</td></tr>
                                                        {/* {discountOnOrder > 0 && (
                                                            <tr><td>Order Discount</td><td className='text-end text-success'>− ₹{discountOnOrder.toFixed(2)}</td></tr>
                                                        )} */}
                                                        {/* <tr><td>Delivery Charge</td><td className='text-end'>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}</td></tr> */}
                                                        {/* <tr><td><strong>Total</strong></td><td className='text-end text-danger'><strong>₹{totalAmount.toFixed(2)}</strong></td></tr> */}
                                                        <tr><td><strong>Total</strong></td><td className='text-end text-danger'><strong>₹{subtotal.toFixed(2)}</strong></td></tr>

                                                    </tbody>
                                                </Table>
                                                <Button variant="danger" className="w-100 mt-2" onClick={() => setStep(2)}>
                                                    Proceed To Checkout
                                                </Button>
                                            </Card>
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    )}
                    {step === 2 && (
                        <CheckoutStep
                            subtotal={subtotal}
                            deliveryCharge={deliveryCharge}
                            totalAmount={totalAmount}
                            discountOnOrder={discountOnOrder}
                            onBack={() => setStep(1)}
                            onPlaceOrder={() => setStep(3)}
                        />
                    )}
                    {step === 3 && (
                        <OrderCompleteStep />
                    )}


                </div>
            </section>
            <Cta />
            <Footer />
            <ToastContainer position="top-right" />
        </>
    );
}

function StepLabel({ number, label, active }) {
    return (
        <div className={`px-3 text-center ${active ? 'text-danger fw-bold' : ''}`}>
            {label}
        </div>
    );
}

function Arrow() {
    return <span className="mx-2 text-muted">→</span>;
}

function OrderCompleteStep() {
    return (
        <Card className='text-center p-5'>
            <h3 className='text-success'>🎉 Order Placed Successfully!</h3>
            <p>Thank you for your purchase. Your order is on its way.</p>
            {/* <Button variant='danger' href='/'>Return Home</Button> */}
            <a href='/' style={{ textDecoration: 'none', color: '#F02131' }}>Continue Shopping {">"}</a>
        </Card>
    );
}