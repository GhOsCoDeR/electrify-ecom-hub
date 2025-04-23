
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User } from "lucide-react";

const WebsiteNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-electric-blue rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">EC</span>
            </div>
            <span className="font-bold text-xl text-electric-darkgray">ElectriCo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-electric-darkgray hover:text-electric-blue transition-colors duration-300">Home</Link>
            <Link to="/about" className="text-electric-darkgray hover:text-electric-blue transition-colors duration-300">About</Link>
            <Link to="/services" className="text-electric-darkgray hover:text-electric-blue transition-colors duration-300">Services</Link>
            <Link to="/contact" className="text-electric-darkgray hover:text-electric-blue transition-colors duration-300">Contact</Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/shop">
              <Button className="btn-electric-primary">Shop Now</Button>
            </Link>
            <Link to="/cart" className="text-electric-darkgray hover:text-electric-blue">
              <ShoppingCart size={24} />
            </Link>
            <Link to="/login" className="text-electric-darkgray hover:text-electric-blue">
              <User size={24} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-electric-darkgray focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-electric-darkgray hover:text-electric-blue py-2" 
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-electric-darkgray hover:text-electric-blue py-2" 
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link 
                to="/services" 
                className="text-electric-darkgray hover:text-electric-blue py-2" 
                onClick={toggleMenu}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className="text-electric-darkgray hover:text-electric-blue py-2" 
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <div className="flex items-center justify-between py-2">
                <Link to="/shop" onClick={toggleMenu}>
                  <Button className="btn-electric-primary">Shop Now</Button>
                </Link>
                <div className="flex space-x-4">
                  <Link to="/cart" className="text-electric-darkgray hover:text-electric-blue" onClick={toggleMenu}>
                    <ShoppingCart size={24} />
                  </Link>
                  <Link to="/login" className="text-electric-darkgray hover:text-electric-blue" onClick={toggleMenu}>
                    <User size={24} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default WebsiteNavbar;
