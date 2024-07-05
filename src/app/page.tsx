'use client'

import './globals.css'
import HeroSection from '@/components/Sections/Hero/Hero';
import ServicesSection from '@/components/Sections/Services/Services';
import AboutSection from '@/components/Sections/About/About';
import ContactSection from '@/components/Sections/Contact/Contact';


export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </>
  );

}


// bitcoin, ethereum, avalanche, polygon, 