import { Link } from 'react-router-dom';
import { Sprout, ShoppingCart, Landmark, ArrowRight, Handshake, Home } from 'lucide-react';

const features = [
  {
    icon: Sprout,
    title: 'For Farmers',
    description: 'List your produce, connect directly with retailers, and get fair prices for your harvest.',
  },
  {
    icon: ShoppingCart,
    title: 'For Retailers',
    description: 'Source fresh produce directly from local farmers with transparent pricing and reliable supply.',
  },
  {
    icon: Landmark,
    title: 'For Landowners',
    description: 'List your agricultural land for lease and connect with farmers looking for quality farmland.',
  },
];

const howItWorks = [
  {
    icon: Sprout,
    title: 'Harvest Pre-Booking',
    description: 'Farmers list upcoming harvests with quantity, price, and harvest date. Retailers browse, select quantity, and pre-book produce before it\'s harvested — securing supply and giving farmers guaranteed buyers.',
  },
  {
    icon: Handshake,
    title: 'Grow-to-Order',
    description: 'Retailers post crop requirements with quality specs, target price, and delivery date. Farmers submit bids with proposed price and harvest timeline. Retailers accept the best bid, creating a growing commitment.',
  },
  {
    icon: Home,
    title: 'Farmland Leasing',
    description: 'Landowners list agricultural land with acreage, rent, soil type, and irrigation details. Farmers apply with proposed rent and lease duration. Landowners approve applications, creating lease agreements with defined terms.',
  },
];

function HomePage() {
  function scrollToHowItWorks() {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-7 h-7 text-green-primary" />
            <span className="text-xl font-bold text-green-dark">Farm2Retail</span>
          </div>
          <Link
            to="/signup"
            className="bg-green-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-dark transition-colors no-underline"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-dark leading-tight">
          Farm Fresh to
          <span className="text-green-primary"> Retail Shelf</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          The agricultural marketplace connecting farmers, retailers, and landowners.
          Simpler supply chains, fairer prices, fresher produce.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-green-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-green-dark transition-colors"
          >
            Browse Marketplace
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={scrollToHowItWorks}
            className="inline-flex items-center justify-center gap-2 bg-white text-green-primary border-2 border-green-primary px-6 py-3 rounded-lg font-medium hover:bg-green-primary/5 transition-colors"
          >
            How It Works
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-green-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-green-primary" />
              </div>
              <h3 className="text-lg font-semibold text-green-dark mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white border-t border-gray-200">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-green-dark">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Three ways to connect — choose the model that fits your business
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((item) => (
            <div key={item.title} className="text-center p-6">
              <div className="w-16 h-16 bg-green-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-8 h-8 text-green-primary" />
              </div>
              <h3 className="text-xl font-semibold text-green-dark mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-500">
          <p>Farm2Retail — Agricultural Marketplace Demo</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
