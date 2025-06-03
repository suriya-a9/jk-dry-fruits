"use client";

import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="bg-[#B80F0A] text-white pt-5">
            <div className="container mx-auto px-4 grid md:grid-cols-6 gap-8 py-6">
                <div className="md:col-span-2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '15%' }}>
                    <p className="mb-4">
                        Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        <span className="bg-[#D2B87A] text-black px-2 py-1 rounded text-sm">+91 8667520327</span>
                        <span>or</span>
                        <span className="bg-[#D2B87A] text-black px-2 py-1 rounded text-sm">Proxy@gmail.com</span>
                    </div>
                </div>

                <div>
                    <h5 className="font-semibold mb-2">My Account</h5>
                    <ul className="space-y-1 text-sm text-white/90 p-0">
                        <li>My Account</li>
                        <li>Order History</li>
                        <li>Shopping Cart</li>
                        <li>Wishlist</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold mb-2">Proxy</h5>
                    <ul className="space-y-1 text-sm text-white/90 p-0">
                        <li>About</li>
                        <li>Shop</li>
                        <li>Product</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold mb-2">Categories</h5>
                    <ul className="space-y-1 text-sm text-white/90 p-0">
                        <li>Nuts & Dry Fruits</li>
                        <li>Hair Oil</li>
                        <li>Medicines</li>
                        <li>Beauty & Health</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold mb-2">Contact Info</h5>
                    <ul className="space-y-1 text-sm text-white/90 p-0">
                        <li>Number</li>
                        <li>Mail</li>
                        <li>Address</li>
                    </ul>
                </div>
            </div>

            <div className="container">
                <div className="bg-[#F4ECE1] py-3 flex justify-center gap-6">
                    <FaFacebook size={30} className="text-[#B80F0A] text-xl cursor-pointer" />
                    <IoLogoWhatsapp size={30} className="text-[#B80F0A] text-xl cursor-pointer" />
                    <FaInstagramSquare size={30} className="text-[#B80F0A] text-xl cursor-pointer" />
                </div>
            </div>
        </footer>
    );
}