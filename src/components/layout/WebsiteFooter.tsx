import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const WebsiteFooter = () => {
  return (
    <footer className="bg-electric-darkgray text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-electric-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">RH</span>
              </div>
              <span className="font-bold text-xl">Royal Home Ghana</span>
            </div>
            <p className="mb-4 text-gray-300">
              Your trusted partner for quality home products in Ghana. Bringing comfort, style, and innovation to Ghanaian homes since 2010.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-electric-blue transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-electric-blue transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-electric-blue transition-colors duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-electric-blue transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-electric-blue transition-colors duration-300">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-electric-blue transition-colors duration-300">Services</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-electric-blue transition-colors duration-300">Contact</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-electric-blue transition-colors duration-300">Shop</Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-electric-blue transition-colors duration-300">All Products</Link>
              </li>
              <li>
                <Link to="/shop?category=furniture" className="text-gray-300 hover:text-electric-blue transition-colors duration-300">Furniture</Link>
              </li>
              <li>
                <Link to="/shop?category=kitchen" className="text-gray-300 hover:text-electric-blue transition-colors duration-300">Kitchen & Dining</Link>
              </li>
              <li>
                <Link to="/shop?category=decor" className="text-gray-300 hover:text-electric-blue transition-colors duration-300">Home Decor</Link>
              </li>
              <li>
                <Link to="/shop?category=garden" className="text-gray-300 hover:text-electric-blue transition-colors duration-300">Garden & Outdoor</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="flex-shrink-0 text-electric-blue" />
                <span className="text-gray-300">15 Independence Avenue, Accra, Ghana</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="flex-shrink-0 text-electric-blue" />
                <span className="text-gray-300">+233 302 123 456</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="flex-shrink-0 text-electric-blue" />
                <span className="text-gray-300">info@royalhomeghana.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-10 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Royal Home Ghana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default WebsiteFooter;
