import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const WebsiteNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to check if a link is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Style for active and inactive links
  const getLinkStyle = (path: string) => {
    return isActive(path) 
      ? "text-electric-blue font-medium border-b-2 border-electric-blue" 
      : "text-electric-darkgray hover:text-electric-blue transition-colors duration-300";
  };

  // Get user's name for welcome message
  const getUserName = () => {
    if (!profile) return null;
    return profile.first_name || profile.email.split('@')[0];
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-electric-blue rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">RH</span>
            </div>
            <span className="font-bold text-xl text-electric-darkgray">Royal Home Ghana</span>
          </Link>

          {/* Welcome message for logged in users */}
          {user && (
            <div className="hidden md:block text-sm font-medium text-electric-blue">
              Welcome, {getUserName()}!
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className={getLinkStyle("/")}>Home</Link>
            <Link to="/about" className={getLinkStyle("/about")}>About</Link>
            <Link to="/services" className={getLinkStyle("/services")}>Services</Link>
            <Link to="/contact" className={getLinkStyle("/contact")}>Contact</Link>
            <Link to="/shop" className={getLinkStyle("/shop")}>Shop</Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className={`${isActive('/cart') ? 'text-electric-blue' : 'text-electric-darkgray hover:text-electric-blue'} relative`}>
              <ShoppingCart size={24} />
              {getCartCount() > 0 && (
                <div className="absolute -top-2 -right-2 bg-electric-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {getCartCount()}
                </div>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/account" className={isActive('/account') ? 'text-electric-blue' : 'text-electric-darkgray hover:text-electric-blue'}>
                  <User size={24} />
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="text-electric-darkgray hover:text-electric-blue"
                >
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <Link to="/login" className={isActive('/login') ? 'text-electric-blue' : 'text-electric-darkgray hover:text-electric-blue'}>
                <User size={24} />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <div className="mr-4 text-xs font-medium text-electric-blue">
                Welcome, {getUserName()}!
              </div>
            )}
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
                className={`py-2 ${getLinkStyle("/")}`}
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`py-2 ${getLinkStyle("/about")}`}
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link 
                to="/services" 
                className={`py-2 ${getLinkStyle("/services")}`}
                onClick={toggleMenu}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className={`py-2 ${getLinkStyle("/contact")}`}
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <Link 
                to="/shop" 
                className={`py-2 ${getLinkStyle("/shop")}`}
                onClick={toggleMenu}
              >
                Shop
              </Link>
              <div className="flex items-center justify-between py-2">
                <div className="flex space-x-4">
                  <Link to="/cart" 
                    className={`${isActive('/cart') ? 'text-electric-blue' : 'text-electric-darkgray hover:text-electric-blue'} relative`}
                    onClick={toggleMenu}>
                    <ShoppingCart size={24} />
                    {getCartCount() > 0 && (
                      <div className="absolute -top-2 -right-2 bg-electric-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {getCartCount()}
                      </div>
                    )}
                  </Link>
                  
                  {user ? (
                    <>
                      <Link to="/account" 
                        className={isActive('/account') ? 'text-electric-blue' : 'text-electric-darkgray hover:text-electric-blue'}
                        onClick={toggleMenu}>
                        <User size={24} />
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
                        }}
                        className="text-electric-darkgray hover:text-electric-blue"
                      >
                        <LogOut size={24} />
                      </button>
                    </>
                  ) : (
                    <Link to="/login" 
                      className={isActive('/login') ? 'text-electric-blue' : 'text-electric-darkgray hover:text-electric-blue'}
                      onClick={toggleMenu}>
                      <User size={24} />
                    </Link>
                  )}
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
