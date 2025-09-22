
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/ui/breadcrumbs";

const ContactUs = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Insert form data to contact_submissions table
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form after successful submission
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs className="mb-6" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ceremonial-maroon mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-ceremonial-brown max-w-2xl mx-auto">
            Have questions about our services? We're here to help! Reach out to us anytime.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-display font-semibold mb-6 text-ceremonial-maroon">
              Get in Touch
            </h2>
            
            <div className="space-y-6">
              <Card className="p-6 flex items-start space-x-4 hover:shadow-md transition-shadow">
                <Mail className="w-6 h-6 text-ceremonial-gold mt-1" />
                <div>
                  <h3 className="font-semibold text-ceremonial-maroon mb-1">Email Support</h3>
                  <p className="text-gray-600 mb-2">support@subhakaryam.com</p>
                  <p className="text-sm text-gray-500">We typically respond within 2-4 hours</p>
                </div>
              </Card>

              <Card className="p-6 flex items-start space-x-4 hover:shadow-md transition-shadow">
                <Phone className="w-6 h-6 text-ceremonial-gold mt-1" />
                <div>
                  <h3 className="font-semibold text-ceremonial-maroon mb-1">Phone Support</h3>
                  <p className="text-gray-600 mb-2">+91 (800) 123-4567</p>
                  <p className="text-sm text-gray-500">Available Mon-Sat, 9 AM - 7 PM IST</p>
                </div>
              </Card>

              <Card className="p-6 flex items-start space-x-4 hover:shadow-md transition-shadow">
                <MapPin className="w-6 h-6 text-ceremonial-gold mt-1" />
                <div>
                  <h3 className="font-semibold text-ceremonial-maroon mb-1">Our Office</h3>
                  <p className="text-gray-600 mb-2">Hyderabad, Telangana, India</p>
                  <p className="text-sm text-gray-500">Serving across South India</p>
                </div>
              </Card>

              <Card className="p-6 flex items-start space-x-4 hover:shadow-md transition-shadow">
                <Clock className="w-6 h-6 text-ceremonial-gold mt-1" />
                <div>
                  <h3 className="font-semibold text-ceremonial-maroon mb-1">Business Hours</h3>
                  <p className="text-gray-600 mb-1">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                  <p className="text-gray-600 mb-2">Sunday: 10:00 AM - 5:00 PM</p>
                  <p className="text-sm text-gray-500">Emergency support available 24/7</p>
                </div>
              </Card>

              <Card className="p-6 flex items-start space-x-4 hover:shadow-md transition-shadow bg-ceremonial-cream">
                <MessageCircle className="w-6 h-6 text-ceremonial-gold mt-1" />
                <div>
                  <h3 className="font-semibold text-ceremonial-maroon mb-1">Live Chat</h3>
                  <p className="text-gray-600 mb-2">Get instant help with our chatbot</p>
                  <p className="text-sm text-gray-500">Available 24/7 for quick questions</p>
                </div>
              </Card>
            </div>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-2xl font-display font-semibold mb-6 text-ceremonial-maroon">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    How can we help?
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full min-h-[150px]"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
