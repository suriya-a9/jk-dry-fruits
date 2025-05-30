"use client";

import React, { useState, useEffect } from 'react';
import "./SaleMonth.css";

export default function SaleMonth() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2025-05-31T00:00:00");

    const updateTimer = () => {
      const now = new Date();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="sale-container">
        <div className="sale-image">
          <img src={'/assets/admin/grid-image-1.webp'} alt="Sale 1" />
          <div className="title-timer">
            <p>BEST DEALS</p>
            <h2>Sale of the Month</h2>
            <div className="timer">
              <span>{String(timeLeft.days).padStart(2, '0')}</span> :
              <span>{String(timeLeft.hours).padStart(2, '0')}</span> :
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span> :
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
            <div className="timer-labels">
              <span>days</span>
              <span>hours</span>
              <span>mins</span>
              <span>secs</span>
            </div>
          </div>
          <button className="shop-now">
            <a href='/categories' style={{ textDecoration: 'none', color: '#F02131' }}>Shop Now <span className="arrow">→</span></a>
          </button>
        </div>
        <div className="sale-image">
          <img src={'/assets/admin/grid-image-2.webp'} alt="Sale 2" />
          <button className="shop-now">
            <a href='/categories' style={{ textDecoration: 'none', color: '#F02131' }}>Shop Now <span className="arrow">→</span></a>
          </button>
        </div>
        <div className="sale-image">
          <img src={'/assets/admin/grid-image-3.webp'} alt="Sale 3" />
          <div className="title-timer">
            <p style={{ color: 'black' }}>SUMMER SALES</p>
            <h2 style={{ color: 'black', fontSize: '26px', fontWeight: 'bold' }}>100% FRESH FRUIT</h2>
            <h4 style={{ color: 'black', margin: '20px 0px', fontSize: '18px' }}>Up to <span style={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px', fontSize: '18px' }}>64% OFF</span></h4>
          </div>
          <button className="shop-now">
            <a href='/categories' style={{ textDecoration: 'none', color: '#F02131' }}>Shop Now <span className="arrow">→</span></a>
          </button>
        </div>
      </div>

      <style jsx>{`
        .sale-container {
          display: flex;
          width: 100%;
          gap: 10px;
          background-color: white;
          justify-content: space-between;
        }
        .sale-image {
          position: relative;
          width: 33.33%;  
        }
        .sale-image img {
          width: 100%;
          height: auto;
        }
        .title-timer {
          position: absolute;
          top: 8%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: white;
        }
        .title-timer h2 {
          font-size: 26px;
          font-weight: bold;
          margin: 0;
        }
        .title-timer p {
          font-size: 15px;
          letter-spacing: 1px;
          margin: 0;
        }
        .timer {
          display: flex;
          justify-content: center;
          margin-top: 10px;
          font-size: 24px;
          letter-spacing: 2px;
        }
        .timer span {
          margin: 0 5px;
          font-weight: bold;
        }
        .timer-labels {
          display: flex;
          justify-content: center;
          margin-top: 5px;
          font-size: 14px;
        }
        .timer-labels span {
          margin: 0 10px;
          font-weight: normal;
          color: white;
        }
        .shop-now {
          position: absolute;
          top: 30%;  
          left: 50%;
          transform: translateX(-50%);
          padding: 10px 20px;
          background-color: white;
          color: #EF2231;
          border: none;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: transform 0.3s ease; /* For smooth hover */
        }
        .shop-now .arrow {
          margin-left: 8px; /* Space between the text and arrow */
          transition: transform 0.3s ease; /* Arrow transition */
        }
        .shop-now:hover .arrow {
          transform: translateX(10px); /* Move the arrow smoothly to the right */
        }
        .shop-now:hover {
          background-color: white;
        }
      `}</style>
    </>
  );
}