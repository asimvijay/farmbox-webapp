import Image from 'next/image';
import FarmerImage from '../../../../assets/images/farmer.webp';
import FarmImage from '../../../../assets/images/farm.jpg';
import TeamImage from '../../../../assets/images/farmer-team.png';

const AboutUs = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6">
            Our Story
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting local farmers with your family's table since 2015
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:flex items-center gap-12">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <Image
              src={FarmerImage}
              alt="Local farmer"
              className="rounded-lg shadow-xl"
              placeholder="blur"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-green-700 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              At FarmBox, we're revolutionizing the way you access fresh, local food. Our mission is to 
              create sustainable connections between small-scale farmers and urban communities, ensuring 
              fair prices for producers and the freshest seasonal produce for you.
            </p>
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Why We're Different</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Direct partnerships with 50+ local farms</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Harvested fresh, delivered within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% organic and sustainable farming practices</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Our Farm Network */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-700 mb-4">Our Farm Network</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We work with a carefully selected network of family farms within 100 miles of your community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 relative mb-4">
                <Image
                  src={FarmImage}
                  alt="Organic farm"
                  className="rounded-lg object-cover"
                  fill
                  placeholder="blur"
                />
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">Sustainable Practices</h3>
              <p className="text-gray-600">
                All our partner farms use organic methods that protect the land and produce healthier food.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 relative mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-20 w-20 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">Quality Standards</h3>
              <p className="text-gray-600">
                Rigorous quality checks ensure you receive only the freshest, most flavorful produce every time.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 relative mb-4">
                <Image
                  src={TeamImage}
                  alt="FarmBox team"
                  className="rounded-lg object-cover"
                  fill
                  placeholder="blur"
                />
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">Community Impact</h3>
              <p className="text-gray-600">
                We reinvest 5% of profits into local agricultural education programs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Meet Our Founders</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            FarmBox was started by a team of farmers, foodies, and tech enthusiasts who believe in better food systems
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              name: "Sarah Johnson",
              role: "CEO & Co-Founder",
              bio: "Former organic farmer with 15 years experience in sustainable agriculture.",
              fact: "Grows heirloom tomatoes in her backyard"
            },
            {
              name: "Michael Chen",
              role: "CTO & Co-Founder",
              bio: "Tech entrepreneur passionate about building systems that connect people with their food sources.",
              fact: "Can identify any vegetable by taste alone"
            },
            {
              name: "Elena Rodriguez",
              role: "Head of Farmer Relations",
              bio: "Fourth-generation farmer who now advocates for small farm sustainability.",
              fact: "Knows every farm in our network by heart"
            }
          ].map((person, index) => (
            <div key={index} className="text-center">
              <div className="h-48 w-48 mx-auto mb-6 rounded-full bg-green-100 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-green-500 text-4xl font-bold">
                  {person.name.charAt(0)}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{person.name}</h3>
              <p className="text-green-600 mb-3">{person.role}</p>
              <p className="text-gray-600 mb-4">{person.bio}</p>
              <p className="text-sm text-gray-500 italic">Fun fact: {person.fact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Food Revolution</h2>
          <p className="text-xl text-green-100 mb-8">
            Ready to experience the FarmBox difference? Get your first delivery today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors">
              Choose Your Box
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-green-700 transition-colors">
              Meet Our Farmers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;