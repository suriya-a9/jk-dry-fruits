'use client';

import { Button } from 'react-bootstrap';
import { Typewriter } from 'react-simple-typewriter';
import "./Banner.css";

export default function HomeBanner() {
    return (
        <section className="home-banner">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className='home-banner-caption'>
                            <h1>
                                All types of{' '}<br />
                                <span style={{ color: '#F02131', backgroundColor: 'white' }}>
                                    <Typewriter
                                        words={['Dry Fruits', 'Nuts', 'Seeds', 'Berries', 'Dates', 'Almonds']}
                                        loop={0}
                                        cursor
                                        cursorStyle="_"
                                        typeSpeed={100}
                                        deleteSpeed={50}
                                        delaySpeed={1500}
                                    />
                                </span>{' '}<br />
                                Available Here
                            </h1>
                            <Button
                                variant="primary"
                                style={{ color: 'white', border: '1px solid #F02131', backgroundColor: '#F02131' }}
                            >
                                <a href='#oderProducts' style={{ textDecoration: 'none', color: 'white' }}>Order Now</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}