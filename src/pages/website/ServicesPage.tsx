
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import { 
  Lightbulb, 
  Home, 
  Shield, 
  Settings, 
  Tool, 
  Zap, 
  Cpu, 
  WifiIcon, 
  Phone 
} from "lucide-react";

const services = [
  {
    id: 1,
    icon: <Lightbulb size={40} className="text-electric-blue" />,
    title: "Lighting Installation",
    description: "Professional installation of all lighting fixtures for residential and commercial properties. We handle everything from simple fixtures to complex lighting systems.",
    features: [
      "Fixture installation and replacement",
      "Recessed lighting installation",
      "Outdoor and landscape lighting",
      "LED upgrades and retrofitting",
      "Smart lighting solutions"
    ]
  },
  {
    id: 2,
    icon: <Home size={40} className="text-electric-blue" />,
    title: "Home Appliance Repair",
    description: "Expert repair services for all major household appliances. Our technicians are trained to diagnose and fix a wide range of issues with your appliances.",
    features: [
      "Refrigerator and freezer repair",
      "Washing machine and dryer service",
      "Dishwasher troubleshooting",
      "Oven and range repair",
      "Small appliance fixes"
    ]
  },
  {
    id: 3,
    icon: <Shield size={40} className="text-electric-blue" />,
    title: "Electrical Safety Inspections",
    description: "Comprehensive safety checks to ensure your electrical systems are up to code and operating safely. Identify potential hazards before they cause problems.",
    features: [
      "Electrical panel inspections",
      "Outlet and switch testing",
      "GFCI and AFCI verification",
      "Wiring assessments",
      "Safety certification"
    ]
  },
  {
    id: 4,
    icon: <Settings size={40} className="text-electric-blue" />,
    title: "System Maintenance",
    description: "Regular maintenance services to keep your electrical systems running smoothly. Prevent costly repairs with scheduled maintenance visits.",
    features: [
      "Preventative maintenance plans",
      "System cleaning and optimization",
      "Component testing and replacement",
      "Performance evaluation",
      "Documentation and reporting"
    ]
  },
  {
    id: 5,
    icon: <Tool size={40} className="text-electric-blue" />,
    title: "Electrical Panel Upgrades",
    description: "Modernize your electrical service panel to handle today's power demands. Ensure your system can safely support all your electrical needs.",
    features: [
      "Panel replacement",
      "Circuit breaker updates",
      "Amperage upgrades",
      "Code compliance updates",
      "Surge protection installation"
    ]
  },
  {
    id: 6,
    icon: <Zap size={40} className="text-electric-blue" />,
    title: "Power Backup Solutions",
    description: "Install and maintain backup power systems to keep your essential services running during outages. Peace of mind when you need it most.",
    features: [
      "Generator installation",
      "Battery backup systems",
      "UPS solutions",
      "Transfer switch setup",
      "Emergency power planning"
    ]
  },
  {
    id: 7,
    icon: <Cpu size={40} className="text-electric-blue" />,
    title: "Smart Home Integration",
    description: "Transform your home with integrated smart technology. Control lighting, appliances, security, and more from your smartphone or voice commands.",
    features: [
      "Smart hub installation",
      "Device integration",
      "Voice control setup",
      "Automation programming",
      "User training and support"
    ]
  },
  {
    id: 8,
    icon: <WifiIcon size={40} className="text-electric-blue" />,
    title: "Network Installation",
    description: "Professional installation and optimization of home and business networks. Ensure fast, reliable connections throughout your property.",
    features: [
      "WiFi network setup",
      "Wired network installation",
      "Network security",
      "Coverage optimization",
      "Equipment recommendations"
    ]
  },
];

const ServicesPage = () => {
  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="bg-electric-blue text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Professional electrical services delivered by certified technicians. From installation to repair, we've got you covered.
          </p>
        </div>
      </section>

      {/* Services Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Expert Electrical Services</h2>
              <p className="text-gray-700 mb-4">
                At ElectriCo, we offer comprehensive electrical services for residential and commercial properties. Our team of licensed electricians brings years of experience and expertise to every job.
              </p>
              <p className="text-gray-700 mb-6">
                Whether you need a simple repair, a complete installation, or ongoing maintenance, we deliver quality workmanship and exceptional customer service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button className="btn-electric-primary">Get a Quote</Button>
                </Link>
                <a href="tel:+15551234567">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Phone size={16} /> Call Us Now
                  </Button>
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1469&auto=format&fit=crop" 
                alt="ElectriCo Services" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-electric-lightgray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Service Offerings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="h-full">
                <CardContent className="p-6">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <h4 className="font-semibold text-lg mb-2">What's Included:</h4>
                  <ul className="list-disc pl-5 space-y-1 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">{feature}</li>
                    ))}
                  </ul>
                  
                  <Link to="/contact">
                    <Button className="w-full btn-electric-primary">Request Service</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Our Service Process</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            We follow a systematic approach to ensure efficient and effective service delivery for all your electrical needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-electric-blue text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Consultation</h3>
              <p className="text-gray-600">Discuss your needs and requirements with our experts.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-electric-blue text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Assessment</h3>
              <p className="text-gray-600">Our technicians evaluate your electrical systems and needs.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-electric-blue text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Implementation</h3>
              <p className="text-gray-600">Our certified experts perform the required service.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-electric-blue text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">4</div>
              <h3 className="text-xl font-semibold mb-2">Follow-up</h3>
              <p className="text-gray-600">We ensure your complete satisfaction with our work.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-electric-blue py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white text-opacity-90 max-w-2xl mx-auto mb-8">
            Contact us today to schedule a service appointment or to request a quote for your electrical project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-white text-electric-blue hover:bg-gray-100 font-medium px-6 py-3 h-auto">
                Contact Us
              </Button>
            </Link>
            <a href="tel:+15551234567">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium px-6 py-3 h-auto flex items-center gap-2">
                <Phone size={16} /> (555) 123-4567
              </Button>
            </a>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default ServicesPage;
