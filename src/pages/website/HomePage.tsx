
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  Lightbulb, 
  Shield, 
  Settings, 
  Tool, 
  Home, 
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import WebsiteLayout from "@/components/layout/WebsiteLayout";

// Temporary images (in a real project, these would be imported or from public folder)
const heroImage = "https://images.unsplash.com/photo-1601752943749-7dd8d89f407a?q=80&w=1470&auto=format&fit=crop";
const aboutImage = "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1469&auto=format&fit=crop";

const featuredProducts = [
  {
    id: 1,
    name: "Smart LED Bulb",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?q=80&w=880&auto=format&fit=crop",
    category: "Lighting",
  },
  {
    id: 2,
    name: "Electric Coffee Maker",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1570942872213-1242e212d760?q=80&w=1374&auto=format&fit=crop",
    category: "Kitchen Appliances",
  },
  {
    id: 3,
    name: "Wireless Vacuum Cleaner",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=880&auto=format&fit=crop",
    category: "Home Appliances",
  },
  {
    id: 4,
    name: "Smart Home Hub",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1470&auto=format&fit=crop",
    category: "Smart Devices",
  },
];

const services = [
  {
    icon: <Lightbulb size={36} className="text-electric-blue" />,
    title: "Lighting Installation",
    description: "Professional installation of all lighting fixtures for your home and business.",
  },
  {
    icon: <Home size={36} className="text-electric-blue" />,
    title: "Home Appliance Repair",
    description: "Expert repair services for all major household appliances.",
  },
  {
    icon: <Shield size={36} className="text-electric-blue" />,
    title: "Electrical Safety Inspection",
    description: "Comprehensive safety checks to ensure your electrical systems are up to code.",
  },
  {
    icon: <Settings size={36} className="text-electric-blue" />,
    title: "System Maintenance",
    description: "Regular maintenance services to keep your electrical systems running smoothly.",
  },
];

const HomePage = () => {
  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powering Your <span className="text-electric-blue">Electrical Needs</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Quality electrical appliances, professional services, and innovative solutions for homes and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button className="btn-electric-primary text-base px-6 py-3 h-auto">
                  Shop Products
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 text-base px-6 py-3 h-auto">
                  Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-electric-lightgray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ElectriCo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-blue bg-opacity-10 mb-4">
                <Zap size={32} className="text-electric-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">
                Premium electrical appliances from trusted brands with extended warranties.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-blue bg-opacity-10 mb-4">
                <Tool size={32} className="text-electric-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Services</h3>
              <p className="text-gray-600">
                Licensed professionals providing installation, repair, and maintenance services.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-blue bg-opacity-10 mb-4">
                <Shield size={32} className="text-electric-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Satisfaction Guarantee</h3>
              <p className="text-gray-600">
                100% satisfaction guarantee with our products and services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/shop" className="flex items-center text-electric-blue hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link to={`/shop/product/${product.id}`} key={product.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-electric-blue">{product.category}</p>
                    <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold">${product.price}</span>
                      <Button variant="ghost" size="sm" className="text-electric-blue p-0 hover:bg-transparent">
                        <ArrowRight size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-electric-lightgray">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src={aboutImage} 
                alt="About ElectriCo" 
                className="rounded-lg shadow-lg w-full h-auto" 
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">About ElectriCo</h2>
              <p className="text-gray-600 mb-4">
                Since 1995, ElectriCo has been providing high-quality electrical appliances and professional services to homes and businesses. Our team of certified electricians and product specialists are dedicated to offering the best solutions for all your electrical needs.
              </p>
              <p className="text-gray-600 mb-6">
                With a focus on quality, safety, and customer satisfaction, we've grown to become a trusted name in the electrical industry. Our extensive range of products and services ensures that we can meet all your electrical requirements under one roof.
              </p>
              <Link to="/about">
                <Button className="btn-electric-primary">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Services</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            We offer a comprehensive range of electrical services for residential and commercial properties, delivered by our team of certified professionals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link 
                  to="/services" 
                  className="text-electric-blue hover:text-electric-lightblue flex items-center"
                >
                  Learn more <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/services">
              <Button className="btn-electric-primary">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-electric-blue py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Shop?</h2>
          <p className="text-white text-opacity-90 max-w-2xl mx-auto mb-8">
            Browse our extensive range of electrical appliances and smart devices. Find the perfect products for your home or business.
          </p>
          <Link to="/shop">
            <Button className="bg-white text-electric-blue hover:bg-gray-100 font-medium px-6 py-3 h-auto">
              Visit Our Online Shop
            </Button>
          </Link>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default HomePage;
