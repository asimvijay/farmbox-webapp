// app/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import heroImage from '../../assets/images/hero.webp';
import boxImage from '@/public/Farmbox1.jpg';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendar, FaLeaf, FaTruck } from 'react-icons/fa';

export default function LandingPage() {
  const [email, setEmail] = useState('');

  // Add database initialization effect
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const response = await fetch('/api/auth/dbschema');
        const data = await response.json();
        console.log('Database initialized:', data);
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    initializeDatabase();
  }, []);

  const features = [
    {
      icon: <FaLeaf className="text-4xl text-green-600" />,
      title: "Farm Fresh",
      description: "Harvested at peak ripeness and delivered to your door"
    },
    {
      icon: <FaTruck className="text-4xl text-green-600" />,
      title: "Weekly Delivery",
      description: "Flexible schedules that fit your lifestyle"
    },
    {
      icon: <FaCalendar className="text-4xl text-green-600" />,
      title: "Seasonal Variety",
      description: "New selections every week based on what's in season"
    }
  ];

  const testimonials = [
    {
      quote: "FarmBox has transformed how my family eats. The quality is unmatched!",
      author: "Sarah K."
    },
    {
      quote: "I love knowing exactly where my food comes from and supporting local farmers.",
      author: "Michael T."
    },
    {
      quote: "The convenience of fresh produce delivered weekly has saved me so much time.",
      author: "Jessica L."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen max-h-[800px]">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <Image
          src={heroImage}
          alt="Fresh organic produce"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 h-full flex flex-col justify-center px-6 lg:px-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Farm Fresh, Delivered
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              Get the best local, organic produce delivered weekly to your doorstep
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
              onClick={() => window.location.href = '/farmboxes'}
              className="bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer py-3 px-8 rounded-lg transition duration-300 flex items-center">
                Get Started <FaArrowRight className="ml-2" />
              </button>
              <button className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300">
                How It Works
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 lg:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FarmBox
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We connect you directly with local farmers for the freshest seasonal produce
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-black text-center mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <Image
                src={boxImage}
                alt="FarmBox produce box"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Simple as 1-2-3
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-lg">Choose Your Plan</h3>
                    <p className="text-gray-600">Select from our variety of farm-fresh produce boxes</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-lg">Customize Your Box</h3>
                    <p className="text-gray-600">Add your favorites or let us surprise you with seasonal picks</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-lg">Enjoy Freshness</h3>
                    <p className="text-gray-600">Receive your delivery and enjoy farm-to-table quality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 lg:px-16 bg-green-700 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Our Members Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 p-8 rounded-xl backdrop-blur-sm"
              >
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <p className="font-medium">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 lg:px-16">
        <div className="max-w-4xl mx-auto bg-green-50 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Eat Fresh?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join FarmBox today and experience the difference fresh, local produce makes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
              Get Started
            </button>
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 px-8 rounded-lg transition duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}