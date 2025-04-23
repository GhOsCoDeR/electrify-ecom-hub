
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import { 
  Wrench, 
  ShieldCheck, 
  Lightbulb, 
  Cpu, 
  HomeIcon, 
  Zap, 
  CheckCircle, 
  Phone 
} from "lucide-react";

const ServicesPage = () => {
  // Service categories
  const services = [
    {
      id: 1,
      icon: <Wrench size={36} className="text-electric-blue" />,
      title: "Installation Services",
      description: "Professional installation of electrical systems, appliances, and fixtures by certified technicians.",
      features: [
        "Appliance installation and setup",
        "Lighting system installation",
        "Smart home device integration",
        "Electrical wiring and panel installation"
      ]
    },
    {
      id: 2,
      icon: <ShieldCheck size={36} className="text-electric-blue" />,
      title: "Maintenance & Repair",
      description: "Comprehensive maintenance and repair services to keep your electrical systems running smoothly.",
      features: [
        "Regular system checkups",
        "Emergency repair services",
        "Appliance troubleshooting",
        "Performance optimization"
      ]
    },
    {
      id: 3,
      icon: <Lightbulb size={36} className="text-electric-blue" />,
      title: "Lighting Solutions",
      description: "Design and implementation of energy-efficient lighting solutions for residential and commercial spaces.",
      features: [
        "Energy audit and consultation",
        "LED lighting upgrades",
        "Decorative lighting design",
        "Smart lighting systems"
      ]
    },
    {
      id: 4,
      icon: <Cpu size={36} className="text-electric-blue" />,
      title: "Smart Home Integration",
      description: "Transform your home with integrated smart technology for convenience, efficiency, and security.",
      features: [
        "Smart device consultation and planning",
        "Voice assistant integration",
        "Home automation system setup",
        "Remote control configuration"
      ]
    },
    {
      id: 5,
      icon: <HomeIcon size={36} className="text-electric-blue" />,
      title: "Home Energy Audits",
      description: "Comprehensive assessment of your home's energy usage with recommendations for improvements and savings.",
      features: [
        "Complete energy efficiency evaluation",
        "Utility bill analysis",
        "Insulation and air leakage testing",
        "Customized energy-saving recommendations"
      ]
    },
    {
      id: 6,
      icon: <Zap size={36} className="text-electric-blue" />,
      title: "Commercial Services",
      description: "Specialized electrical services for businesses, offices, retail spaces, and industrial facilities.",
      features: [
        "Commercial electrical system design",
        "Office equipment installation",
        "Industrial electrical maintenance",
        "Energy efficiency for businesses"
      ]
    }
  ];

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-electric-darkgray to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Professional Services</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            From installation to maintenance, we provide comprehensive electrical services
            delivered by certified professionals with a commitment to quality and safety.
          </p>
          <Link to="/contact">
            <Button className="btn-electric-primary px-8 py-6 text-lg">
              Schedule a Service
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Service Offerings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="bg-electric-blue/10 w-20 h-20 flex items-center justify-center rounded-full">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center">{service.title}</h3>
                  <p className="text-gray-600 mb-6 text-center">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle size={18} className="text-electric-blue mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t p-4 bg-gray-50">
                  <Link to="/contact">
                    <Button className="btn-electric-secondary w-full">Request Service</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Our Service Process</h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            We follow a systematic approach to ensure high-quality service delivery and customer satisfaction.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Consultation", desc: "We discuss your needs and assess the requirements" },
              { number: "02", title: "Quote", desc: "We provide a detailed and transparent service quote" },
              { number: "03", title: "Scheduling", desc: "We arrange a convenient time to perform the service" },
              { number: "04", title: "Execution", desc: "Our professionals complete the work with quality and care" }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-lg shadow-md p-6 text-center h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-electric-blue text-white text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <span className="text-4xl text-electric-blue">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The team at ElectriCo provided exceptional service when installing our home lighting system. Professional, punctual, and thorough!",
                name: "Sarah Johnson",
                title: "Homeowner"
              },
              {
                quote: "We contracted ElectriCo for our office's electrical maintenance. Their team was knowledgeable and efficient, causing minimal disruption to our operations.",
                name: "Michael Chen",
                title: "Office Manager"
              },
              {
                quote: "The smart home integration service exceeded my expectations. Now I can control everything from my phone, and the system works flawlessly.",
                name: "Daniel Rodriguez",
                title: "Tech Enthusiast"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-8 relative">
                <div className="text-5xl font-serif text-electric-blue/20 absolute top-4 left-4">"</div>
                <div className="relative z-10">
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-electric-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact our service team today to schedule a consultation or service appointment.
          </p>
          <Link to="/contact">
            <Button className="bg-white text-electric-blue hover:bg-gray-100 px-8 py-6 text-lg flex items-center mx-auto">
              <Phone size={20} className="mr-2" />
              Contact Us Now
            </Button>
          </Link>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default ServicesPage;
