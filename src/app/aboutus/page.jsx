'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AboutUs from '../components/aboutus/aboutus';
import HowItWorks from '../components/aboutus/howitworks';
import FarmersAndProducers from '../components/aboutus/farmers';
import FAQ from '../components/aboutus/faq';

const AboutUsContent = () => {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('about-us');

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const renderSection = () => {
    switch (activeSection) {
      case 'about-us':
        return <AboutUs />;
      case 'how-it-works':
        return <HowItWorks />;
      case 'farmers-producers':
        return <FarmersAndProducers />;
      case 'faqs':
        return <FAQ />;
      default:
        return <AboutUs />;
    }
  };

  return <div className="p-4">{renderSection()}</div>;
};

const AboutUsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutUsContent />
    </Suspense>
  );
};

export default AboutUsPage;
