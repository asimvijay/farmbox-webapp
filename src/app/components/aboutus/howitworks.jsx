"use client";

import Image from "next/image";
import { FaTruck, FaBoxOpen, FaLeaf, FaCalendarAlt } from "react-icons/fa";
import FarmDelivery from "../../../../assets/images/farmbox-delivery.jpg";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaCalendarAlt className="text-4xl text-green-600" />,
      title: "1. Choose Your Plan",
      description: "Select from our variety of farm-fresh produce boxes. Customize your delivery frequency to suit your needs - weekly, bi-weekly, or monthly."
    },
    {
      icon: <FaBoxOpen className="text-4xl text-green-600" />,
      title: "2. Get Your FarmBox",
      description: "We handpick the freshest seasonal produce from local farms and deliver it straight to your doorstep in eco-friendly packaging."
    },
    {
      icon: <FaLeaf className="text-4xl text-green-600" />,
      title: "3. Enjoy Freshness",
      description: "Discover new flavors and enjoy nutrient-rich fruits and vegetables at their peak freshness, just hours from harvest."
    },
    {
      icon: <FaTruck className="text-4xl text-green-600" />,
      title: "4. Flexible Delivery",
      description: "Change your delivery schedule, skip a week, or cancel anytime. We make it easy to fit FarmBox into your lifestyle."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
   
      
      {/* Hero Section */}
      <div className="relative bg-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How FarmBox Works</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Fresh, local produce delivered to your door - it's that simple. Discover how our farm-to-table service brings the best of the season to you.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="flex justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video/Image Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={FarmDelivery} // Replace with your actual image
                  alt="FarmBox delivery process"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Farm-to-Table Promise</h2>
              <p className="text-lg text-gray-600 mb-4">
                At FarmBox, we partner directly with local farmers to bring you the freshest seasonal produce. Our team personally selects each item to ensure only the highest quality makes it into your box.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We skip the grocery store middleman, which means you get farm-fresh produce at competitive prices while supporting local agriculture.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                Choose Your FarmBox
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "How often will I receive my FarmBox?",
                answer: "You can choose weekly, bi-weekly, or monthly deliveries. You can change your frequency or skip deliveries anytime through your account."
              },
              {
                question: "Can I customize what's in my box?",
                answer: "While our standard boxes are curated by season, we offer customization options for certain plans. You can also add specialty items to any delivery."
              },
              {
                question: "What if I'm not home for delivery?",
                answer: "Our boxes are designed to stay fresh for hours. We use insulated packaging to protect your produce until you can bring it inside."
              },
              {
                question: "Where does FarmBox deliver?",
                answer: "We currently serve the [Your Service Area] region. Check our delivery map for specific zip codes."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience FarmBox?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of happy customers enjoying fresh, local produce delivered to their door.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300">
              Get Started
            </button>
            <button className="border-2 border-white text-white hover:bg-green-600 font-bold py-3 px-8 rounded-lg transition duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}