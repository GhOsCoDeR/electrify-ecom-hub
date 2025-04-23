
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send
} from "lucide-react";
import WebsiteLayout from "@/components/layout/WebsiteLayout";

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="bg-electric-blue text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Get in touch with our team for inquiries, quotes, or support. We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-blue bg-opacity-10 mb-4">
                <Phone size={28} className="text-electric-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Our support team is available to help</p>
              <a href="tel:+15551234567" className="font-semibold text-electric-blue hover:underline">
                (555) 123-4567
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-blue bg-opacity-10 mb-4">
                <Mail size={28} className="text-electric-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">Send us an email anytime</p>
              <a href="mailto:info@electrico.com" className="font-semibold text-electric-blue hover:underline">
                info@electrico.com
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-blue bg-opacity-10 mb-4">
                <MapPin size={28} className="text-electric-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">Our showroom and service center</p>
              <address className="font-semibold text-electric-blue not-italic">
                123 Electric Avenue<br />
                Circuit City, ST 10001
              </address>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please provide details about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="btn-electric-primary w-full md:w-auto px-8" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} /> Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
            
            {/* Map and Hours */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6">Our Location</h2>
                {/* Placeholder for map - in a real project, would integrate Google Maps */}
                <div className="bg-gray-200 rounded-lg h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">Map placeholder - Google Maps would be integrated here</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-6">Business Hours</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock size={24} className="text-electric-blue flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Store Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock size={24} className="text-electric-blue flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Service Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                      <p className="text-gray-600">Saturday: By Appointment Only</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-6">
                    <p className="text-gray-600">
                      <span className="font-semibold">Emergency Service:</span> Available 24/7. Additional charges may apply for after-hours service calls.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-electric-lightgray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Do you offer free estimates?</h3>
              <p className="text-gray-600">
                Yes, we provide free estimates for most projects. Contact us to schedule an appointment with one of our specialists.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Are your technicians certified?</h3>
              <p className="text-gray-600">
                All our technicians are fully licensed, insured, and certified in their respective areas of expertise.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Do you offer warranties on your work?</h3>
              <p className="text-gray-600">
                Yes, we provide a 1-year warranty on all our service work and honor manufacturer warranties on products we sell.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">What forms of payment do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, cash, checks, and offer financing options for larger projects.
              </p>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default ContactPage;
