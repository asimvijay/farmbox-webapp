"use client";

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "How often will I receive my FarmBox?",
      answer: "You can choose weekly, bi-weekly, or monthly deliveries. You can change your frequency or skip deliveries anytime through your account dashboard."
    },
    {
      question: "Can I customize what's in my box?",
      answer: "Yes! While our standard boxes are curated by season, we offer customization options for most plans. You can also add specialty items to any delivery."
    },
    {
      question: "What if I'm not home for delivery?",
      answer: "Our boxes are designed to stay fresh for hours. We use insulated packaging with ice packs when needed. You'll receive delivery notifications so you can plan accordingly."
    },
    {
      question: "Where does FarmBox currently deliver?",
      answer: "We currently serve urban and suburban areas within California. We're expanding to new regions regularly - check our delivery map for the most current service areas."
    },
    {
      question: "How do you select your farm partners?",
      answer: "We work exclusively with farms that meet our strict sustainability and ethical practice standards. All partners are visited by our team and must pass rigorous quality checks."
    },
    {
      question: "What's your cancellation policy?",
      answer: "You can cancel anytime before your next billing cycle. We don't believe in contracts or commitments - just fresh food when you want it."
    },
    {
      question: "Do you offer gift subscriptions?",
      answer: "Yes! FarmBox makes a wonderful gift. You can purchase gift subscriptions for 3, 6, or 12 months. Recipients can customize their boxes just like regular members."
    },
    {
      question: "How does FarmBox compare to grocery store prices?",
      answer: "Our prices are competitive with organic produce at premium grocery stores, while offering significantly fresher, locally-sourced products. Many members find they actually save money by reducing food waste."
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-600">
            Can't find what you're looking for? <a href="/contact" className="text-green-600 hover:text-green-800">Contact our team</a>.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-200"
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-content-${index}`}
              >
                <h3 className="text-lg font-medium  text-gray-900">{item.question}</h3>
                <span className="ml-4 text-green-600 cursor-pointer">
                  {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>
              
              <div
                id={`faq-content-${index}`}
                className={`px-6 pb-6 pt-0 transition-all duration-300 ${activeIndex === index ? 'block' : 'hidden'}`}
              >
                <p className="text-gray-600 p-4">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
          >
            Contact Our Support Team
          </a>
        </div>
      </div>
    </div>
  );
}