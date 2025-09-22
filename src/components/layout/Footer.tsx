
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = 'https://subhakaryam.org/#services-section';
    }
  };

  return (
    <footer className="bg-ceremonial-maroon text-white py-12 px-4 selection:bg-ceremonial-gold selection:text-ceremonial-maroon">
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-display font-bold text-xl mb-4 text-white">Subhakaryam</h3>
            <p className="text-sm text-white/80 mb-4">
              Making sacred ceremonies accessible and memorable for everyone. Connecting families with trusted traditional service providers across India.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-3">
              <a href="#" className="text-white/80 hover:text-ceremonial-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-ceremonial-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-ceremonial-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-ceremonial-gold transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-white/80 hover:text-ceremonial-gold transition-colors">About Us</Link></li>
              <li>
                <button 
                  onClick={scrollToServices}
                  className="text-white/80 hover:text-ceremonial-gold transition-colors"
                >
                  Services
                </button>
              </li>
              <li><Link to="/blog" className="text-white/80 hover:text-ceremonial-gold transition-colors">Blog</Link></li>
              <li><Link to="/track-booking" className="text-white/80 hover:text-ceremonial-gold transition-colors">Track Booking</Link></li>
              <li><Link to="/contact" className="text-white/80 hover:text-ceremonial-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Our Services</h4>
            <ul className="space-y-2">
              <li><Link to="/services/pooja-services" className="text-white/80 hover:text-ceremonial-gold transition-colors">Pooja Services</Link></li>
              <li><Link to="/services/wedding-photography" className="text-white/80 hover:text-ceremonial-gold transition-colors">Photography</Link></li>
              <li><Link to="/services/mehendi-artists" className="text-white/80 hover:text-ceremonial-gold transition-colors">Mehendi Artists</Link></li>
              <li><Link to="/services/catering" className="text-white/80 hover:text-ceremonial-gold transition-colors">Catering</Link></li>
              <li><Link to="/services/decoration" className="text-white/80 hover:text-ceremonial-gold transition-colors">Decoration</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-ceremonial-gold" />
                <span className="text-sm text-white/80">info@subhakaryam.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-ceremonial-gold" />
                <span className="text-sm text-white/80">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-ceremonial-gold" />
                <span className="text-sm text-white/80">Hyderabad, Telangana, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-white/20 pt-6 mb-6">
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/policies/privacy-policy" className="text-sm text-white/80 hover:text-ceremonial-gold transition-colors">
              Privacy Policy
            </Link>
            <Link to="/policies/terms-conditions" className="text-sm text-white/80 hover:text-ceremonial-gold transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/policies/shipping-delivery" className="text-sm text-white/80 hover:text-ceremonial-gold transition-colors">
              Shipping & Delivery
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-white/80">
          <p>© 2024 Subhakaryam. All rights reserved. | Made with ❤️ for Traditional Indian Ceremonies</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
