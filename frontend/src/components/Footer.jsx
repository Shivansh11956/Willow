import { MessageSquare, Instagram, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = ({ id }) => {
  return (
    <footer id={id} className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold">Willow<span className="text-green-500">.</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              AI-powered chat moderation that detects toxic content and suggests polite alternatives. 
              Keep your conversations safe and professional.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Real-time Detection</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Smart Rephrasing</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Low Latency</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">AI Moderation</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-4 text-white">About</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              <li><Link to="/signup" className="text-gray-400 hover:text-white transition-colors">Get Started</Link></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="https://www.instagram.com/aditya86.76/" target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/Aditya8676" target="_blank" rel="noopener noreferrer"
               className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:aditya09313@gmail.com"
               className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
              <Mail className="w-5 h-5" />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Willow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;