import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import { 
  Zap, 
  Award, 
  Users, 
  Wrench, 
  ShieldCheck,
  ShoppingCart 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { ParticlesBackground } from "@/components/effects/ParticlesBackground";

const HomePage = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Electric Product",
      price: 299.99,
      image: "/placeholder.svg",
      rating: 5,
      description: "High-quality electrical product with advanced features and energy efficiency."
    },
    {
      id: 2,
      name: "Premium Electric Product",
      price: 299.99,
      image: "/placeholder.svg",
      rating: 5,
      description: "High-quality electrical product with advanced features and energy efficiency."
    },
    {
      id: 3,
      name: "Premium Electric Product",
      price: 299.99,
      image: "/placeholder.svg",
      rating: 5,
      description: "High-quality electrical product with advanced features and energy efficiency."
    }
  ];

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    };
    
    addToCart(cartItem);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] bg-gradient-to-r from-electric-darkgray to-gray-800 text-white py-20 overflow-hidden">
        <ParticlesBackground variant="hero" className="opacity-60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                Powering Your World with Quality Electrical Solutions
              </h1>
              <p className="text-xl mb-8 animate-fade-in animation-delay-200">
                Premium electrical appliances and expert services for homes and businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-400">
                <Link to="/shop">
                  <Button className="btn-electric-primary px-8 py-6 text-lg hover:scale-105 transition-transform">Shop Now</Button>
                </Link>
                <Link to="/services">
                  <Button className="btn-electric-secondary px-8 py-6 text-lg hover:scale-105 transition-transform">Our Services</Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="w-72 h-72 bg-electric-blue rounded-full flex items-center justify-center animate-pulse">
                  <Zap size={100} className="text-white animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative min-h-[500px] py-20 overflow-hidden">
        <ParticlesBackground variant="features" className="opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">Why Choose ElectriCo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-electric-blue/10 w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6 animate-pulse-glow">
                <Award size={40} className="text-electric-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Products</h3>
              <p className="text-gray-600">
                We offer only the highest quality electrical appliances and products, ensuring durability and performance.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-electric-blue/10 w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6 animate-pulse-glow">
                <Zap size={40} className="text-electric-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">Energy Efficient</h3>
              <p className="text-gray-600">
                Our products are designed to be energy efficient, helping you save money and protect the environment.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-electric-blue/10 w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6 animate-pulse-glow">
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
      <section className="relative min-h-[500px] py-20 bg-gray-50 overflow-hidden">
        <ParticlesBackground variant="products" className="opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold animate-fade-in">Featured Products</h2>
            <Link to="/shop" className="text-electric-blue hover:underline font-medium hover:scale-105 transition-transform">
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-gray-100 p-6 flex items-center justify-center h-64">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(product.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-electric-blue">₵{product.price.toFixed(2)}</span>
                    <Button 
                      className="btn-electric-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingCart size={16} className="mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/shop">
              <Button className="btn-electric-secondary px-8 hover:scale-105 transition-transform">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="relative min-h-[500px] py-20 overflow-hidden">
        <ParticlesBackground variant="services" className="opacity-25" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold animate-fade-in">Our Services</h2>
            <Link to="/services" className="text-electric-blue hover:underline font-medium hover:scale-105 transition-transform">
              View All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 flex items-start hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-electric-blue/10 w-16 h-16 flex items-center justify-center rounded-full mr-6 animate-pulse-glow">
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
            <div className="bg-white rounded-lg shadow-md p-8 flex items-start hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-electric-blue/10 w-16 h-16 flex items-center justify-center rounded-full mr-6 animate-pulse-glow">
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
      <section className="relative min-h-[400px] py-16 bg-electric-blue text-white overflow-hidden">
        <ParticlesBackground variant="cta" className="opacity-40" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4 animate-fade-in">Ready to Electrify Your Life?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-200">
            Browse our wide range of high-quality electrical products or schedule a service appointment today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animation-delay-400">
            <Link to="/shop">
              <Button className="bg-white text-electric-blue hover:bg-gray-100 px-8 py-6 text-lg hover:scale-105 transition-transform">
                Shop Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="bg-transparent border border-white text-white hover:bg-white/10 px-8 py-6 text-lg hover:scale-105 transition-transform">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default HomePage;
