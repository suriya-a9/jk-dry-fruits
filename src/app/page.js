"use client"

import HomeBanner from "@/components/Banner";
import Cta from "@/components/Cta";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HomeCategory from "@/components/HomeCategory";
import HomeCombo from "@/components/HomeCombo";
import HomeMarquee from "@/components/Marquee";
import SaleMonth from "@/components/SaleMonth";
import Image from "next/image";
import Categories from "./categories/page";

export default function Home() {
  return (
    <>
      <Header />
      <HomeBanner />
      <HomeMarquee />
      <HomeCombo />
      <HomeCategory />
      <FeaturedProducts />
      <SaleMonth />
      <Cta />
      <Footer />
    </>
  );
}