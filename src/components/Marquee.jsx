'use client';

import Marquee from 'react-fast-marquee';

export default function HomeMarquee() {
    return (
        <div className="home-marquee" style={{ backgroundColor: '#F4ECE1', padding:'10px 10px' }}>
            <Marquee
                gradient={false}
                speed={50}
                style={{ color: '#EF2231', fontWeight: 'bold' }}
            >
                <img src="/assets/admin/marquee-icon.webp" alt="icon" style={{ marginRight: 10 }} />
                Free Delivery all Combo Offers &nbsp; | &nbsp;

                <img src="/assets/admin/marquee-icon.webp" alt="icon" style={{ margin: '0 10px' }} />
                100% Fresh Dry Fruits &nbsp; | &nbsp;

                <img src="/assets/admin/marquee-icon.webp" alt="icon" style={{ margin: '0 10px' }} />
                Big Discounts on Bulk Orders &nbsp; | &nbsp;

                <img src="/assets/admin/marquee-icon.webp" alt="icon" style={{ margin: '0 10px' }} />
                New Arrivals in Stock! &nbsp; | &nbsp;
                <img src="/assets/admin/marquee-icon.webp" alt="icon" style={{ marginRight: 10 }} />
                Free Delivery all Combo Offers &nbsp; | &nbsp;

                <img src="/assets/admin/marquee-icon.webp" alt="icon" style={{ margin: '0 10px' }} />
                100% Fresh Dry Fruits &nbsp; | &nbsp;

                <img src="/assets/admin/marquee-icon.webp" alt="icon" style={{ margin: '0 10px' }} />
                Big Discounts on Bulk Orders &nbsp; | &nbsp;

                <img src="/assets/admin/marquee-icon.webp" alt="icon" style={{ margin: '0 10px' }} />
                New Arrivals in Stock! &nbsp; | &nbsp;
                <img src="/assets/admin/marquee-icon.webp" alt="icon" style={{ marginRight: 10 }} />
                Free Delivery all Combo Offers &nbsp; | &nbsp;

                <img src="/assets/admin/marquee-icon.webp" alt="icon" style={{ margin: '0 10px' }} />
                100% Fresh Dry Fruits &nbsp; | &nbsp;

                <img src="/assets/admin/marquee-icon.webp" alt="icon" style={{ margin: '0 10px' }} />
                Big Discounts on Bulk Orders &nbsp; | &nbsp;

                <img src="/assets/admin/marquee-icon.webp" alt="icon" style={{ margin: '0 10px' }} />
                New Arrivals in Stock! &nbsp; | &nbsp;
            </Marquee>
        </div>
    );
}
