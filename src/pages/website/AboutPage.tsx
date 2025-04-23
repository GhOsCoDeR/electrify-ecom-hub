
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Award, Users, Clock } from "lucide-react";

const AboutPage = () => {
  // Company history milestones
  const milestones = [
    {
      year: "1995",
      title: "Company Founded",
      description: "ElectriCo was established as a small electrical repair shop."
    },
    {
      year: "2000",
      title: "Expanded Services",
      description: "Added retail operations selling quality electrical appliances."
    },
    {
      year: "2008",
      title: "New Headquarters",
      description: "Moved to our current location with expanded showroom and service center."
    },
    {
      year: "2015",
      title: "E-Commerce Launch",
      description: "Launched our online store to reach customers nationwide."
    },
    {
      year: "2020",
      title: "Smart Home Division",
      description: "Created dedicated division for smart home products and installation."
    }
  ];

  // Team members
  const teamMembers = [
    {
      name: "John Smith",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1374&auto=format&fit=crop",
      bio: "With over 25 years of experience in the electrical industry, John founded ElectriCo with a vision to provide quality products and exceptional service."
    },
    {
      name: "Sarah Johnson",
      role: "Technical Director",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1374&auto=format&fit=crop",
      bio: "Sarah oversees all technical operations and ensures our installation and repair services meet the highest standards."
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1374&auto=format&fit=crop",
      bio: "Michael curates our product selection, identifying the best electrical appliances from around the world."
    },
    {
      name: "Lisa Rodriguez",
      role: "Customer Service Manager",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1398&auto=format&fit=crop",
      bio: "Lisa leads our customer service team, ensuring every client receives personalized attention and support."
    }
  ];

  // Values
  const values = [
    {
      icon: <ShieldCheck className="text-electric-blue h-12 w-12" />,
      title: "Quality",
      description: "We only offer products and services that meet our high standards for performance and reliability."
    },
    {
      icon: <Users className="text-electric-blue h-12 w-12" />,
      title: "Customer Focus",
      description: "Our customers are at the heart of everything we do, from product selection to after-sales support."
    },
    {
      icon: <Award className="text-electric-blue h-12 w-12" />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our business, continuously improving our processes."
    },
    {
      icon: <Clock className="text-electric-blue h-12 w-12" />,
      title: "Reliability",
      description: "We understand the importance of reliability in electrical products and services, and deliver accordingly."
    }
  ];

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="bg-electric-blue text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About ElectriCo</h1>
            <p className="text-xl opacity-90">
              Your trusted partner for all electrical appliances and services since 1995.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop" 
                alt="ElectriCo Store" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                ElectriCo was founded in 1995 with a simple mission: to provide quality electrical products and reliable services at fair prices. What began as a small repair shop has grown into a comprehensive electrical solutions provider for homes and businesses alike.
              </p>
              <p className="text-gray-700 mb-4">
                Over the years, we've expanded our offerings to include a wide range of electrical appliances, smart home devices, and professional services. Our team of certified electricians and product specialists are dedicated to helping customers find the right solutions for their electrical needs.
              </p>
              <p className="text-gray-700">
                Today, ElectriCo serves thousands of customers both through our physical store and our e-commerce platform. We remain committed to our founding principles of quality, reliability, and excellent customer service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-electric-lightgray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company History Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-electric-blue"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative">
                  <div className="md:flex items-center">
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:order-last'}`}>
                      <div className="bg-white p-5 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-electric-blue">{milestone.year}</h3>
                        <h4 className="text-lg font-medium mt-1">{milestone.title}</h4>
                        <p className="text-gray-600 mt-2">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Timeline dot */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-electric-blue border-4 border-white"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-electric-lightgray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Leadership Team</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Meet the dedicated professionals who lead ElectriCo and uphold our commitment to quality and exceptional service.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-xl">{member.name}</h3>
                  <p className="text-electric-blue mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials or Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Our Customers Trust Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-electric-blue mb-2">25+</div>
              <p className="text-xl">Years in Business</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-electric-blue mb-2">10,000+</div>
              <p className="text-xl">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-electric-blue mb-2">100%</div>
              <p className="text-xl">Satisfaction Guarantee</p>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default AboutPage;
