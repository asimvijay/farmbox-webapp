import Head from 'next/head';

const WhereWeDeliver = () => {
  const areas = [
    "Clifton", "Defence", "DHA", "Bahadurabad", "Gulshan-e-Iqbal",
    "PECHS", "Saddar", "Karachi Cantt", "North Nazimabad", "Gulistan-e-Johar",
    "Malir", "Korangi", "Shah Faisal", "Landhi", "Orangi Town",
    "Lyari", "Nazimabad", "Garden", "Jamshed Town", "Airport Area"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Where We Deliver - FarmBox | Fresh Produce in Karachi</title>
        <meta name="description" content="Discover the areas in Karachi where FarmBox delivers fresh farm produce directly to your doorstep" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Where We Deliver</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Currently, we're proudly serving fresh farm produce to these areas in Karachi. 
            We're expanding our delivery network to reach more neighborhoods soon!
          </p>
        </section>

        {/* Delivery Areas Section */}
        <section className="mb-12">
          <div className="bg-green-50 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-green-700 mb-6 text-center">
              Delivery Areas in Karachi
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map((area, index) => (
                <div 
                  key={index} 
                  className="bg-white p-4 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <svg 
                      className="w-5 h-5 text-green-600 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">{area}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery Info Section */}
        <section className="bg-white rounded-lg p-6 shadow-md border border-green-100 mb-12">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Delivery Information</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              We deliver fresh farm produce to your doorstep <strong>6 days a week</strong> (Sunday to Friday).
            </p>
            <p>
              Cut-off time for next day delivery is <strong>6:00 PM</strong>.
            </p>
            <p>
              Minimum order amount: <strong>Rs. 1,000</strong>.
            </p>
            <p>
              Delivery charges may apply depending on your location.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-green-800 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Not seeing your area?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            We're expanding our delivery network across Karachi. Let us know your area, 
            and we'll notify you when we start delivering there!
          </p>
          <button className="bg-white text-green-800 font-semibold px-6 py-3 rounded-lg hover:bg-green-100 transition-colors">
            Request My Area
          </button>
        </section>
      </main>
    </div>
  );
};

export default WhereWeDeliver;