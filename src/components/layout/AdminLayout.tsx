
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin" },
    { icon: <Package size={20} />, label: "Products", path: "/admin/products" },
    { icon: <Users size={20} />, label: "Users", path: "/admin/users" },
    { icon: <ShoppingBag size={20} />, label: "Orders", path: "/admin/orders" },
    { icon: <Settings size={20} />, label: "Settings", path: "/admin/settings" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside 
        className={`bg-electric-darkgray text-white fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-electric-blue rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">EC</span>
            </div>
            <span className="font-bold text-xl">Admin Panel</span>
          </div>

          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-electric-blue text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Link 
            to="/" 
            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200"
          >
            <LogOut size={20} />
            <span>Back to Website</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-20">
          <div className="flex items-center justify-between p-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-electric-blue flex items-center justify-center text-white">
                  A
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-sm">Admin User</p>
                  <p className="text-xs text-gray-500">admin@electrico.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
