
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import { 
  Lightning, 
  Zap, 
  Award, 
  Users, 
  Wrench, 
  ShieldCheck 
} from "lucide-react";

const HomePage = () => {
  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-electric-darkgray to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Powering Your World with Quality Electrical Solutions
              </h1>
              <p className="text-xl mb-8">
                Premium electrical appliances and expert services for homes and businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button className="btn-electric-primary px-8 py-6 text-lg">Shop Now</Button>
                </Link>
                <Link to="/services">
                  <Button className="btn-electric-secondary px-8 py-6 text-lg">Our Services</Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-2xl">
                <div className="w-72 h-72 bg-electric-blue rounded-full flex items-center justify-center">
                  <Lightning size={100} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ElectriCo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-electric-blue/10 w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6">
                <Award size={40} className="text-electric-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Products</h3>
              <p className="text-gray-600">
                We offer only the highest quality electrical appliances and products, ensuring durability and performance.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-electric-blue/10 w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6">
                <Zap size={40} className="text-electric-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">Energy Efficient</h3>
              <p className="text-gray-600">
                Our products are designed to be energy efficient, helping you save money and protect the environment.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-electric-blue/10 w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6">
                <Users size={40} className="text-electric-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Support</h3>
              <p className="text-gray-600">
                Our team of experienced professionals is always ready to help with installation, maintenance, and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/shop" className="text-electric-blue hover:underline font-medium">View All Products</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="bg-gray-100 p-6 flex items-center justify-center h-64">
                  <img
                    src="/placeholder.svg"
                    alt="Product"
                    className="max-h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Premium Electric Product</h3>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    High-quality electrical product with advanced features and energy efficiency.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-electric-blue">$299.99</span>
                    <Button className="btn-electric-primary">Add to Cart</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/shop">
              <Button className="btn-electric-secondary px-8">Browse All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Our Services</h2>
            <Link to="/services" className="text-electric-blue hover:underline font-medium">View All Services</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 flex items-start hover:shadow-lg transition-shadow duration-300">
              <div className="bg-electric-blue/10 w-16 h-16 flex items-center justify-center rounded-full mr-6">
                <Wrench size={30} className="text-electric-blue" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Installation Services</h3>
                <p className="text-gray-600 mb-4">
                  Professional installation of all electrical appliances and systems by our certified technicians.
                </p>
                <Link to="/services">
                  <Button className="btn-electric-secondary">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 flex items-start hover:shadow-lg transition-shadow duration-300">
              <div className="bg-electric-blue/10 w-16 h-16 flex items-center justify-center rounded-full mr-6">
                <ShieldCheck size={30} className="text-electric-blue" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Maintenance & Repair</h3>
                <p className="text-gray-600 mb-4">
                  Regular maintenance and prompt repair services to keep your electrical systems running efficiently.
                </p>
                <Link to="/services">
                  <Button className="btn-electric-secondary">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-electric-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Electrify Your Life?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Browse our wide range of high-quality electrical products or schedule a service appointment today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/shop">
              <Button className="bg-white text-electric-blue hover:bg-gray-100 px-8 py-6 text-lg">Shop Products</Button>
            </Link>
            <Link to="/contact">
              <Button className="bg-transparent border border-white text-white hover:bg-white/10 px-8 py-6 text-lg">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default HomePage;
